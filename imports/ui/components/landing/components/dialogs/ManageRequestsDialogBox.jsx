import React, {Fragment,Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControlLabel} from 'material-ui/Form';
import { isEmpty} from 'lodash';

import Events from '/imports/util/events';
import { getUserFullName } from '/imports/util/getUserData';
import { openMailToInNewTab } from '/imports/util/openInNewTabHelpers';
import { toastrModal } from '/imports/util';
import { ContainerLoader } from '/imports/ui/loading/container.js';

import PrimaryButton from '../buttons/PrimaryButton';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui-icons/Clear';
import TextField from 'material-ui/TextField';

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
      maxWidth: '500px',
      overflow: 'hidden',
      width: '100%'
    },
    iconButton: {
      height: 'auto',
      width: 'auto'
    },
    labelText: {
      display: 'flex',
      alignItems: 'flex-end',
      marginLeft: -14,
      marginRight: helpers.rhythmDiv * 2
    }
  }
}

const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  ${helpers.flexCenter}
  margin: ${helpers.rhythmDiv * 4}px 0;
`;

const InputWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class ManageRequestsDialogBox extends Component {
  state = {
    isBusy: false,
    userExists: false,
    name: '',
    email: '',
    subscriptionRequest: 'save',
    readyToSubmit: false,
    inputsName: ['name','email'],
  }

  _getCollectionName = () => {
    const {requestFor} = this.props;

    if(requestFor == 'price details')  {
      return 'pricingRequest';
    }else if(requestFor == 'location') {
      return 'classTypeLocationRequest';
    }else {
      return 'classTimesRequest';
    }
  }

  _getCompleteMethodName = (methodName) => {
    const collectionName = this._getCollectionName();
    return collectionName + '.' + methodName;
  }

  handleChange = name => e => {
    this.setState({
      [name] : e.target.value
    });
  }

  handleRequest = (text) => {
    const {schoolData} = this.props;
    const userName = Meteor.userId ? getUserFullName(Meteor.user()) : this.state.name;
    if(!isEmpty(schoolData)) {
      const ourEmail = schoolData.email;
      let emailBody = "";
      let subject ="", message =  "";
      let url = `${Meteor.absoluteUrl()}schools/${schoolData.slug}`
      let currentUserName = userName;
      // emailBody = `Hi, %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing}%3F %0D%0A%0D%0A Thanks`
      emailBody = `Hi %0D%0A%0D%0A I saw your listing on SkillShape.com ${url} and would like to attend. Can you update your ${text ? text : pricing} %0D%0A%0D%0A Thanks`
      const mailTo = `mailto:${ourEmail}?subject=${subject}&body=${emailBody}`;

      console.info(encodeURI(mailTo),mailTo,"my mail To data.............");

      openMailToInNewTab(mailTo);

    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    const {toastr,requestFor,schoolData,classTypeId} = this.props;
    const subscriptionRequest = this.state.subscriptionRequest;
    const data = {
      name: this.state.name,
      email: this.state.email,
      schoolId: schoolData._id,
    }

    if(classTypeId) {
      data.classTypeId = classTypeId
    }

    const methodNameToCall = this._getCompleteMethodName('addRequest');

    if(this.state.readyToSubmit) {
      if (!data.email) {
          toastr.error('Please enter your email.', 'Error', {}, false);
          return false;
      } else if (!emailReg.test(data.email)) {
          toastr.error("Please enter valid email address", "Error", {}, false);
          return false;
      } else if (!data.name) {
          toastr.error("Please enter a name", "Error", {}, false);
          return false;
      }else {
        const userExistsError = 'user exists';
        this.setState({isBusy: true});
        Meteor.call(methodNameToCall, data, subscriptionRequest, (err,res) => {
          this.setState({isBusy: false} , () => {
            if(err && err.error === userExistsError) {
              Events.trigger('loginAsUser',{email: data.email, loginModalTitle: `We have ${data.email} as registered user. kindly log in your account.`});
            }else if(err) {
              toastr.error(err.reason || err.message, "Error", {}, false);
            }
            else if(res) {
              if(subscriptionRequest === 'sign-up') {
                // User wants to join the skillshape now..
                Events.trigger('registerAsSchool',{userType: 'Student', userEmail: this.state.email, userName: this.state.name});
                this.handleRequest(text);
                this.props.onModalClose();
              }else{
                toastr.success('Your request has been processed','success');
                this.handleRequest(text);
              }
            }

            if(this.props.onFormSubmit) {
              this.props.onFormSubmit();
            }
          });
        });

      }
    }else if(this.state.readyToSubmit) {
      this.handleRequest(text);
    }
  }

  _validateAllInputs = (data, inputNames) => {

    for(let i = 0; i < inputNames.length; ++i) {
      if(data[inputNames[i]] == '') {
        return false;
      }
    }

    return true;
  }

  componentDidUpdate = () => {
    const readyToSubmit = this._validateAllInputs(this.state,this.state.inputsName);
    if(this.state.readyToSubmit !== readyToSubmit) {
      this.setState({ readyToSubmit : readyToSubmit});
    }
  }

  componentDidMount = () => {
    if(Meteor.userId()) {
      if(!this.state.userExists)
        this.setState({userExists: true});
    }
  }

  render() {
    const {props} = this;
    // console.log(props,"...");
    return (
      <Fragment>
        {this.state.isBusy && <ContainerLoader />}
        <Dialog
          fullScreen={props.fullScreen}
          open={props.open}
          onClose={props.onModalClose}
          onRequestClose={props.onModalClose}
          aria-labelledby="manage requests"
          classes={{paper: props.classes.dialogRoot}}
        >
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{root: props.classes.dialogTitleRoot}}>
            <DialogTitleWrapper>
              <Title>Request {props.title}</Title>
              <IconButton color="primary" onClick={props.onModalClose} classes={{root: props.classes.iconButton}}>
                <ClearIcon/>
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>

          <DialogContent classes={{root : props.classes.dialogContent}}>
            <form onSubmit={this.handleFormSubmit}>
              <InputWrapper stars>
                <IconInput inputId="name" labelText="Your name" value={this.state.name} onChange={this.handleChange('name')} />
              </InputWrapper>

              <InputWrapper>
                <IconInput inputId="message" type='email' labelText="Your email address" value={this.state.email} onChange={this.handleChange('email')} />
              </InputWrapper>

              {!this.state.userExists && <InputWrapper>
                <RadioGroup
                  aria-label="manage-request"
                  name="manage-request"
                  className={props.classes.subscriptionRequest}
                  value={this.state.subscriptionRequest}
                  onChange={this.handleChange('subscriptionRequest')}
                >
                  <FormControlLabel value="no-save" control={<Radio />} label="This is correspondence between you and school directly. We wont save your data" />
                  <FormControlLabel value="save" control={<Radio />} label="Stay updated on the classes you are interested. This will require we save your email address." />
                  <FormControlLabel value="sign-up" control={<Radio />} label="Join Skillshape to register for classes, manage your media, and connect with other members. (FREE Memebership!)" />
                </RadioGroup>
              </InputWrapper>}

              <ButtonWrapper>
                {this.state.readyToSubmit ?
                  <PrimaryButton
                    type="submit"
                    label={props.submitBtnLabel}
                    noMarginBottom
                    onClick={this.handleFormSubmit}
                  />
                :
                <button className="cancel-button increase-height" disabled >{props.submitBtnLabel}</button>}
              </ButtonWrapper>
            </form>
          </DialogContent>
          </MuiThemeProvider>
        </Dialog>
      </Fragment>
    );
  }
}

ManageRequestsDialogBox.propTypes = {
  onFormSubmit: PropTypes.func,
  requestFor: PropTypes.string,
  title: PropTypes.string,
  schoolData: PropTypes.object,
  classTypeName: PropTypes.string,
  submitBtnLabel: PropTypes.string,
}

ManageRequestsDialogBox.defaultProps = {
  title: 'Pricing',
  requestFor: 'price',
  submitBtnLabel: 'Request pricing'
}

export default toastrModal(withMobileDialog()(withStyles(styles)(ManageRequestsDialogBox)));
