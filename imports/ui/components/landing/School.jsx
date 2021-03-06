import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import BrandBar from "./components/BrandBar";
import Footer from "./components/footer/index.jsx";
import SchoolHeader from "./components/school/SchoolHeader.jsx";
import SchoolIssues from "./components/school/SchoolIssues.jsx";
import SchoolPricing from "./components/school/SchoolPricing.jsx";

import schoolIssuesData from "./constants/skillshape-for-school/schoolIssues.js";
import schoolPageCards from "./constants/skillshape-for-school/schoolPageCards.js";
import schoolPagePricingCards from "./constants/skillshape-for-school/schoolPagePriceCards.js";

import * as helpers from "./components/jss/helpers.js";

const Wrapper = styled.div`
  background-color: #d2e4e9;
`;

const School = props => (
  <Wrapper>
    <div>
      <BrandBar
        isUserSubsReady={props.isUserSubsReady}
        currentUser={props.currentUser}
        navBarHeight="70"
        position={'relative'}
        overlay={true}
        navBgColor={helpers.schoolPageColor}
        barButton={<span />}
      />
    </div>

    <SchoolHeader />

    <SchoolIssues issues={schoolIssuesData} cardsData={schoolPageCards} />

    {/*<SchoolPricing cardsData={schoolPagePricingCards} />*/}
    <Footer />
  </Wrapper>
);



export default School;
