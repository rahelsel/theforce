import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ClearIcon from "material-ui-icons/Clear";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import { MuiThemeProvider, withStyles } from "material-ui/styles";
import { ContainerLoader } from "/imports/ui/loading/container";
import FormGhostButton from '/imports/ui/components/landing/components/buttons/FormGhostButton.jsx';
import SecondaryButton from '/imports/ui/components/landing/components/buttons/SecondaryButton.jsx';
import PrimaryButton from "/imports/ui/components/landing/components/buttons/PrimaryButton.jsx";
import muiTheme from "/imports/ui/components/landing/components/jss/muitheme.jsx";
import Select from "react-select";
import { isEmpty, flatten, get, uniq } from "lodash";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";


const customStyles = {
  input: (provided, state) => ({
    ...provided,
    fontSize: 16
  })
}

const styles = theme => {
  return {
    dialogTitleRoot: {
      padding: `${helpers.rhythmDiv * 3}px ${helpers.rhythmDiv *
        3}px 0 ${helpers.rhythmDiv * 3}px`,
      marginBottom: `${helpers.rhythmDiv * 2}px`,
      "@media screen and (max-width : 500px)": {
        padding: `0 ${helpers.rhythmDiv * 3}px`
      }
    },
    dialogContent: {
      padding: `0 ${helpers.rhythmDiv * 3}px`,
      paddingBottom: helpers.rhythmDiv * 2,
      flexGrow: 0,
      display: "flex",
      justifyContent: "center",
      minHeight: 200,
      [`@media screen and (max-width : ${helpers.mobile}px)`]: {
        padding: `0 ${helpers.rhythmDiv * 2}px`
      }
    },
    dialogRoot: {
      width: "100%",
      maxWidth: 400,
      [`@media screen and (max-width : ${helpers.mobile}px)`]: {
        margin: helpers.rhythmDiv
      }
    },
    iconButton: {
      height: "auto",
      width: "auto"
    }
  };
};

const ActionButtons = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: ${helpers.rhythmDiv * 2}px;
`;

const ActionButton = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;

const ErrorWrapper = styled.span`
  color: red;
  margin: ${helpers.rhythmDiv * 2}px;
`;
const DialogTitleWrapper = styled.div`
  ${helpers.flexHorizontalSpaceBetween}
  font-family: ${helpers.specialFont};
  width: 100%;
`;

const ContentWrapper = styled.div``;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  text-align: center;
`;

