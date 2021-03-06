import React, {Fragment} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ReactHtmlParser from 'react-html-parser';

import StarsBar from '../StarsBar.jsx';
import * as helpers from '../jss/helpers.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 496px;

  opacity: ${props => props.isEdit ? 0 : 1};

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: ${props => props.isEdit ? 'none' : 'flex'};
  }
`;

const ReviewsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 0;
  margin-bottom: ${helpers.rhythmDiv * 2}px;
  font-size: ${helpers.baseFontSize}px;
`;

const Title = styled.h2`
  font-size: ${helpers.baseFontSize * 3}px;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
  font-weight: 100;
  text-transform: capitalize;
`;

const NoOfReviews = styled.p`
  font-family: ${helpers.specialFont};
  font-style: italic;
  line-height: 1;
  margin: 0;
`;

const Description = styled.p`
  color: ${helpers.black};
  font-size: ${helpers.baseFontSize}px;
  font-weight: 400;
  font-family: ${helpers.specialFont};
  line-height: 1;
  margin: 0;
`;

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StarWrapper = styled.div`
  margin-right: ${helpers.rhythmDiv/2}px;
`;

const Reviews = styled.a`
  color: ${helpers.information};
  font-weight: 400;
  line-height: 1;
`;

const SchoolLink = styled(Link)`
  color: ${helpers.primaryColor};
  position: relative;
  display: inline;

  &:hover {
    text-decoration: underline;
  }
`;

const ClassTypeDescription = (props) => {
  const PublishStatusButton = props.publishStatusButton;
  return (
    <Wrapper isEdit={props.isEdit}>
        {props.isClassTypeNameAvailable ?
        <Title>
          <SchoolLink to={`/schools/${props.friendlySlug}`} target="_blank">{props.schoolName.toLowerCase()} {props.classTypeName && `:`}</SchoolLink>
          <span> { props.classTypeName.toLowerCase()}</span>
        </Title>
        :
        <Title>{props.schoolName.toLowerCase()}
          {(!props.isEdit && props.publishStatusButton) && <PublishStatusButton />}
        </Title>}

        <ReviewsWrapper>
          {props.noOfStars && <StarsBar noOfStars={props.noOfStars} />}

          <NoOfReviews>
            {props.noOfReviews > 0 && <Reviews href="#">({props.noOfReviews} Reviews)</Reviews>}
          </NoOfReviews>
        </ReviewsWrapper>

        <Description>
          {props.description && ReactHtmlParser(props.description)}
        </Description>
    </Wrapper>
  )
}

ClassTypeDescription.propTypes = {
  classTypeName: PropTypes.string.isRequired,
  schoolName: PropTypes.string.isRequired,
  description: PropTypes.string,
  noOfReviews: PropTypes.number,
  noOfStars: PropTypes.number,
  isEdit: PropTypes.bool
}

ClassTypeDescription.defaultProps = {
  isEdit: false
}

export default ClassTypeDescription;
