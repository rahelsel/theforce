import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Paper from 'material-ui/Paper';

import ClearIcon from 'material-ui-icons/Clear';
import SearchIcon from 'material-ui-icons/Search';
import { grey } from 'material-ui/colors';

const styles = {
  root: {
    height: '100%',
    width: '100%',
    padding: '0 8px',
    borderRadius: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    boxShadow: `0px 1px 0px 0px rgba(0, 0, 0, 0.1), 0px 2px 0px 0px rgba(0, 0, 0, 0.1), 0px 3px 1px -2px rgba(0, 0, 0, 0.05);`
  },
  iconButtonRoot : {
    height: 32,
    width: 32,
    transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  defaultBorderRadius: {
    borderRadius: 2
  },
  searchContainer: {

  },
  hide: {
    position: 'absolute',
    opacity: 0,
    transform: 'scale(0,0)'
  },
  show: {
    opacity: 1,
    transform: 'scale(1,1)'
  },
  iconTransitions: {
    transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
}

const iconTransitions = {
  transition: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
}

const LeftSideInput = styled.div`
  display: ${props => props.inputOnSide === 'left' ? 'block' : 'none'};
`;

const RightSideInput = styled.div`
  display: ${props => props.inputOnSide === 'right' ? 'block' : 'none'};
`;

class MySearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      focus: false,
      value: this.props.value,
      active: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({...this.state, value: nextProps.value});
    }
  }

  handleFocus = () => {
    this.setState({focus: true});
  }

  handleBlur = () => {
    this.setState({focus: false});
    if (this.state.value.trim().length === 0) {
      this.setState({value: ''});
    }
  }

  handleInput = (e) => {
    // this.setState({value: e.target.value})
    this.setState({
      value: e.target.value,
      active: e.target.value !== '' ? true : false
    });

    this.props.onChange && this.props.onChange(e);
  }

  handleCancel = () => {
    this.setState({active: false, value: ''})
    this.props.onChange && this.props.onChange('');
  }

  handleKeyPressed = (e) => {
    if (e.charCode === 13 || e.key === 'Enter') {
      this.props.onRequestSearch(this.state.value);
    }
  }

  _getCloseIconClassName = (active,classes) => {
    return active ? classes.show : classes.hide;
  }

  _getShowIconClassName = (active,classes) => {
    return active ? classes.hide : classes.show;
  }
  render () {
    const { value } = this.state;
    // console.log('value this.state',this.state);
    const {
      closeIcon,
      disabled,
      onRequestSearch, // eslint-disable-line
      searchIcon,
      classes,
      ...inputProps
    } = this.props;

    let closeIconClass = classes.iconButtonRoot + ' ' + this._getCloseIconClassName(this.state.active,classes);
    let showIconClass = classes.iconButtonRoot + ' ' + this._getShowIconClassName(this.state.active,classes);
    let rootClass = `${classes.root} `;
    if(this.props.defaultBorderRadius) {
      rootClass += `${classes.defaultBorderRadius}`;
    }

    // console.log('clostIconClass',closeIconClass,showIconClass);
    return (
      <Paper className={rootClass} >
        <LeftSideInput inputOnSide={this.props.inputOnSide}>
          <Input
          {...inputProps}
          onBlur={this.handleBlur}
          value={value}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyPressed}
          onFocus={this.handleFocus}
          fullWidth
          disableUnderline={true}
          disabled={disabled}
          />
        </LeftSideInput>
        <IconButton
          style={styles.iconTransitions}
          className={showIconClass}
          disabled={disabled}
        >
          {React.cloneElement(searchIcon)}
        </IconButton>
        <IconButton
          style={styles.iconTransitions}
          onClick={this.handleCancel}
          className={closeIconClass}
          disabled={disabled}
        >
          {React.cloneElement(closeIcon)}
        </IconButton>
        <RightSideInput inputOnSide={this.props.inputOnSide}>
          <Input
          {...inputProps}
          onBlur={this.handleBlur}
          value={value}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyPressed}
          onFocus={this.handleFocus}
          fullWidth
          disableUnderline={true}
          disabled={disabled}
          />
        </RightSideInput>
      </Paper>
    )
  }
}

MySearchBar.defaultProps = {
  closeIcon: <ClearIcon style={{ color: grey[500] }} />,
  disabled: false,
  placeholder: 'Search',
  searchIcon: <SearchIcon style={{ color: grey[500] }} />,
  style: null,
  value: '',
  inputOnSide: 'left',
  defaultBorderRadius: false
}

MySearchBar.propTypes = {
  // This specifies the side in the bar where there is input.
  inputOnSide: PropTypes.string,

  closeIcon: PropTypes.node,

  disabled: PropTypes.bool,
  /** Sets placeholder for the embedded text field. */
  placeholder: PropTypes.string,
  /** Fired when the text value changes. */
  onChange: PropTypes.func,
  /** Fired when the search icon is clicked. */
  onRequestSearch: PropTypes.func.isRequired,
  searchIcon: PropTypes.node,
  value: PropTypes.string,
}

export default withStyles(styles)(MySearchBar);
