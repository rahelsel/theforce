import React from "react";
import { createContainer } from 'meteor/react-meteor-data';
import styled from 'styled-components';
import { initializeMap, setMarkersOnMap, reCenterMap } from '/imports/util';
import Events from '/imports/util/events';
import config from '/imports/config';

import ClassType from "/imports/api/classType/fields";
import SLocation from "/imports/api/sLocation/fields";

const MapContainer = styled.div`
    height: 595px;
    margin-left: 10px;
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
      	this.map = initializeMap(this.props.filters.coords || config.defaultLocation)
	}

	componentWillReceiveProps(nextProps) {
		let locationDiff = _.difference(this.props.filters.coords, nextProps.filters.coords);
		if(locationDiff && locationDiff.length > 0) {
			this.map = reCenterMap(this.map, nextProps.filters.coords)
		}
		setMarkersOnMap(this.map, this.props.sLocationData, nextProps.filters);
	}

	getSeletedSchoolData = ({school = {}}) => {
		console.log("getSeletedSchoolData fn called-->>",school);
		this.props.setSchoolIdFilter({schoolId: school._id})
	}

	render(){
		console.log("Mapview props ==>>", this.props);
		return <MapContainer id="google-map" />
	}
}

export default MapView;