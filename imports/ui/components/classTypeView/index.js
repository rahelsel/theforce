import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { createContainer } from 'meteor/react-meteor-data';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ContactUsBar from '/imports/ui/components/landing/components/ContactUsBar';
import TopSearchBar from '/imports/ui/components/landing/components/TopSearchBar';
import Footer from '/imports/ui/components/landing/components/footer/index.jsx';
import ClassTypeContent from './ClassTypeContent';

import School from "/imports/api/school/fields";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassPricing from "/imports/api/classPricing/fields";
import MonthlyPricing from "/imports/api/monthlyPricing/fields";
import Media from "/imports/api/media/fields";
import ClassInterest from "/imports/api/classInterest/fields";


const Wrapper = styled.div`
  width: 100%;
`;

class ClassTypeView extends Component {
    render() {
        console.log("ClassTypeView .props-->>",this.props)
		return(<DocumentTitle title={get(this.props, "params.classTypeName", "Untitled")}>
			     <Wrapper className="classtype-page">
              <div>
                <TopSearchBar {...this.props}/>
              </div>
      		    <ClassTypeContent {...this.props}/>
        		<Footer/>
        	</Wrapper>
      </DocumentTitle>
		)
	}
}

ClassTypeView.propsTypes = {
    className: PropTypes.string
}

ClassTypeView.defaultProps = {
    className: 'naam yoga'
}

export default createContainer(props => {
	console.log("ClassType createContainer props -->>",props);
	const { classTypeId } = props.params;
	let subscription;
	let isLoading = true;
  let classInterestData = [];

	if(classTypeId) {
		subscription = Meteor.subscribe("classType.getClassTypeWithClassTimes", {classTypeId});
	}

	if(subscription && subscription.ready()) {
        isLoading = false
    }
    Meteor.subscribe("classInterest.getClassInterest");
    classInterestData = ClassInterest.find({}).fetch();
    let classTypeData = ClassType.findOne({ _id: classTypeId});
    let schoolData = School.findOne();
    let classTimesData = ClassTimes.find().fetch();
    let classPricingData = ClassPricing.find().fetch();
    let monthlyPricingData = MonthlyPricing.find().fetch();
    let mediaData = Media.find().fetch();

  	console.log("ClassType classTypeData -->>>",classTypeData)
    console.log("ClassType classTimesData -->>>",classTimesData)
    console.log("ClassType schoolData -->>>",schoolData)
    console.log("ClassType classPricingData -->>>",classPricingData)
  	console.log("ClassType monthlyPricingData -->>>",monthlyPricingData)
	return {
  		...props,
  		isLoading,
  		classTypeData,
  		classTimesData,
        schoolData,
        classPricingData,
        monthlyPricingData,
        mediaData,
        classInterestData
  	}

}, ClassTypeView);