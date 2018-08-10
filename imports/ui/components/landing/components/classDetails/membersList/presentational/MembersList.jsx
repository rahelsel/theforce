import React from "react";
import styled from "styled-components";

import {
  SlantedHeading,
  Capitalize
} from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import {
  rhythmDiv,
  mobile
} from "/imports/ui/components/landing/components/jss/helpers.js";

import SearchList from "./SearchList.jsx";
import Member from "./Member.jsx";

const Wrapper = styled.div`
  padding: 0 ${rhythmDiv * 2}px;
  margin-bottom: ${rhythmDiv * 4}px;
`;

const ListHeading = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MembersGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  ${props => (props.entityType === "students" ? `flex-direction: column` : "")};

  @media screen and (min-width: ${mobile - 50}px) {
    flex-direction: row;
  }
`;

const MemberWrapper = styled.div`
  padding: ${rhythmDiv}px;
  ${props =>
    props.expanded
      ? `max-width: 500px;
          width: 100%;`
      : ""};
`;

const Title = SlantedHeading.extend`
  display: flex;
  margin-bottom: ${rhythmDiv}px;

  @media screen and (min-width: ${mobile - 50}px) {
    margin-bottom: 0;
  }
`;

const MembersList = props => (
  <Wrapper>
    <ListHeading>
      <Title>
        <Capitalize>{props.entityType}&nbsp;</Capitalize> in class
      </Title>
      <SearchList
        onChange={props.onSearchChange}
        searchedValue={props.searchedValue}
      />
    </ListHeading>
    <MembersGrid entityType={props.entityType}>
      {props.data &&
        props.data.map(obj => (
          <MemberWrapper
            expanded={
              props.viewType === "instructorsView" &&
              props.entityType === "students"
            }
            type={obj.type}
          >
            <Member viewType="instructorsView" {...obj} />
          </MemberWrapper>
        ))}
    </MembersGrid>
  </Wrapper>
);

export default MembersList;
