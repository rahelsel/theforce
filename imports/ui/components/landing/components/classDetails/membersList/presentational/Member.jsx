import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router";
import styled from "styled-components";
import MemberExpanded from "./MemberExpanded.jsx";
import DropDownMenu from "/imports/ui/components/landing/components/form/DropDownMenu.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
import { Capitalize, SubHeading, Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import { addInstructorImgSrc } from "/imports/ui/components/landing/site-settings.js";




const menuOptions = [
  {
    name: "Evaluate",
    value: "evalute"
  },
  {
    name: "Remove Teacher",
    value: "remove_teacher"
  }
];

const Wrapper = styled.div`
  background: ${helpers.panelColor};
  display: flex;
  width: 160px;
  height: 180px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
`;

const ProfilePic = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
  width: 100px;
  height: 100px;
  display: flex;
  padding: ${helpers.rhythmDiv * 2}px;
  padding-top: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  ${props => props.addInstructor && `cursor: pointer;`};
`;

const DetailsWrapper = styled.div`
  ${props =>
    props.type === "student"
      ? helpers.flexCenter
      : helpers.flexHorizontalSpaceBetween};
  align-items: flex-start;
  width: 100%;
  flex-shrink: 0;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const StudentNotes = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  display: flex;
  min-width: 0;
`;

const StudentNotesContent = styled.textarea`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize}px;
  font-style: italic;
  height: 100%;
  border-radius: 5px;
`;

const Status = styled.div`
  padding: ${helpers.rhythmDiv * 2}px;
  min-width: 0;
`;

/* prettier-ignore */

const ExpiresOn = Designation = Text.extend`
  font-style: italic;
  font-weight: 300;
`;

const onMenuItemClick = value => {
  console.log(value, "---", props.history);
  if (value === "remove_teacher") {
    props.history.push("/remove_teacher");
  } else {
    props.history.push("/some-random-link");
  }
};

const Member = props => {
  const profileSrc = props.addInstructor
    ? addInstructorImgSrc
    : props.profileSrc;

  const name = props.addInstructor ? "Add Instuctor" : props.name;
  // This is the basic card returned for students in case the view
  // is not instructorsView && for teachers in both the cases.

  if (props.type === "student" && props.viewType === "instructorsView") {
    return <MemberExpanded {...props} />;
  }

  return (
    <Wrapper>
      <Profile>
        <ProfilePic
          addInstructor={props.addInstructor}
          src={profileSrc}
          onClick={props.onAddIconClick}
        />
        <DetailsWrapper type={props.type}>
          <Details>
            <SubHeading fontSize="20">{name}</SubHeading>
            {props.type !== "student" &&
              !props.addInstructor && (
                <Text>
                  <Capitalize>{props.type}</Capitalize>
                </Text>
              )}
          </Details>
          {props.viewType === "instructorsView" &&
            !props.addInstructor && <DropDownMenu menuOptions={menuOptions} />}
          
        </DetailsWrapper>
      </Profile>
    </Wrapper>
  );
};

Member.propTypes = {
  expanded: PropTypes.bool,
  showMoreOptions: PropTypes.bool,
  type: PropTypes.string //type can be student, teacher
};

export default withRouter(Member);
