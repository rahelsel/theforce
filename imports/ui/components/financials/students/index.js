import React, { Fragment } from "react";
import Pagination from "/imports/ui/componentHelpers/pagination";
import { StudentsDetailsTable } from "./studentsDetailsTable";
import { TableRow, TableCell } from "material-ui/Table";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { createContainer } from "meteor/react-meteor-data";
import Purchases from "/imports/api/purchases/fields";
const style = {
  w211: {
    width: 211
  },
  w100: {
    width: 100
  },
  w150: {
    width: 150
  }
};
class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PurchaseData: []
    };
  }
  componentWillMount() {
    console.log("this.props in payout", this.props);

    // Meteor.call("getAllPurchaseData", this.props.params.slug, (err, res) => {
    //   console.log("------------->AllPurchaseData<---------", res);
    //   this.setState({ PurchaseData: res });
    // });
  }
  handlePageClick = ({ skip }) => {
    console.log("skip -->>", skip);
    this.setState({ isBusy: true });
    this.getUsers({ limit: this.state.perPage, skip: skip });
  };

  render() {
    const { purchaseData } = this.props;
    console.log("PurchaseData in students--->", this.props);
    return (
      <div>
        <h1>Payouts</h1>
        <StudentsDetailsTable>
          {isEmpty(purchaseData)
            ? "No payout found"
            : purchaseData.map(purchase => {
                return (
                  <Fragment>
                    <TableRow key={purchase._id} selectable={false}>
                      <TableCell style={style.w150}>
                        {purchase.profile.emails[0].address}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {purchase.profile.profile.name}
                      </TableCell>
                      <TableCell style={style.w150}>
                        {moment(purchase.createdOn).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              })}
        </StudentsDetailsTable>
      </div>
    );
  }
}
export default createContainer(props => {
  console.log("payout props----->", props);
  let purchaseSubscription = Meteor.subscribe(
    "getAllPurchaseData",
    props.params.slug,
    "student"
  );
  // let purchaseData = [];
  // if (purchaseSubscription.ready()) {
  let purchaseData = Purchases.find().fetch();
  console.log("in createcontainer", purchaseData);
  // }

  return {
    purchaseData,
    props
  };
}, Students);
