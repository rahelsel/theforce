import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";
import { isEmpty } from "lodash";
import { createContainer } from "meteor/react-meteor-data";

import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import Chip from "material-ui/Chip";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import { withStyles } from "material-ui/styles";
import { MuiThemeProvider } from "material-ui/styles";
import ClearIcon from "material-ui-icons/Clear";

import ClassTimesBoxes from "/imports/ui/components/landing/components/classTimes/ClassTimesBoxes";

import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

import * as helpers from "../jss/helpers.js";
import muiTheme from "../jss/muitheme.jsx";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from "material-ui/Dialog";

import ClassInterest from "/imports/api/classInterest/fields";
import Events from "/imports/util/events";
import { Element } from "react-scroll";
import { scroller } from "react-scroll";

const styles = {
  dialog: {
    padding: `${helpers.rhythmDiv}px`,
    overflowX: "hidden"
  },
  dialogPaper: {
    maxWidth: 600,
    background: "white",
    margin: 8,
    overflowY: 'auto'
  },
  dialogTitle: {
    // padding: `0 ${helpers.rhythmDiv * 3}px`,
    // paddingTop: helpers.rhythmDiv * 2
    padding: 0,
    marginBottom: helpers.rhythmDiv * 2
  },
  dialogContent: {
    overflowX: "hidden",
    padding: 0,
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'white',
    zIndex: 3,
    // boxShadow: helpers.buttonBoxShadow
  }
};

const DialogTitleWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  padding: 0;
`;

const MyScrollToElement = styled.div`
  overflow-y: auto;
  // padding: ${helpers.rhythmDiv * 2}px 0;
  padding-top: ${helpers.rhythmDiv * 2}px;
  @media screen and (max-width: ${helpers.mobile + 100}px) {
    padding: ${helpers.rhythmDiv * 2}px;
  }
`;

const ClassContainer = styled.div`
  width: 90%;
  padding: ${helpers.rhythmDiv}px;
  margin: 0 auto;
  border-radius: ${helpers.rhythmDiv}px;
  background: #ffffff;
`;

const ClassContainerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${helpers.rhythmDiv}px;

  @media screen and (max-width: ${helpers.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ClassTimings = styled.p`
  margin: 0 ${helpers.rhythmDiv}px 0 0;
  font-weight: 600;
  color: ${helpers.headingColor};
`;

const CalenderButtonWrapper = styled.div`
  margin: ${helpers.rhythmDiv} 0 0 0;
  ${helpers.flexCenter} justify-content: flex-end;
`;

const ErrorWrapper = styled.span`
  color: red;
  float: right;
`;

const ScheduleType = styled.span`
  display: inline-block;
  padding: ${helpers.rhythmDiv}px;
  font-size: 12px;
  font-weight: 500;
  font-family: ${helpers.specialFont};
  background: ${helpers.lightTextColor};
  color: ${helpers.primaryColor};
  border-radius: 2px;
`;

const RequestsClassTimes = styled.div`
  display: flex;
  justify-content: center;
