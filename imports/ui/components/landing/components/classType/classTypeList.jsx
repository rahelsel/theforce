import React, {Component, Fragment} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { findIndex, isEmpty } from 'lodash';
import Typography from 'material-ui/Typography';
//import Sticky from 'react-sticky-el';
import Sticky from 'react-stickynode';

import ClassMap from '../map/ClassMap.jsx';
import MapView from '../map/mapView.jsx';
import CardsList from '../cards/CardsList.jsx';
import Footer from '../footer/index.jsx';
import { cardsData, cardsData1} from '../../constants/cardsData.js';
import PrimaryButton from '../buttons/PrimaryButton.jsx';
import { Loading } from '/imports/ui/loading';
import * as helpers from '../jss/helpers.js';

// import collection definition over here
import ClassType from "/imports/api/classType/fields";
import School from "/imports/api/school/fields";
import SLocation from "/imports/api/sLocation/fields";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";

const MainContentWrapper = styled.div`
  display: flex;
`;

const CardsContainer = styled.div`
  width: 100%;
`;

const NoResultContainer = styled.div`
  text-align: center;
`;

const MapOuterContainer = styled.div`
  width: 40%;
  display: block;
  position: relative;
  @media screen and (max-width: ${helpers.tablet + 100}px) {
    width: 100%;
  }
`;

const MapContainer = styled.div`
  transform: translateY(75px);
  height: calc(100vh - 80px);
`;

const WithMapCardsContainer = styled.div`
  width: 60%;
  padding:${helpers.rhythmDiv * 2}px;
  padding-top: 0;

  ${helpers.flexDirectionColumn}
  justify-content: space-between;
  transform: translateY(80px);

  @media screen and (max-width: ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
`;

const FooterOuterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;

  @media screen and (max-width : ${helpers.tablet + 100}px) {
    display: none;
    width: 0;
    height: 0;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
`;


class ClassTypeList extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      filters: {}
	    }
	}

	makeCategorization = ({classTypeData = [], skillCategoryData}) => {
	    let data = {};
	    for(skillCategoryObj of skillCategoryData) {
	    	data[skillCategoryObj.name] = [];
	    	for(classTypeObj of classTypeData) {
	    		if(!isEmpty(classTypeObj.selectedSkillCategory)) {
	    			let index = findIndex(classTypeObj.selectedSkillCategory,{_id: skillCategoryObj._id})
	    			if(index > -1) {
	    				data[skillCategoryObj.name].push(classTypeObj)
	    			}
	    		}
	    	}
	    }
	    return data;
  	}

  	showClassTypes = ({classType}) => {
  		console.log("showClassTypes classType -->>>",classType, this.props)
  		if(!isEmpty(classType)) {
            return Object.keys(classType).map((key, index)=> {

                let title = key;
                if(this.props.locationName == "your location") {
                    title = `${key} in your location`
                } else if(this.props.locationName) {
                    title = `${key} in ${this.props.locationName}`
                }
  				if(!isEmpty(classType[key])) {
  					return <CardsList
  						key={index}
                		mapView={this.props.mapView}
                		title={title}
                		name={key}
                		cardsData={classType[key]}
                		classInterestData={this.props.classInterestData}
                        locationName={this.props.locationName}
                        handleSeeMore={this.props.handleSeeMore}
                	/>
  				}
  			})
  		}
  	}

    getNoResultMsg = (isLoading, filters, classTypeData) => {
        if(isLoading) {

            return <Loading/>

        } else if(!isEmpty(filters.coords) && this.props.defaultLocation && isEmpty(classTypeData)) {

            return <NoResultContainer>
                <span style={{padding: 8}}>
                    <b>No Results Found</b>
                </span>
                <PrimaryButton
                    label="Want to explore in other location"
                    icon={true}
                    iconName="search"
                    onClick={this.props.clearDefaultLocation}
                />
            </NoResultContainer>

        }
    }

	render() {
		console.log("ClassTypeList props -->>",this.props);
		const { mapView, classTypeData, skillCategoryData, splitByCategory, filters, isLoading } = this.props;
    console.log(classTypeData ,"class type data ---->///")
    return (
			<MainContentWrapper>
				{
					mapView ? (
              <Fragment>
                  <MapOuterContainer>
                    <Sticky top={0}>
                      <MapContainer>
                        <MapView {...this.props} />
                      </MapContainer>
                    </Sticky>
                  </MapOuterContainer>

                  <WithMapCardsContainer>
                      <div>
                        <CardsList
                          mapView={this.props.mapView}
                          cardsData={classTypeData}
                          classInterestData={this.props.classInterestData}
                          handleSeeMore={this.props.handleSeeMore}
                        />
                      </div>

                      <FooterOuterWrapper>
                        <FooterWrapper>
                          <Footer mapView={this.props.mapView}/>
                        </FooterWrapper>
                      </FooterOuterWrapper>
                  </WithMapCardsContainer>
              </Fragment>
					) : (
						<CardsContainer>
							{
								splitByCategory ? this.showClassTypes({
									classType: this.makeCategorization({classTypeData: classTypeData, skillCategoryData: skillCategoryData})
								}) : ( <CardsList
                                  mapView={this.props.mapView}
                                  cardsData={classTypeData}
                                  classInterestData={this.props.classInterestData}
                                  handleSeeMore={this.props.handleSeeMore}
                                />)
							}
                            {
                                this.getNoResultMsg(isLoading, filters, classTypeData)
                            }
                        	{/*<CardsList
                        		mapView={mapView}
                        		title={'Yoga in Delhi'}
                        		name={'yoga-in-delhi'}
                        		cardsData={cardsData}
                        	/>*/}
						</CardsContainer>
					)
				}
			</MainContentWrapper>
		)
	}
}

export default createContainer(props => {
	console.log("ClassTypeList createContainer -->>",props)
	let classTypeData = [];
	let schoolData = [];
	let skillCategoryData = [];
	let classTimesData = [];
	let classInterestData = [];
    let sLocationData = [];
    let isLoading = true;
    let subscription;
    let filters = props.filters ? props.filters : {};

    if(props.mapView) {
        const query = props.location && props.location.query;
        if(query && query.NEPoint && query.SWPoint) {
          filters.NEPoint = query.NEPoint.split(",").map(Number)
          filters.SWPoint = query.SWPoint.split(",").map(Number)
        }
    }

    if(props.splitByCategory) {
        subscription = Meteor.subscribe("school.getClassTypesByCategory", filters);
    } else {
        // This is used to grab `ClassTypes` on the basis of `schoolId`
        subscription = Meteor.subscribe(props.classTypeBySchool, props.filters);
    }

	Meteor.subscribe("classInterest.getClassInterest");

	classTypeData = ClassType.find().fetch();
	schoolData = School.find().fetch();
  	skillCategoryData = SkillCategory.find().fetch();
  	classTimesData = ClassTimes.find().fetch();
  	classInterestData = ClassInterest.find().fetch();
  	sLocationData = SLocation.find().fetch();

    /*Find SkillCategory,SkillSubject and SLocation to make this container reactive on these collection
    other wise skills are joined with collections using package
    perak:joins */
    SkillSubject.find().fetch();

    if(subscription.ready()) {
        isLoading = false
    }
  	console.log("classInterestData --->>",classInterestData)
  	return {
  		...props,
  		classTypeData,
  		schoolData,
  		skillCategoryData,
  		classTimesData,
  		classInterestData,
        sLocationData,
        isLoading,
  	};

}, ClassTypeList);
