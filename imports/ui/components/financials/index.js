import get from 'lodash/get';
import includes from 'lodash/includes';
import React from "react";
import DocumentTitle from "react-document-title";
import Payouts from "./payouts";
import Settings from "./settings";
import Students from "./students";
import Transactions from "./transactions";
import ResponsiveTabs from "/imports/util/responsiveTabs";
export default class Financials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selecetdView: "Settings",
      queryTabValue: null,
      tabValue: 0,
      adminPermission: false,
      filter: {
        limit: 10,
        skip: 0
      },
      pageCount: 0,
      totalCount: 0,
      perPage: 10
    };
  }

  changePageHandler = skip => {
    let oldFilter = { ...this.state.filter };
    oldFilter.skip = skip.skip;
    this.setState({ filter: oldFilter });
  };
  onTabChange = tabValue => {
    this.setState({ tabValue });
  };
  componentWillMount() {
    
    Meteor.call(
      "school.findSuperAdmin",
      this.props.slug,
      (error, result) => {
        if(result){
          if(get(result,'superAdmin',null) == this.props.currentUser._id || includes(get(result,'admins',[]),this.props.currentUser._id )){
            this.setState({adminPermission:true,schoolData:result})
          }
        }
      }
    );

    Meteor.call("purchases.purchasePageCount", (error, result) => {
      this.setState({
        pageCount: Math.ceil(result / this.state.perPage)
      });
    });
  }

  render() {
    let { currentUser } = this.props;
    const role = currentUser && _.indexOf(currentUser.roles, "Superadmin");
    const {schoolData} = this.state;
    return (
      <DocumentTitle title="Financials">
        {(Meteor.settings.public.paymentEnabled &&
          this.state.adminPermission) ||
        role != -1 ? (
          <div>
            <ResponsiveTabs
              tabs={["Students", "Payouts", "Transactions", "Settings"]}
              color="primary"
              onTabChange={this.onTabChange}
              tabValue={this.state.tabValue}
              queryTabValue={this.state.queryTabValue}
              page="Financials"
            />
            <div>
              {this.state.tabValue === 0 && (
                <Students
                  {...this.props}
                  filters={this.state.filter}
                  ChangePageClick={this.changePageHandler}
                  pageCount={this.state.pageCount}
                />
              )}
              {this.state.tabValue === 1 && (
                <Payouts
                  {...this.props}
                  filters={this.state.filter}
                  ChangePageClick={this.changePageHandler}
                  pageCount={this.state.pageCount}
                />
              )}
              {this.state.tabValue === 2 && (
                <Transactions
                  {...this.props}
                  filters={this.state.filter}
                  ChangePageClick={this.changePageHandler}
                  pageCount={this.state.pageCount}
                />
              )}
              {this.state.tabValue === 3 && (
                <Settings
                  {...this.props}
                  adminPermission={this.state.adminPermission}
                  schoolData = {schoolData}
                />
              )}
            </div>
          </div>
        ) : (
          <center>
            <div>
              <h1>Access Denied</h1>
            </div>
          </center>
        )}
      </DocumentTitle>
    );
  }
}
