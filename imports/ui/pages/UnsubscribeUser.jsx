import React from 'react';
import {browserHistory} from 'react-router';
import queryString from 'query-string';
import styled from 'styled-components'

import ManageUnsubscribeDialogBox from "/imports/ui/components/landing/components/dialogs/ManageUnsubscriptionDialogBox.jsx";

const redirectUser = () => browserHistory.push('/');

const UnsubscribeUser = (props) => {
    console.log("props for the unsubscribe dialog box...");
    const {pricingRequest, classTimesRequest, requestId} = queryString.parse(props.location.search);
    return(<div>
        <ManageUnsubscribeDialogBox
          onModalClose={redirectUser}
          open={true}
          onToastrClose={redirectUser}
          requestId={requestId}
          requestFor={pricingRequest ? 'pricing details' : 'class times'}
          />
      </div>);
}

export default UnsubscribeUser;
