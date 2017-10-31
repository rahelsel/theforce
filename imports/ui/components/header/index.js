import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory, Link } from 'react-router';
import Signin from '/imports/ui/components/account/signin';
import Signup from '/imports/ui/components/account/signup';
import ForgotPassword from '/imports/ui/components/account/forgotPassword';

class Header extends React.Component{

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

  render() {
    const { currentUser } = this.props;
   
    return(
      <div>
      <nav className="navbar navbar-default" style={{marginBottom: '0px'}}>
        <div className="container-fluid">
        { 
          currentUser ?
          (<div>
            <div className="navbar-minimize">
              <button id="minimizeSidebar" className="btn btn-round btn-white btn-fill btn-just-icon">
                  <i className="material-icons visible-on-sidebar-regular">more_vert</i>
                  <i className="material-icons visible-on-sidebar-mini">view_list</i>
              </button>
            </div>
            <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                {
                  currentUser && currentUser.profile &&  currentUser.profile.is_demo_user &&
                    <a className="cust-brand" href="/school">
                      <img src="/images/YourStudio.png" alt="logo" width="150"/>
                      {/*<!-- <span className="brand-text text-warning" style="font-weight: 900;font-size: 20px;">Fitness<span> Studio</span></span> -->*/}
                    </a>
                }
            </div>
          </div>)
          : (<div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="brand" href="/">
              <img src="/images/logo-location.png" alt="logo" width="52"/>
            </a>
            </div>)
        }
        <div className="collapse navbar-collapse">
                {
                  currentUser ?
                    ( <ul className="nav navbar-nav navbar-right">
                        <li className="logout">
                          <a onClick={this.logOut}>
                            <i className="material-icons ">exit_to_app</i>Logout
                          </a>
                        </li>
                     </ul>
                    )
                    : ( <ul className="nav navbar-nav navbar-right">
                      <li>
                        <a href="/">
                            <i className="material-icons">home</i> Home
                        </a>
                    </li>
                    <li className="">
                        <a onClick={this.openSignupModalWithRegisterationType.bind(this, true, false)} id="join_student" className="join_school cursor-lint" data-action="student">
                            <i className="material-icons">person_add</i> Student Sign Up
                        </a>
                    </li>
                    <li className="">
                        <a onClick={this.openSignupModalWithRegisterationType.bind(this, false, true)} id="join_school" className="join_school cursor-lint" data-action="school">
                            <i className="material-icons">school</i> Register a School
                        </a>
                    </li>
                    <li>
                        <a href="/claimSchool">
                            <i className="material-icons">check_box</i> Claim a School
                        </a>
                    </li>
                    <li>
                        <a href="/Contactus">
                            <i className="material-icons">email</i> Contact Us
                        </a>
                    </li>
                    <li>
                        <Link to="/Aboutus">
                            <i className="material-icons">info</i> About Us
                        </Link>
                    </li>
                    <li className="">
                        <a onClick={this.openLogInModal} className="login cursor-lint">
                            <i className="material-icons ">fingerprint</i> Login
                        </a>
                    </li>
                  </ul>
                  )
                }
            {
              currentUser && (
                <form className="navbar-form navbar-right" role="search">
                    <div className="form-group form-search is-empty">
                        <input type="text" className="form-control" placeholder="Search" id="searchParams"/>
                        <span className="material-input"></span>
                    </div>
                    <button type="button" className="btn btn-white btn-round btn-just-icon" id="btnTextSearch">
                        <i className="material-icons">search</i>
                        <div className="ripple-container"></div>
                    </button>
                </form>
              )
            }
        </div>
      </div>
    </nav>
    { this.state.showSignupModal && <Signup 
        onClose={this.closeModal}
        schoolRegister={this.state.schoolRegister}
        studentRegister={this.state.studentRegister}
        openSignupModal={this.openSignupModalWithRegisterationType}
        logIn={this.openLogInModal}
      />
    }
    { this.state.showSigninModal && <Signin 
        onClose={this.closeModal}
        openSignupModal={this.openSignupModalWithRegisterationType}
        showForgotPasswordModal={this.openForgotPasswordModal}
      /> 
    }
    {
      this.state.showForgotPasswordModal && <ForgotPassword
        onClose={this.closeModal}
        logIn={this.openLogInModal}
        openSignupModal={this.openSignupModalWithRegisterationType}
      />
    }
    </div>
    )
  }
}

export default createContainer(props => {
  const currentUser = Meteor.user();
  return { ...props, currentUser };
}, Header);