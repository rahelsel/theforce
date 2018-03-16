import React,{ Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BrandBar from './components/BrandBar';
import Footer from './components/footer/index.jsx';
import SchoolHeader from './components/school/SchoolHeader.jsx';
import SchoolIssues from './components/school/SchoolIssues.jsx';
import SchoolPricing from './components/school/SchoolPricing.jsx';

import schoolIssuesData from './constants/schoolIssues.js';
import schoolPageCards from './constants/schoolPageCards.js';
import schoolPagePricingCards from './constants/schoolPagePriceCards.js';

import * as helpers from './components/jss/helpers.js';

const Wrapper = styled.div`
  background-color: #e6f4ff
`;

const School = () => (
  <Wrapper>
    <BrandBar
      navBarHeight="70"
      positionStatic={true}
      overlay={true}
      navBgColor={helpers.schoolPageColor}
      barButton={<span></span>} />

    <SchoolHeader />

    <SchoolIssues issues={schoolIssuesData} cardsData={schoolPageCards}/>

    <SchoolPricing cardsData={schoolPagePricingCards}/>

    <Footer />
  </Wrapper>
);

export default School;
