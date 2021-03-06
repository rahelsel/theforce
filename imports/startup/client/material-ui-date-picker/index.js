import React, { Component } from 'react';
import { DatePicker } from 'material-ui-pickers';
import TextField from 'material-ui/TextField';


export class MaterialDatePicker extends React.PureComponent {
    // componentWillReceiveProps(nextProps, nextState) {
    //     console.info('info,,,,,', nextProps, this.props);
    // }

    render() {
        const {
            required,
            hintText,
            floatingLabelText,
            value,
            emptyLabel,
            fullWidth,
            format
        } = this.props;
        // console.log("RENDERING >>>>>>>>>>>>>>>>> ")
        return (
            <div className="picker">
                <DatePicker
                    required={required}
                    hintText={hintText}
                    format={format}
                    floatingLabelText={floatingLabelText}
                    value={value}
                    emptyLabel={emptyLabel || ""}
                    onChange={this.props.onChange}
                    fullWidth={fullWidth}
                    TextFieldComponent={(props) => {
                        return (
                            <TextField
                                id="key"
                                label={hintText}
                                margin="normal"
                                {...this.props}
                                {...props}
                            />)
                    }}
                />
            </div>
        )
    }
}
