import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

/* Because we are extending a material ui button, it us jss instead of styled Components */
const createButtonStyles = (mainColor, textColor) => {
	return {
		color: mainColor,
		borderColor: mainColor,
		'&:hover': {
			backgroundColor: mainColor,
			color: textColor
		}
	}
}

const styles = {
	formGhostButton: {
		fontFamily: helpers.specialFont,
		fontSize: helpers.baseFontSize,
		backgroundColor: 'transparent',
		border: '1px solid',
		borderColor: helpers.primaryColor,
		color: helpers.primaryColor,
		textTransform: 'none',
		fontWeight: 500,
		// height: '100%',
		marginRight: helpers.rhythmDiv,
		'&:hover': {
			backgroundColor: helpers.primaryColor,
			color: 'white'
		}
	},
	fullWidth: {
		width: '100%'
	},
	whiteColor: createButtonStyles('white', helpers.black),
	redColor: createButtonStyles(helpers.alertColor, 'white'),
	blackColor: createButtonStyles(helpers.black, 'white'),
	greyColor: createButtonStyles(helpers.cancel, 'white'),
	darkGreyColor: createButtonStyles(helpers.darkBgColor, 'white'),
	cautionColor: createButtonStyles(helpers.caution, 'black'),
	blueColor: createButtonStyles("dodgerblue", 'white'),
	icon: {
		display: 'inline-block',
		marginRight: '5px',
		fontSize: 'inherit'
	},
	customIcon: {
		display: 'inline-block',
		fontSize: 'inherit'
	}
};

const getIconForButton = (props) => {
	const CustomIcon = props.customIcon;
	if (CustomIcon && props.icon) {
		return <CustomIcon className={props.classes.customIcon} />;
	} else if (props.icon) {
		return <Icon className={props.classes.icon}>{props.iconName}</Icon>;
	}

	return '';
};

const FormGhostButton = (props) => {
	let rootClass = ``;
	if (props.fullWidth) {
		rootClass = `${props.classes.formGhostButton} ${props.classes.fullWidth}`;
	} else {
		rootClass = props.classes.formGhostButton;
	}
	// debugger;
	/* prettier-ignore */
	if (props.blackColor || (props.color == "black")) {
		rootClass = rootClass + " " + props.classes.blackColor;
	} else if (props.greyColor || (props.color == "grey")) {
		rootClass = rootClass + " " + props.classes.greyColor;
	} else if (props.darkGreyColor || (props.color == "dark-grey")) {
		rootClass = rootClass + " " + props.classes.darkGreyColor;
	} else if (props.alertColor || (props.color == "alert")) {
		rootClass = rootClass + " " + props.classes.redColor;
	} else if (props.whiteColor || (props.color == 'white')) {
		rootClass = rootClass + " " + props.classes.whiteColor;
	} else if (props.cautionColor || props.color == 'caution') {
		rootClass = rootClass + " " + props.classes.cautionColor;
	} else if (props.blueColor) {
		rootClass = rootClass + " " + props.classes.blueColor;
	}

	return (
		<Button
			type={props.type}
			classes={{
				root: rootClass
			}}
			onClick={props.onClick}
			form={props.form}
			disabled={props.disabled}
		>
			{!props.back && getIconForButton(props)}
			{props.label ? props.label : 'Submit'}
			{props.back && getIconForButton(props)}
		</Button>
	);
};

FormGhostButton.propTypes = {
	type: PropTypes.string,
	onClick: PropTypes.func,
	icon: PropTypes.bool,
	iconName: PropTypes.string,
	label: PropTypes.string,
	fullWidth: PropTypes.bool,
	color: PropTypes.string,
	classes: PropTypes.object.isRequired,
	customIcon: PropTypes.element
};

FormGhostButton.defaultProps = {
	type: 'button'
};

export default withStyles(styles)(FormGhostButton);
