import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import { isEmpty } from 'lodash';

import ClassTime from '/imports/ui/components/landing/components/classTimes/ClassTime.jsx';

import ClassInterest from "/imports/api/classInterest/fields";

import classTime from '/imports/ui/components/landing/constants/structure/classTime.js';
import { CLASS_TIMES_CARD_WIDTH } from '/imports/ui/components/landing/constants/classTypeConstants.js';
import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';

import  {getContainerMaxWidth} from '/imports/util/cards.js';

const CARD_WIDTH = CLASS_TIMES_CARD_WIDTH;

const Wrapper = styled.div`
  width: 100%;
`;

const styles = {
  typeItem: {
    display: 'flex',
    justifyContent: 'center'
  }
}

const ClassTimesWrapper = styled.div`
  max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,4)}px;
  margin: 0 auto;

  @media screen and (max-width : 1200px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,3)}px;
  }

  @media screen and (max-width : 1000px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,2)}px;
  }

  @media screen and (max-width : 600px) {
    max-width: ${props => getContainerMaxWidth(CARD_WIDTH,props.spacing,1)}px;
  }
`;

const GridContainer = styled.div`
  ${helpers.flexCenter}
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const GridItem = styled.div`
  padding: ${props => props.spacing ? props.spacing/2 : '16'}px;
  flex-grow: 1;
  width: 100%;
  max-width: ${props => props.inPopUp ? '100%' : CARD_WIDTH + props.spacing + 'px'};

  @media screen and (max-width: 700px) {
    max-width: ${props => props.inPopUp ? '100%' : CARD_WIDTH + 'px'}
  }

  media screen and (max-width: 600px) {
    max-width: ${props => props.inPopUp ? '100%' : CARD_WIDTH + props.spacing + 'px'};
  }
`;

const ClassTimesBar = (props) => {

  checkForAddToCalender = (data) => {
    const userId = Meteor.userId()
    if(isEmpty(data) || isEmpty(userId)) {
        return true;
    } else {
        return isEmpty(ClassInterest.find({classTimeId: data._id, userId}).fetch());
    }
  }
  console.log("props in ClassTimesBar",props);
  const { handleAddToMyCalendarButtonClick, inPopUp, classTimesData, classInterestData, handleRemoveFromCalendarButtonClick } = props;
  let addToCalender;
  return (
    <Wrapper>
       <ClassTimesWrapper spacing={32}>
        <GridContainer>
          {classTimesData.map(classTimeObj => {
            // addToCalender  = this.checkForAddToCalender(classTimeObj)
            return (
              <GridItem key={classTimeObj._id} spacing={32} inPopUp={inPopUp}>
                <ClassTime
                  {...classTimeObj}
                  inPopUp={inPopUp}
                  classTimeData={ classTimeObj }
                  classInterestData={classInterestData}
                 />
              </GridItem>
            )
          })}
        </GridContainer>
       </ClassTimesWrapper>
    </Wrapper>
  );
}

ClassTimesBar.propTypes = {
  inPopUp: PropTypes.bool,
  classTimesData: PropTypes.arrayOf(classTime),
}

ClassTimesBar.defaultProps = {
  inPopUp: false
}

export default withStyles(styles)(ClassTimesBar);
