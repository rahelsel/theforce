import React from 'react';
import { Router, Route, browserHistory, DefaultRoute, IndexRoute } from 'react-router';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import green from "material-ui/colors/green";
//layout
import MainLayout from '/imports/ui/layout/mainLayout';

//components
import Home from '/imports/ui/components/home';
import ResetPassword from '/imports/ui/components/account/resetPassword';
import MyProfile from '/imports/ui/components/users/myProfile';
import SchoolView from '/imports/ui/components/schoolView';
// import ClaimSchool from '/imports/ui/components/claimSchool';
import SchoolEditView from '/imports/ui/components/schoolView/editSchool';
// import ManageMyCalendar from '/imports/ui/components/users/manageMyCalendar';
// import MyCalender from '/imports/ui/components/users/myCalender';
import SchoolUpload from '/imports/ui/components/schoolUpload';
// import SchoolPriceView from '/imports/ui/components/embed/schoolPriceView';

//pages
import AboutUs from '/imports/ui/pages/aboutUs';
import ContactUs from '/imports/ui/pages/contactUs';

const theme = createMuiTheme({
  palette: {
    primary: green,
  }
});

export default Routes = () => (
  <MuiThemeProvider theme={theme}>
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout} >
        <IndexRoute component={Home} />
        <Route path="/Aboutus" component={AboutUs} />
        <Route path="/Contactus" component={ContactUs} />
      	<Route path="/reset-password/:token" component={ResetPassword}/>
        <Route path="/profile/:id" component={MyProfile} />
        <Route path="/schoolAdmin/:schoolId/edit" component={SchoolEditView} />
        <Route path="/SchoolUpload" component={SchoolUpload} />
        <Route path="/schools/:slug" component={SchoolView} />
      </Route>
    </Router>
  </MuiThemeProvider>  
);
  // <MuiThemeProvider>
  // </MuiThemeProvider>
      // <Route path="/embed/schools/:slug/pricing" component={SchoolPriceView} />
      // <Route path="/embed/schools/:slug/calendar" component={MyCalender} />
        // <Route path="/claimSchool" component={ClaimSchool} />
        // <Route path="/MyCalendar" component={ManageMyCalendar} />
        // <Route path="/schoolAdmin/:schoolId" component={SchoolView} />
