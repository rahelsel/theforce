import React from 'react';
import PropTypes from 'prop-types';
import { SocialIcon } from 'react-social-icons';

import Button from 'material-ui/Button';
import {withStyles} from 'material-ui/styles';

import * as helpers from '../jss/helpers.js';

const iconStyles = {
    height: 25,
    width : 25,
    marginRight: helpers.rhythmDiv,
}

const facebookButtonColor = helpers.facebookButtonColor;

const styles = {
    facebookButton: {
        background: facebookButtonColor,
        '&:hover': {
            background: facebookButtonColor
        }
    },
    label: {
        textTransform: 'none',
        color: helpers.lightTextColor
    }
}

const FacebookIconButton = (props) => (
    <Button color={facebookButtonColor} onClick={props.onClick} classes={{root: props.classes.facebookButton, label: props.classes.label}}>
        <SocialIcon network="facebook" style={iconStyles} color={helpers.lightTextColor}/>
        {props.label}
    </Button>
);

FacebookIconButton.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string
}

FacebookIconButton.defaultProps = {
    label: 'Sign Up With Facebook'
}

export default withStyles(styles)(FacebookIconButton);