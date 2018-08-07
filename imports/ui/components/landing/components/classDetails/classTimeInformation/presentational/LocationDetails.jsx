import React from "react";
import styled from "styled-components";
import Icon from "material-ui/Icon";

import { Text } from "/imports/ui/components/landing/components/jss/sharedStyledComponents.js";
import SchoolLocationMap from "/imports/ui/components/landing/components/map/SchoolLocationMap.jsx";
import { rhythmDiv } from "/imports/ui/components/landing/components/jss/helpers.js";

const Wrapper = styled.div`
  max-height: 300px;
  width: 100vw;
  display: flex;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: space-between;
  padding: ${rhythmDiv * 2}px;
  text-align: center;
  max-width: 50%;
  width: 100%;
`;

const Right = styled.div`
  height: 100%;
  max-width: 50%;
  width: 100%;
`;

/* prettier-ignore */
const Time = Address = Date = Text.extend`
  display: flex;
  font-style: italic;
`;

const LocationDetails = props => {
  return (
    <Wrapper>
      <Left>
        <Date>
          <Icon>calendar_today</Icon>
          {props.date}
        </Date>
        <Time>
          <Icon>timer</Icon>
          {props.time}-
        </Time>
        <Address>
          <Icon>my_location</Icon>
          {props.address}
        </Address>
      </Left>
      <Right>
        <SchoolLocationMap markerDraggable={false} />
      </Right>
    </Wrapper>
  );
};

LocationDetails.propTypes = {};

export default LocationDetails;
