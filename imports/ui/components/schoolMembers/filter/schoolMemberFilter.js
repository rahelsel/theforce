import React from "react";
import styled from 'styled-components';
import Grid from 'material-ui/Grid';
import Multiselect from 'react-widgets/lib/Multiselect'
import Hidden from 'material-ui/Hidden';
import { MuiThemeProvider} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import TextField from 'material-ui/TextField';


import * as helpers from '/imports/ui/components/landing/components/jss/helpers';
import muiTheme from '/imports/ui/components/landing/components/jss/muitheme';
import IconInput from '/imports/ui/components/landing/components/form/IconInput';

const FilterPanelContainer = styled.div`
    background: ${props => props.stickyPosition ? '#ffffff' : '1000px'};
    flex-grow: 1;
    padding:16px;
`;

const FilterPanelContent = styled.div`
`;

const FilterPanelInnerContent = styled.div`
    overflow: hidden;
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv*2}px 0px;
`;

const FilterButtonArea = styled.div`
    ${helpers.flexCenter}
    max-width: 300px;
    margin: auto;
    margin-top:-24px;
`;
export default function (props) {
  console.log("props and this===>",props,this)
  const { stickyPosition } = props;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <FilterPanelContainer stickyPosition={stickyPosition}>
        <FilterPanelContent stickyPosition={stickyPosition}>
         <form noValidate autoComplete="off">
            <Grid container style={{display: 'block'}}>
              <Grid item xs={9} sm={12}>
                <IconInput
                  id="search"
                  type="text"
                  margin="normal"
                  onChange={this.props.handleSchoolNameChange}
                  skillShapeInput={true}
                  iconName='school'
                  placeholder="Member Name"
                />
              </Grid>
              <Grid item xs={9} sm={12}>
                 <Multiselect
                    textField={"name"}
                    valueField={"_id"}
                    placeholder="Class Type"
                    data = {this.props && this.props.dataForSkillTypes}
                    onChange={this.props.handleSkillCategoryChange}
                  />
              </Grid>
              <Grid item xs={9} sm = {12}>
                 <Multiselect
                    textField={"name"}
                    valueField={"_id"}
                    placeholder="Class Attendence"
                    data = {this.props && this.props.dataForSkillTypes}
                    onChange={this.props.handleSkillCategoryChange}
                  />
              </Grid>
            </Grid>
          </form>
        </FilterPanelContent>
      </FilterPanelContainer>
    </MuiThemeProvider>
  )
}