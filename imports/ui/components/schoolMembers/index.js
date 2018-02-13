import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import styled from 'styled-components';
import IconInput from '/imports/ui/components/landing/components/form/IconInput.jsx';
import IconSelect from '/imports/ui/components/landing/components/form/IconSelect.jsx';
import SliderControl from '/imports/ui/components/landing/components/form/SliderControl.jsx';
import IconButton from 'material-ui/IconButton';
import {FormHelperText } from 'material-ui/Form';
import Multiselect from 'react-widgets/lib/Multiselect'
import Menu, { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import * as helpers from '/imports/ui/components/landing/components/jss/helpers.js';



// import { withStyles } from 'material-ui/styles';

import DashViewRender from './dashViewRender';

const MaterialInputWrapper = styled.div`
  transform: translateY(-${props => props.select ? (helpers.rhythmDiv + 2) : helpers.rhythmDiv}px);
`;

const FilterPanelAction = styled.div`
    padding:${helpers.rhythmDiv*2}px 0px;
`;

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});
class DashView extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        mobileOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    };
    renderFiltersForDialogBox = () => {
      return (
        <Grid container spacing={24}>
            {/* 1rst Row */}
            <Grid item xs={12} sm={12}>
                <TextField
                  id="firstName"
                  label="First Name"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="lastName"
                  label="Last Name"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="email"
                  label="Email"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <TextField
                  id="phone"
                  label="Phone"
                  margin="normal"
                  fullWidth
                />
            </Grid>
            <Grid item sm={12} xs={12} md={12} style={{float:'right'}}>
                <Button raised color="primary">
                  Add
                </Button>
          </Grid>
          </Grid>
      )
    }
    handleMemberDialogBoxState = () => {
        this.setState({renderStudentModal:false})
    }
    // Return Dash view from here
    render() {
        console.log("111111111111",this)
        const { classes, theme } = this.props;
        return DashViewRender.call(this);
    }
}


export default withStyles(styles, { withTheme: true })(DashView);

