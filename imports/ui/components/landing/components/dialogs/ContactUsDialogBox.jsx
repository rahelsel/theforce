import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PrimaryButton from '../buttons/PrimaryButton';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';
import styled from 'styled-components';

import IconInput from '../form/IconInput.jsx';

import { MuiThemeProvider} from 'material-ui/styles';
import {withStyles} from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';
import muiTheme from '../jss/muitheme.jsx';

import Dialog , {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

import { ContainerLoader } from '/imports/ui/loading/container';

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv * 3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      '@media screen and (max-width : 500px)': {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      flexShrink: 0,
      '@media screen and (max-width : 500px)': {
        minHeight: '150px'
      }
    },
    dialogActionsRoot: {
      padding: '0 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-start'
    },
    dialogActions: {
      width: '100%',
      paddingLeft: `${helpers.rhythmDiv * 2}px`
    },
    dialogRoot: {
      width: '100%'
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    }
  }
}

const Link = styled.a`
  color:${helpers.textColor};
  &:hover {
    color:${helpers.focalColor};
  }
`;

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;


const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const DialogActionText = styled.p`
  margin: 0;
  margin-right: ${helpers.rhythmDiv}px;
  flex-shrink: 0;
`;

const ActionWrapper = styled.div`
  width: 100%;
  ${helpers.flexCenter}
  justify-content: flex-end;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ContactUsDialogBox extends Component {

  state = {
    subject: '',
    message: ''
  }

  handleInputFieldChange = (fieldName) => (e) => {
    this.setState({
      [fieldName] : e.target.value
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    if(this.props.onFormSubmit) {
      this.props.onFormSubmit();
    }

    this.props.onModalClose();
  }

  render() {
    const {props} = this;
    console.log(props,"...");
    return (
      <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby="contact us"
        classes={{paper: props.classes.dialogRoot}}
      >
      <MuiThemeProvider theme={muiTheme}>
        <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
          <DialogTitleWrapper>
              <Title>Contact Us</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
        </DialogTitle>

        <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper>
                <IconInput inputId="subject" labelText="Subject" value={this.state.subject} onChange={this.handleInputFieldChange('subject')}/>
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="message" labelText="Your message goes here" multiline={true} value={this.state.message} onChange={this.handleInputFieldChange('message')} />
              </InputWrapper>

              <ButtonWrapper>
                  <PrimaryButton
                      type="submit"
                      label="Send Message"
                      noMarginBottom
                      onClick={this.handleFormSubmit}
                  />
              </ButtonWrapper>
            </form>
        </DialogContent>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ContactUsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  onHandleInputChange: PropTypes.func,
  onModalClose: PropTypes.func,
  loading: PropTypes.bool,
}

export default withMobileDialog()(withStyles(styles)(ContactUsDialogBox));
