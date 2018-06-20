import UserStripeData from "./fields";
Meteor.methods({
  chargeCard: function(stripeToken) {
    var Stripe = StripeAPI(Meteor.settings.stripe.PRIVATE_KEY);
    let stripe_Account_Id = UserStripeData.findOne({
      userId: this.userId
    });
    let account_id = stripe_Account_Id.stripe_user_id;
    console.log("stripe_Account_Id", stripe_Account_Id.stripe_user_id);
    Stripe.charges
      .create(
        {
          amount: 1000,
          currency: "usd",
          source: "tok_visa"
        },
        {
          stripe_account: account_id
        }
      )
      .then(function(charge) {
        // asynchronously called
        console.log("charge------------>", charge);
      });
  },
  getStripeToken: function(code) {
    Meteor.http.call(
      "POST",
      `https://connect.stripe.com/oauth/token?client_secret=${
        Meteor.settings.stripe.PRIVATE_KEY
      }&code=${code}&grant_type=authorization_code`,
      (error, result) => {
        console.log("result--------->", result, this.userId);
        console.log("error--->", error);

        if (result && result.data && result.data.stripe_user_id) {
          let payload = {
            userId: this.userId,
            stripe_user_id: result.data.stripe_user_id,
            stripe_user_refresh_token: result.data.refresh_token
          };
          console.log("payload------------", payload);
          let userData = UserStripeData.findOne({
            stripe_user_id: payload.stripe_user_id
          });
          if (!userData) {
            Meteor.call("addStripeJsonForUser", payload);
          }
        }
      }
    );
  },
  addStripeJsonForUser: function(data) {
    let customer_id = UserStripeData.insert(data);
  }
});
