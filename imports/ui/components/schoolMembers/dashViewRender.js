import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import {Fragment} from 'react';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input';
import isEmpty from "lodash/isEmpty";



import SchoolMemberListItems from '/imports/ui/components/schoolMembers/schoolMemberList/index.js';
import  SchoolMemberFilter  from "./filter";
import SchoolMemberDetails from "./schoolMemberDetails"
import MemberDialogBox from "/imports/ui/components/landing/components/dialogs/MemberDetails.jsx";
import { ContainerLoader } from '/imports/ui/loading/container.js';
import SchoolMemberMedia from "/imports/ui/components/schoolMembers/mediaDetails";

export default function DashViewRender() {
  console.log("DashViewRender",this)
  const { classes, theme, schoolMemberDetails, schoolData, classTypeData} = this.props;
  const { renderStudentModal,memberInfo } = this.state;
  const { textSearch, classTypeIds } = this.state.filters;
  console.log("classTypeIds===>",classTypeIds)
  const memberFilter =  {schoolId:schoolData && schoolData._id, textSearch, classTypeIds};
  const drawer = (
        <SchoolMemberListItems filters={memberFilter} handleMemberDetailsToRightPanel={this.handleMemberDetailsToRightPanel}/>
    );
  return (
      <Grid container className="containerDiv" style={{backgroundColor: '#fff'}}>
        {
        this.state.isLoading && <ContainerLoader />
        }
        <Grid item sm={4} xs={12} md={4} className="leftSideMenu" style={{border: 'solid 1px #ddd',height:'100vh'}}>
          <Grid container>
              <SchoolMemberFilter
                  stickyPosition={this.state.sticky}
                  ref="ClaimSchoolFilter"
                  {...this.props}
                  handleClassTypeDataChange={this.handleClassTypeDataChange}
                  onLocationChange={this.onLocationChange}
                  handleMemberNameChange={this.handleMemberNameChange}
                  locationInputChanged={this.locationInputChanged}
                  memberNameFilter = { memberFilter }
                  classTypeData = { classTypeData }
              />
              <form noValidate autoComplete="off">
                {
                  renderStudentModal &&
                  <MemberDialogBox
                    open={renderStudentModal}
                    renderStudentAddModal = {this.renderStudentAddModal}
                    addNewMember={this.addNewMember}
                    onModalClose={() => this.setState({renderStudentModal:false})}
                  />
                }
              </form>
              <Grid item sm={12} xs={12} md={12} style={{display:'flex',flexDirection: 'row-reverse'}}>
                <Button raised color="primary" onClick={()=>this.setState({renderStudentModal:true})}>
                  Add New Student
                </Button>
              </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={12} xs={12} md={12}>
                <Hidden mdUp>
                  {drawer}
                </Hidden>
                <Hidden smDown>
                    {drawer}
                </Hidden>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={8} xs={12} md={8} className="rightPanel">
          { !isEmpty(memberInfo) &&
            <Fragment>
              <SchoolMemberDetails
                memberInfo={memberInfo}
                handleInput={this.handleInput}
                saveAdminNotesInMembers={this.saveAdminNotesInMembers}
              />
              <SchoolMemberMedia
                schoolData={schoolData}
                memberInfo={memberInfo}
                schoolMemberDetailsFilters={this.state.schoolMemberDetailsFilters}
                handleTaggingMembers={this.handleTaggingMembers}
                mediaListfilters={
                  {
                    '$or': [
                        { taggedMemberIds: { '$in': [memberInfo.memberId]} },
                    ]
                  }
                }
              />
            </Fragment>
          }
        </Grid>
      </Grid>
    )
}
