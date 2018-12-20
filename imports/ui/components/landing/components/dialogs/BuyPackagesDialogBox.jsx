import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { createContainer } from "meteor/react-meteor-data";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import { isEmpty, flatten, get, uniq } from "lodash";


import Grid from "material-ui/Grid";
import IconButton from "material-ui/IconButton";
import Radio, { RadioGroup } from "material-ui/Radio";
import { FormLabel, FormControl, FormControlLabel } from "material-ui/Form";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import ClearIcon from "material-ui-icons/Clear";

import Package from '/imports/ui/components/landing/components/class/packages/Package.jsx';
import { PrimaryButton } from "/imports/ui/components/landing/components/buttons/";
import { ContainerLoader } from "/imports/ui/loading/container.js";

import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import EnrollmentFees from "/imports/api/enrollmentFee/fields";
import School from "/imports/api/school/fields";

import { withPopUp, stripePaymentHelper, normalizeMonthlyPricingData } from "/imports/util";

import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { dialogStyles } from './sharedDialogBoxStyles';
import { ActionButtons, ActionButton, DialogBoxTitleBar } from './sharedDialogBoxComponents';

const PackagesListWrapper = styled.div`
    display: flex;
    max-height: 300px;
    overflow-y: auto;
    flex-direction: column;
`;

const PackageWrapper = styled.div`
    margin-bottom: ${helpers.rhythmDiv}px;
`;

const styles = theme => {
    return {
        ...dialogStyles,
        dialogActions: {
            width: '100%'
        },
        dialogContent: {
            ...dialogStyles.dialogContent,
            flexDirection: 'column'
        },
        iconButton: {
            ...dialogStyles.iconButton,
            position: 'absolute',
            top: helpers.rhythmDiv,
            right: helpers.rhythmDiv
        },
        radioGroupWrapper: {
            margin: 0,
            marginTop: helpers.rhythmDiv * 3,
            paddingLeft: helpers.rhythmDiv,
            [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
                width: "auto"
            }
        },
        radioLabelRoot: {
            marginRight: helpers.rhythmDiv * 3
        },
        radioLabel: {
            fontSize: helpers.baseFontSize,
            [`@media screen and (max-width: ${helpers.mobile + 50}px)`]: {
                fontSize: 14
            }
        },
        radioButton: {
            height: helpers.rhythmDiv * 3,
            width: helpers.rhythmDiv * 3,
            marginRight: helpers.rhythmDiv
        },
        radioGroup: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            [`@media screen and (max-width: ${helpers.mobile + 100}px)`]: {
                justifyContent: "flex-start"
            },
            [`@media screen and (max-width: ${helpers.mobile}px)`]: {
                flexDirection: "column"
            }
        },
    }
}


class BuyPackagesDialogBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPackageIndex: -1,
            radioButtonGroupValue: "other"
        }

    }

    handleRadioButtonChange = event => {
        this.setState({ radioButtonGroupValue: event.target.value });
    };

    handlePackageClick = (selectedPackageIndex) => (e) => {
        e.preventDefault();

        this.setState(state => {
            return {
                ...state,
                selectedPackageIndex,
            }
        })
    }


    render() {
        const { props } = this;
        const {
            classes,
            open,
            onModalClose,
            schoolId,
            packagesListData,
            currency,
            isLoading
        } = props;

        const {
            selectedPackageIndex,
            radioButtonGroupValue
        } = this.state;


        return (<Dialog
            open={open}
            onClose={onModalClose}
            onRequestClose={onModalClose}
            aria-labelledby={"packages"}
            classes={{ paper: classes.dialogRoot }}
        >
            <MuiThemeProvider theme={muiTheme}>
                <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
                    <DialogBoxTitleBar
                        title="Packages"
                        classes={classes}
                        onModalClose={onModalClose}
                    />
                </DialogTitle>
                {isLoading ?
                    <ContainerLoader />
                    :
                    <DialogContent classes={{ root: classes.dialogContent }}>
                        <PackagesListWrapper>
                            {!isEmpty(packagesListData) && packagesListData.map((packageData, i) => (
                                <PackageWrapper>
                                    <Package
                                        key={i}
                                        {...packageData}
                                        packageSelected={i === selectedPackageIndex}
                                        onPackageClick={this.handlePackageClick(i)}
                                        usedFor="buyPackagesDialogBox"
                                        variant={'light'}
                                        schoolId={schoolId}
                                        currency={currency}
                                    />
                                </PackageWrapper>
                            ))}
                        </PackagesListWrapper>

                        <FormControl
                            component="fieldset"
                            className={classes.radioGroupWrapper}>
                            <RadioGroup
                                aria-label="payment-options"
                                name="payment-options"
                                className={classes.radioGroup}
                                value={this.state.radioButtonGroupValue}
                                onChange={this.handleRadioButtonChange}
                            >
                                <FormControlLabel
                                    classes={{
                                        root: classes.radioLabelRoot,
                                        label: classes.radioLabel
                                    }}
                                    value="cash" control={<Radio />} label="Cash" />
                                <FormControlLabel
                                    classes={{
                                        root: classes.radioLabelRoot,
                                        label: classes.radioLabel
                                    }}
                                    value="check" control={<Radio />} label="Check" />
                                <FormControlLabel
                                    classes={{
                                        root: classes.radioLabelRoot,
                                        label: classes.radioLabel
                                    }}
                                    value="creditCard" control={<Radio />} label="Credit Card" />
                                <FormControlLabel
                                    classes={{
                                        root: classes.radioLabelRoot,
                                        label: classes.radioLabel
                                    }}
                                    value="bankTransfer" control={<Radio />} label="Bank Transfer" />
                                <FormControlLabel
                                    classes={{
                                        root: classes.radioLabelRoot,
                                        label: classes.radioLabel
                                    }}
                                    value="other" control={<Radio />} label="Others" />
                            </RadioGroup>
                        </FormControl>
                    </DialogContent>}

                <DialogActions classes={{ root: classes.dialogActionsRoot, action: classes.dialogActions }}>
                    <ActionButtons
                        justifyContent="space-evenly"
                    >
                        <ActionButton>
                            <PrimaryButton
                                label={'Send Link'}
                                onClick={this.handleSendLink} />
                        </ActionButton>
                        <ActionButton>
                            <PrimaryButton
                                label={'Accept Payment'}
                                onClick={this.handlePurchasePackage} />
                        </ActionButton>
                    </ActionButtons>
                </DialogActions>
            </MuiThemeProvider>
        </Dialog >
        );
    }
}

BuyPackagesDialogBox.propTypes = {
    onModalClose: PropTypes.func,
    loading: PropTypes.bool
};

export default withStyles(styles)(createContainer(props => {
    const { classTypeId } = props;
    //TODO: Need to filter out packages which are already purchased..
    //let purchasesData = 
    let monthlyPricingSubscription;
    let classPricingSubscription;
    let enrollmentSubscription;
    let isLoading = true;
    let currency = config.defaultCurrency;
    //console.log(classData,props,'classTYpeid')
    if (classTypeId) {
        monthlyPricingSubscription = Meteor.subscribe('monthlyPricing.getMonthlyPricingWithClassId', { classTypeId: [classTypeId] });
        classPricingSubscription = Meteor.subscribe('classPricing.getClassPricingWithClassId', { classTypeId });
        enrollmentSubscription = Meteor.subscribe('enrollmentFee.getClassTypeEnrollMentFree', { classTypeId })
    }

    const sub1Ready = monthlyPricingSubscription && monthlyPricingSubscription.ready();
    const sub2Ready = classPricingSubscription && classPricingSubscription.ready();
    const sub3Ready = enrollmentSubscription && enrollmentSubscription.ready();
    // console.info(sub1Ready, sub2Ready, sub3Ready, ">>>>>>>>>>>>>");
    if (sub1Ready && sub2Ready && sub3Ready) {
        isLoading = false;
    }

    const classPricingData = ClassPricing.find().fetch();
    const monthlyPricingData = MonthlyPricing.find().fetch();
    const enrollmentFeeData = EnrollmentFees.find().fetch();

    return {
        ...props,
        isLoading,
        packagesListData: classPricingData.concat(normalizeMonthlyPricingData(monthlyPricingData)).concat(enrollmentFeeData),
        currency
    };
}, withPopUp(BuyPackagesDialogBox)));
