import React from 'react';
var ReactDOM = require('react-dom');
export default class ClaimSchoolBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: {}
    }
  }

  resetFilter = (filterRef) => {
    filterRef.schoolName.value = "";
    filterRef.website.value = "";
    filterRef.phoneNumber.value = "";
    filterRef.claimcoords = "";
    filterRef.address.value = "";
    filterRef.typeOfSkill.value = "Any";
    this.setState({
      filters: {}
    });
  }

  onSearch = (filterRef) => {
    let cskill = filterRef.typeOfSkill.value;
    if(filterRef.typeOfSkill.value == "Type Of Skills")
      cskill = ""
    this.setState({
      filters: {
        phone : filterRef.phoneNumber.value,
        website: filterRef.website.value,
        name: filterRef.schoolName.value,
        coords: filterRef.claimcoords,
        cskill: cskill,
      }
    });
  }

}