class AddInstructorDialogBox extends Component {
  constructor(props) {
    super(props);
    this.state = this.initializeStates();
  }
  initializeStates = () => {
    let emailList = [];
    const { schoolId } = this.props;
    if (this.props.text == 'Student') {
      Meteor.call('user.getSelectedUsersEmail', 'All', (err, res) => {
        if (res) {
          res.map((obj, index) => {
            emailList.push({ value: obj._id, label: obj.emails[0].address });
          })
        }
        this.setState({ emailList });
      })
    } else {
      Meteor.call('school.getAdminsEmail', schoolId, (err, res) => {
        if (res) {
          res.map((obj, index) => {
            emailList.push({ value: obj._id, label: obj.emails[0].address });
          })
        }
        this.setState({ emailList });
      })
    }
    return { selectedOption: [] }
  }
  handleClassesAndClassTime = (popUp, payLoad) => {
    popUp.appear("inform", {
      title: "Add Instructor",
      content: `Add this instructor to this class only, or to this and all future classes?`,
      RenderActions: (
        <ActionButtons>
          <ActionButton>
            <FormGhostButton
              label={'Just to this instance'} onClick={() => { this.handleInstructors(popUp, payLoad) }} applyClose />
          </ActionButton>
          <ActionButton>
            <FormGhostButton label={'Whole series'} onClick={() => { this.handleWholeSeries(popUp, payLoad) }} applyClose />
          </ActionButton>
          <ActionButton>
            <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose />
          </ActionButton>
        </ActionButtons>
      )
    }, true);
  }
  handleWholeSeries = (popUp, payLoad) => {
    let { classData } = this.props;
    payLoad.classTimeId = get(classData, 'classTimeId', '');
    payLoad.schoolId = get(classData, 'schoolId', '');
    Meteor.call("classTimes.editClassTimes", { doc_id: payLoad.classTimeId, doc: payLoad }, (err, res) => {

      this.setState({ isLoading: false });
      if (res != 'emailNotFound') {
        popUp.appear("success", {
          title: "Added Successfully",
          content: `Successfully added as an instructor.`,
          RenderActions: (<ActionButtons>
            <FormGhostButton label={'Ok'} onClick={() => { this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(payLoad.instructors, 'add') : this.props.onModalClose() }} applyClose />
          </ActionButtons>
          )
        }, true);
      }
      else if (res == 'emailNotFound') {
        popUp.appear("alert", {
          title: "Email not found",
          content: `No account found with this email. Please create one and try again.`,
          RenderActions: (<ActionButtons>
            <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />
          </ActionButtons>
          )
        }, true);
      }

    })
  }
  handleInstructors = (popUp, payLoad) => {
    Meteor.call("classes.handleInstructors", payLoad, (err, res) => {
      this.setState({ isLoading: false });
      if (res != 'emailNotFound') {
        popUp.appear("success", {
          title: "Added Successfully",
          content: <div>Successfully added as an instructor.<br />{payLoad.classTimeForm ? "Changes will show in the Class Times Editor after saving." : ''}</div>,
          RenderActions: (<ActionButtons>
            <FormGhostButton label={'Ok'} onClick={() => { this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(payLoad.instructors, 'add') : this.props.onModalClose() }} applyClose />

          </ActionButtons>
          )
        }, true);
      }
      else if (res == 'emailNotFound') {
        popUp.appear("alert", {
          title: "Email not found",
          content: `No account found with this email. Please create one and try again.`,
          RenderActions: (<ActionButtons>
            <FormGhostButton label={'Ok'} onClick={() => { }} applyClose />
          </ActionButtons>
          )
        }, true);
      }

    })
  }
  handleAddStudent = (popUp, payLoad) => {
    Meteor.call("classes.handleInstructors", payLoad, (err, res) => {
      this.setState({ isLoading: false });
      if (res == 'added') {
        popUp.appear("success", {
          title: `${this.props.text} Added Successfully`,
          content: '',
          RenderActions: (<ActionButtons>
            <FormGhostButton label={'Ok'} onClick={() => { this.props.instructorsIdsSetter ? this.props.instructorsIdsSetter(payLoad.instructors, 'add') : this.props.onModalClose() }} applyClose />
          </ActionButtons>
          )
        }, true);
      }
    })
  }
  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { popUp } = this.props;
    let { selectedOption } = this.state;
    let payLoad = {
      action: "add",
      _id: !isEmpty(this.props.classData) ? get(this.props.classData, '_id', null) : '',
      classTimeForm: this.props.classTimeForm,
      students: !isEmpty(this.props.classData) ? get(this.props.classData, 'students', []) : [],
      classTypeId: !isEmpty(this.props.classData) ? get(this.props.classData, 'classTypeId', '') : "",
      schoolId: !isEmpty(this.props.classData) ? get(this.props.classData, 'schoolId', '') : "",
      instructors:get(this.props.classData,'instructors',[])
    };
    if (this.props.text == 'Student') {
      selectedOption.map((obj, index) => {
        payLoad.students.push({ status: 'signIn', userId: obj.value })
      })
      payLoad.students = uniq(payLoad.students);
    } else {
      payLoad.instructors = !isEmpty(this.props.classData) ? get(this.props.classData, 'instructors', this.props.instructorsIds) : [],
      payLoad.instructors.push(selectedOption.map(ele => ele.value));
      payLoad.instructors = flatten(payLoad.instructors);

    }
    popUp.appear("inform", {
      title: "Confirmation",
      content: `Add to your School?`,
      RenderActions: (
        <ActionButtons>
          <FormGhostButton label={'Cancel'} onClick={() => { }} applyClose greyColor/>
          <FormGhostButton label={'Yes'} onClick={() => { this.props.text == "Student" ? this.handleAddStudent(popUp, payLoad) : !payLoad.classTimeForm ? this.handleClassesAndClassTime(popUp, payLoad) : this.handleInstructors(popUp, payLoad) }} applyClose />
        </ActionButtons>
      )
    }, true);
  };
  handlePhoneChange = event => {
    const inputPhoneNumber = event.target.value;
    let phoneRegex = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/g;

    let showErrorMessage;
    if (inputPhoneNumber.match(phoneRegex) || inputPhoneNumber == "") {
      showErrorMessage = false;
    } else {
      showErrorMessage = true;
    }
    this.setState({
      showErrorMessage: showErrorMessage
    });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  handleEmail = (selectedOption) => {
    this.setState(state => {
      return {
        ...state,
        selectedOption: selectedOption
      };
    });
  }
  render() {
    const { props } = this;
    let birthYears = [];
    let adminView = true;
    let { selectedOption, emailList,isLoading } = this.state;
    let text = props.text ? props.text : 'Instructor';
    return (
      <Dialog
        open={props.open}
        onClose={props.onModalClose}
        onRequestClose={props.onModalClose}
        aria-labelledby={`add ${text}`}
        classes={{ paper: props.classes.dialogRoot }}
      >
      {isLoading && <ContainerLoader/>}
        <MuiThemeProvider theme={muiTheme}>
          <DialogTitle classes={{ root: props.classes.dialogTitleRoot }}>
            <DialogTitleWrapper>
              <Title>Add {text}</Title>

              <IconButton
                color="primary"
                onClick={props.onModalClose}
                classes={{ root: props.classes.iconButton }}
              >
                <ClearIcon />
              </IconButton>
            </DialogTitleWrapper>
          </DialogTitle>
          <DialogContent classes={{ root: props.classes.dialogContent }}>
            <form id="addUser" onSubmit={this.onSubmit}>
              <Select
                styles={customStyles}
                inputProps={{
                  style: {
                    fontSize: 16
                  }
                }}
                name="filters"
                placeholder={`Select ${text}`}
                value={selectedOption}
                options={emailList}
                onChange={this.handleEmail}
                multi
              />
              <ActionButtons>
                {this.state.error && <ErrorWrapper>{this.state.error}</ErrorWrapper>}
                {this.state.selectedOption.length ? <PrimaryButton
                  formId="addUser"
                  type="submit"
                  label={`Add new ${text}`} />
                  : <SecondaryButton
                    disabled
                    label={`Add new ${text}`} />}

                <PrimaryButton formId="cancelUser"
                  label="Cancel"
                  onClick={props.onModalClose}
                />
              </ActionButtons>
            </form>
          </DialogContent>
          <DialogActions classes={{ root: props.classes.dialogActionsRoot }}>
          </DialogActions>
        </MuiThemeProvider>
      </Dialog >
    );
  }
}

AddInstructorDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  loading: PropTypes.bool
};

export default withStyles(styles)(AddInstructorDialogBox);
