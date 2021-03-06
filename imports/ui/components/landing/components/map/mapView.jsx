import isMatch from 'lodash/isMatch';
import React from "react";
import styled from 'styled-components';
import * as helpers from "../jss/helpers.js";
import config from '/imports/config';
import { initializeMap, reCenterMap, setMarkersOnMap } from '/imports/util';
import Events from '/imports/util/events';



// fixed height causing slight issues in rendering
const MapContainer = styled.div`
    height: 100%;

    @media screen and (max-width: ${helpers.tablet + 100}px) {
      margin-left: 0;
    }
`;

class MapView extends React.Component {

	constructor(props){
    	super(props);
    	this.state = {
    		classType: [],
    		school: {},
    		skillClass: [],
    	}
	}

	componentWillMount() {
		Events.on("getSeletedSchoolData", "43434",(data) => {
      		this.getSeletedSchoolData(data);
    	})
	}

	componentDidMount() {
      /***
        Need to handle three cases:
         - if there is an address in the profile then it should show data according to profile address.
         - if there is no address in their profile then map view should open location according to IP.
         - if neither is available then it should go to Amsterdam (default location)
      */
      let myLocationCoords =  JSON.parse(localStorage.getItem("myLocation"));
      let currentUser = this.props.currentUser;
      let profileCoords;
      if(currentUser) {
      	profileCoords = currentUser.profile && currentUser.profile.coords;
      }
      this.map = initializeMap(profileCoords || myLocationCoords || this.props.filters.coords || config.defaultLocation);
    }

	componentWillReceiveProps(nextProps) {
		let locationDiff = isMatch(this.props.filters.coords, nextProps.filters.coords);
		if(nextProps.filters.coords && !locationDiff) {
			this.map = reCenterMap(this.map, nextProps.filters.coords)
		}
		setMarkersOnMap(this.map, nextProps.sLocationData, nextProps.filters);
	}

	getSeletedSchoolData = ({school = {}}) => {
		this.props.setSchoolIdFilter({schoolId: school._id})
	}

	render(){
		return <MapContainer id="google-map" />
	}
}

export default MapView;
