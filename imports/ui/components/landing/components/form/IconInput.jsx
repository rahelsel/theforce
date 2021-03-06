import React, { Fragment } from "react";
import { withStyles } from "material-ui/styles";
import PropTypes from "prop-types";

import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import Icon from "material-ui/Icon";
import TextField from "material-ui/TextField";
import * as helpers from "../jss/helpers.js";
import { findDOMNode } from "react-dom";

const InputIcon = props => <Icon color="disabled">{props.iconName}</Icon>;

const styles = {
  label: {
    color: helpers.defaultInputColor
  },
  root: {
    fontWeight: 500
  }
};

class IconInput extends React.Component {
  state = {
    inputFocused: false
  };
  onFocus = () => {
    this.setState({ inputFocused: true });
  };
  onBlur = () => {
    this.setState({ inputFocused: false });
  };

  render() {
    let inputRef;
    const props = this.props;
    const { classes } = props;
    const setInputRef = ref => (inputRef = ref);

    if (props.googlelocation) {
      setTimeout(() => {
        const that = this;
        let options = { strictBounds: true, types: ["geocode"] };
        //Google's API
        autocomplete = new google.maps.places.Autocomplete(inputRef, options);
        // This runs when user changes location.
        autocomplete.addListener("place_changed", function () {
          const coords = [];
          const place = this.getPlace();
          coords[0] = place.geometry["location"] && place.geometry["location"].lat();
          coords[1] = place.geometry["location"] && place.geometry["location"].lng();
          that.setState({ value: place.formatted_address });
          props.onLocationChange({
            name: place.name,
            coords,
            fullAddress: place.formatted_address
          });
        });
      }, 2000);
    }

    // console.log(props.onRef,"this is icon input...");
    return (
      <Fragment>
        {!props.skillShapeInput ? (
          <FormControl
            error={props.error}
            fullWidth
            aria-describedby="error-text"
          >
            <InputLabel
              htmlFor={props.inputId}
              classes={{ root: props.classes.label }}
            >
              {props.labelText}
            </InputLabel>
            <Input
              inputRef={props.onRef || setInputRef}
              autoFocus={props.autoFocus}
              value={props.value}
              disabled={props.disabled}
              multiline={props.multiline}
              rows={props.rows}
              type={props.type}
              defaultValue={props.defaultValue}
              id={props.inputId}
              onChange={props.onChange}
              endAdornment={
                <InputAdornment position="end">
                  <InputIcon iconName={props.iconName} />
                </InputAdornment>
              }
              inputProps={{
                inputRef: props.onRef || setInputRef,
                min: props.min,
                max: props.max
              }}
              classes={{
                root: classes.root
              }}
            />
            {props.error && (
              <FormHelperText id="error-text">{props.errorText}</FormHelperText>
            )}
          </FormControl>
        ) : (
            <FormControl
              error={props.error}
              fullWidth
              aria-describedby="error-text"
            >
              <div
                className={
                  this.state.inputFocused
                    ? `rw-multiselect rw-widget rw-state-focus ${props.classes.widgetRoot}` : `rw-multiselect rw-widget ${props.classes.widgetRoot}`
                }
              >
                <div
                  tabindex="0"
                  className={`rw-widget-input rw-widget-picker rw-widget-container ${props.classes.widgetInput}`}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      paddingRight: 10
                    }}
                  >
                    <input
                      ref={props.onRef || setInputRef}
                      value={props.value}
                      disabled={props.disabled}
                      multiline={props.multiline}
                      rows={props.rows}
                      type={props.type}
                      defaultValue={props.defaultValue}
                      id={props.inputId}
                      onChange={props.onChange}
                      placeholder={props.placeholder}
                      className={"rw-input-reset" + " " + classes.root}
                      style={{ width: "100%" }}
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
                      endAdornment={
                        <InputAdornment position="end">
                          <InputIcon iconName={props.iconName} />
                        </InputAdornment>
                      }
                      inputProps={{
                        min: props.min,
                        max: props.max
                      }}
                    />
                    <InputIcon iconName={props.iconName} />
                  </div>
                </div>
              </div>
            </FormControl>
          )}
      </Fragment>
    );
  }
}

IconInput.propTypes = {
  iconName: PropTypes.string,
  type: PropTypes.string,
  defaultValue: PropTypes.string,
  inputId: PropTypes.string,
  placeHolder: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
  googlelocation: PropTypes.bool,
  error: PropTypes.boolean,
  errorText: PropTypes.string,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  classes: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  rows: PropTypes.number
};

IconInput.defaultProps = {
  type: "text",
  disabled: false,
  multiline: false,
  value: "",
  rows: 6
};
export default withStyles(styles)(IconInput);
