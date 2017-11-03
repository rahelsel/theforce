import React from 'react';
import { browserHistory, Link } from 'react-router';
import Signin from '/imports/ui/components/account/signin';
import Signup from '/imports/ui/components/account/signup';
import ForgotPassword from '/imports/ui/components/account/forgotPassword';

export default class HeaderBase extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showSigninModal: false,
      showSignupModal: false,
      showForgotPasswordModal: false,
      studentRegister: false,
      schoolRegister: false,
    }
  }

  closeModal = (modalObj) => this.setState(modalObj)

  openLogInModal = () => {
    this.setState({
      showSigninModal: true,
      showSignupModal: false,
      showForgotPasswordModal: false,
    })
  }
  
  openSignupModalWithRegisterationType = (studentRegister, schoolRegister) => {
    this.setState({
      showSignupModal: true,
      showSigninModal: false,
      showForgotPasswordModal: false,
      studentRegister,
      schoolRegister,
    })
  }

  openForgotPasswordModal = () => {
    this.setState({
      showSignupModal: false,
      showSigninModal: false,
      showForgotPasswordModal: true
    })
  }
  
  logOut = (event) => {
    event.preventDefault();
    Meteor.logout();
    $('body').removeAttr('style');
    setTimeout(function () {
      browserHistory.push('/');
    }, 1000); 
  }
}