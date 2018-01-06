import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SearchBar from 'material-ui-search-bar';
import NearByClassesButton from './buttons/NearByClassesButton';

import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';

import * as helpers from './jss/helpers.js';

/*Search Bar requires inline styles because of limitations of it using material-ui
rather than material ui next */

const SearchBarStyled = (props) => (
  <SearchBar
    style={{
      fontFamily: helpers.specialFont,
      fontSize: helpers.baseFontSize*2+'px',
      margin: '0 auto',
    }}
    onChange={props.onChange ? props.onChange : () => console.log("changed")}
    onRequestSearch={props.onRequestSearch ? props.onRequestSearch : () =>  console.log("search")}
    className = 'is-search-bar'
    hintText ='Yoga in Delhi...'
    />
)


const SearchAreaPanel = styled.div`
  padding: ${helpers.rhythmInc};
  max-width: 431px;
  margin: auto;
  text-align: center;
   @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
     max-width:300px;
  }
`;

const TaglineArea = styled.div`
`;



const Tagline = styled.h2`
  font-family : ${helpers.specialFont};
  font-weight: 100;
  color: ${helpers.headingColor};
  font-size:${helpers.baseFontSize*3}px;
  margin: 0;
  text-align:center;
   @media screen and (min-width: 0) and (max-width : ${helpers.mobile}px) {
     font-size:${helpers.baseFontSize*2}px;;
  }
`;

const TaglineText = styled.p`
  font-family : ${helpers.commonFont};
  color: ${helpers.textColor};
  margin-top: ${helpers.rhythmDiv};
`;


const MiddleSection = styled.div`
  font-family: ${helpers.specialFont};
  font-size: ${helpers.baseFontSize*2}px;
  color: ${helpers.focalColor};
  margin: 0px;
`;

const TaglineWrapper = () => (
  <TaglineArea>
    <Tagline>Find Your Ideal Class</Tagline>
  </TaglineArea>
);

const BottomSectionContent = () => (
  <div>
   <TaglineText>SkillShape helps you find and attend classes on your subject of interest, in your location, and at your price</TaglineText>
  <PrimaryButton icon iconName="room" label="Browse classes near you" />  <SecondaryButton icon iconName="domain" label="Add your school"/>
  </div>
);

const SearchArea = (props) => (
  <SearchAreaPanel width={props.width} textAlign={props.textAlign}>
    {props.topSection ? props.topSection : <TaglineWrapper />}
    {props.middleSection ? props.middleSection : <SearchBarStyled />}
    {props.bottomSection ? props.bottomSection : <BottomSectionContent /> }
  </SearchAreaPanel>
);


SearchArea.propTypes = {
    topSection: PropTypes.element,
    middleSection: PropTypes.element,
    middleSectionText: PropTypes.string,
    bottomSection: PropTypes.element
}

SearchAreaPanel.defaultProps = {
    textAlign: 'center',
}

SearchArea.defaultProps = {
    middleSectionText: 'Or'
}

export default SearchArea;