`;

// const MyClassInfo = props => (
//   <ClassContainer>
//     <ClassContainerHeader>
//       <ClassTimings>{props.data.name}</ClassTimings>
//
//       {/*<Chip label={props.data.scheduleType} classes={{root: this.props.classes.chip, label: this.props.classes.chipLabel}}/> */}
//       <ScheduleType>
//         {props.getDatesBasedOnScheduleType(props.data)}
//       </ScheduleType>
//     </ClassContainerHeader>
//     <Typography>{props.data.desc}</Typography>
//
//     <CalenderButtonWrapper>
//       {props.addToCalender ? (
//         <PrimaryButton
//           icon
//           onClick={() => props.addToMyCalender(props.data)}
//           iconName="perm_contact_calendar"
//           label="Add to my Calender"
//         />
//       ) : (
//         <SecondaryButton
//           icon
//           onClick={() =>
//             props.handleClassInterest({
//               methodName: "classInterest.removeClassInterestByClassTimeId",
//               data: { classTimeId: props.data._id }
//             })
//           }
//           iconName="delete"
//           label="Remove from my Calender"
//         />
//       )}
//     </CalenderButtonWrapper>
//   </ClassContainer>
// );

class ClassTimesDialogBox extends React.Component {
  constructor(props) {
    super(props);
    this.scrollTo("myScrollToElement");
  }
  componentDidMount() {
    console.log("this--------->", this);
    if (this.myDiv) {
      this.myDiv.style.backgroundColor = "red";
    }
    setTimeout(() => {
      console.log("myScrollToElement", this.myDiv);
      let divElement = $("#myScrollToElement").offset();
      let offset = divElement.top;
      console.log("offset", offset);
      // send offset of modal to iframe script
      function sendTopOfPopup(e) {
        parent.postMessage(JSON.stringify({ popUpOpened: true, offset }), "*");
      }
      // Call sendTopOfPopup()
      sendTopOfPopup();
    }, 0);
  }
  checkForAddToCalender = data => {
    const userId = Meteor.userId();
    if (isEmpty(data) || isEmpty(userId)) {
      return true;
    } else {
      return isEmpty(
        ClassInterest.find({ classTimeId: data._id, userId }).fetch()
      );
    }
  };

  scrollTo(name) {
    scroller.scrollTo(name || "content-container", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart"
    });
  }

  getDatesBasedOnScheduleType = data => {
    let startDate = "";
    let endDate = "";
    const dateFormat = "DD-MM-YYYY";
    const scheduleType = data.scheduleType.toLowerCase();
    const scheduleDetails = data.scheduleDetails;

    if (scheduleType === "recurring") {
      startDate = moment(new Date(data.startDate)).format(dateFormat);
      endDate = moment(new Date(data.endDate)).format(dateFormat);
      debugger;
      if (startDate == "Invalid date") {
        return `Recurring ending on ${endDate}`;
      } else if (endDate == "Invalid date") {
        return `Recurring starting from ${startDate}`;
      }
      return `Recurring from ${startDate} to ${endDate}`;
    } else if (scheduleType === "ongoing") {
      return `Ongoing`;
    } else {
      startDate = moment(new Date(scheduleDetails["oneTime"].startDate)).format(
        dateFormat
      );
      return `Onetime on ${startDate}`;
    }
  };

  addToMyCalender = data => {
    // check for user login or not
    const userId = Meteor.userId();
    if (!isEmpty(userId)) {
      const doc = {
        classTimeId: data._id,
        classTypeId: data.classTypeId,
        schoolId: data.schoolId,
        userId
      };
      this.handleClassInterest({
        methodName: "classInterest.addClassInterest",
        data: { doc }
      });
    } else {
      // Show Login popup
      Events.trigger("loginAsUser");
    }
  };

  handleClassInterest = ({ methodName, data }) => {
    Meteor.call(methodName, data, (err, res) => {
      console.log(res, err);
    });
  };

  getSchedules = classesData => {
    const ourSchedules = [];

    classesData.forEach(data => {
      const addToCalender = this.checkForAddToCalender(data);

      if (data.scheduleType === "oneTime") {
        // If schedule is one time..
        data.scheduleDetails.oneTime.forEach(currentData => {
          const myScheduleData = JSON.parse(JSON.stringify(data));
          myScheduleData.scheduleDetails.oneTime = { ...currentData };

          ourSchedules.push(
            <MyClassInfo
              data={myScheduleData}
              getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
              addToMyCalender={this.addToMyCalender}
              handleClassInterest={this.handleClassInterest}
              addToCalender={addToCalender}
            />
          );

          // console.info(myScheduleData,"---------------------------");
        });
      } else {
        // If schedule is ongoing or recurring..
        ourSchedules.push(
          <MyClassInfo
            data={data}
            addToCalender={addToCalender}
            getDatesBasedOnScheduleType={this.getDatesBasedOnScheduleType}
            addToMyCalender={this.addToMyCalender}
            handleClassInterest={this.handleClassInterest}
          />
        );
      }
    });

    // console.info(classesData,ourSchedules,"ourSchedules....");

    return ourSchedules;
  };

  render() {
    // const classTimesData = this.normalizeScheduledetails(this.props.classesData);
    const { classInterestData, classTimesData, classes } = this.props;
    console.log("ClassTimesDialogBox props--->>", this.props);
    {
      console.log(this.props.x, this.props.y);
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onModalClose}
        aria-labelledby="modal"
        classes={{ root: classes.dialog, paper: classes.dialogPaper }}
      >
        <MuiThemeProvider theme={muiTheme}>
          <MyScrollToElement id="myScrollToElement" ref={c => (this.myDiv = c)}>
            <DialogTitle classes={{ root: classes.dialogTitle }}>
              <DialogTitleWrapper>
                Class Times
                <IconButton color="primary" className={classes.iconButton} onClick={this.props.onModalClose}>
                  <ClearIcon />
                </IconButton>
              </DialogTitleWrapper>
            </DialogTitle>
            <DialogContent
              classes={{ root: classes.dialogContent }}
              style={{ overflow: "hidden" }}
            >
              {isEmpty(classTimesData) ? (
                <ClassContainer>
                  <Typography caption="p">
                    No class times have been given by the school. Please click
                    this button to request the school complete their listing
                  </Typography>
                  <br />

                  <RequestsClassTimes>
                    <PrimaryButton
                      icon
                      onClick={this.props.handleClassTimeRequest}
                      iconName="perm_contact_calendar"
                      label="Request class times"
                    />
                  </RequestsClassTimes>
                </ClassContainer>
              ) : (
                <ClassTimesBoxes
                  classTimesData={classTimesData}
                  classInterestData={classInterestData}
                />
              )}
              {this.props.errorText && (
                <ErrorWrapper>{this.props.errorText}</ErrorWrapper>
              )}
            </DialogContent>
          </MyScrollToElement>
        </MuiThemeProvider>
      </Dialog>
    );
  }
}

ClassTimesDialogBox.propTypes = {
  onModalClose: PropTypes.func,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  classesData: PropTypes.arrayOf({
    timing: PropTypes.string,
    desc: PropTypes.string,
    addToCalender: PropTypes.bool,
    scheduleType: PropTypes.string
  }),
  errorText: PropTypes.string
};

export default withMobileDialog()(withStyles(styles)(ClassTimesDialogBox));
