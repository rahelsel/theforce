import UserStripeData from "./fields";
import School from "../school/fields";
import EnrollmentFees from "../enrollmentFee/fields";
import ClassSubscription from "../classSubscription/fields";
import ClassPricing from "../classPricing/fields";
//chargeCard for  creating charge and purchasing package
//getStripeToken for getting stripe account id
// :":":":":":":"" classtypeids removed 
var stripe = require("stripe")(Meteor.settings.stripe.PRIVATE_KEY);
import { getExpiryDateForPackages } from "/imports/util/expiraryDateCalculate";
Meteor.methods({
  "stripe.chargeCard": async function (
    stripeToken,
    desc,
    packageId,
    packageType,
    schoolId,
    expDuration,
    expPeriod,
    noClasses
  ) {
    let recordId, amount, currency;
    //Get amount and currency from database using package ids
    if (packageType == "EP") {
      let enrollmentData = EnrollmentFees.findOne({ _id: packageId });
      currency = enrollmentData.currency;
      amount = enrollmentData.cost;
    }
    else {
      let classData = ClassPricing.findOne({ _id: packageId })
      currency = classData.currency;
      amount = classData.cost;
    }
    //Get currency name and correct amount using multipleFactor from config
    config.currency.map((data, index) => {
      if (data.value == currency) {
        currency = data.label;
        amount = amount * data.multiplyFactor;
      }
    })
    let userId = this.userId;
    let endDate;
    let startDate;
    let user = Meteor.user();
    try {
      let schoolData = School.findOne({ _id: schoolId });
      let superAdminId = schoolData.superAdmin;
      let stripeAccountId = UserStripeData.findOne({ userId: superAdminId });
      stripeAccountId = stripeAccountId.stripe_user_id;
      const token = stripeToken;
      const skillshapeAmount = Math.round(amount * (2.9 / 100) + 40);
      const destinationAmount = Math.round(amount - skillshapeAmount);
      let stripeRequest = {
        amount: amount,
        currency: currency,
        description: desc,
        source: token,
        destination: {
          amount: destinationAmount,
          account: stripeAccountId
        }
      };

      startDate = getExpiryDateForPackages(new Date());
      endDate = getExpiryDateForPackages(startDate, expPeriod, expDuration);
      let payload = {
        userId: userId,
        stripeRequest: stripeRequest,
        emailId: user.emails[0].address,
        userName: user.profile.firstName || user.profile.name,
        packageName: desc,
        stripeRequest: stripeRequest,
        createdOn: new Date(),
        packageId: packageId,
        packageType: packageType,
        schoolId: schoolId,
        status: "In_Progress",
        startDate: startDate,
        endDate: endDate,
        noOfClasses: noClasses,
        fee: Math.round(amount * (2.9 / 100) + 30)
      };
      recordId = Meteor.call("purchases.addPurchase", payload);
      let charge = await stripe.charges.create(stripeRequest);

      payload = {
        stripeResponse: charge,
        status: "Succeeded"
      };
      let currentUserRec = Meteor.users.findOne(this.userId);
      Meteor.call("purchases.updatePurchases", { payload, recordId });
      let memberData = {
        firstName:
          currentUserRec.profile.name || currentUserRec.profile.firstName,
        lastName: currentUserRec.profile.firstName || "",
        email: currentUserRec.emails[0].address,
        phone: "",
        schoolId: schoolId,
        birthYear: "",
        studentWithoutEmail: false,
        sendMeSkillShapeNotification: true,
        activeUserId: currentUserRec._id,
        createdBy: "",
        inviteAccepted: false
      };
      Meteor.call(
        "schoolMemberDetails.addNewMember",
        memberData,
        (error, result) => {
          let memberId = result;
          Meteor.call(
            "purchases.checkExisitingPackagePurchases",
            userId,
            packageId,
            (error, result) => {
              status = result;
              payload = { memberId: memberId, packageStatus: status };
              Meteor.call("purchases.updatePurchases", { payload, recordId });
            }
          );
        }
      );
      // stripe.balance.retrieve(function(err, balance) {
      // });
      return "Payment Successfully Done";
    } catch (error) {
      payload = {
        stripeResponse: error,
        status: "Error"
      };
      Meteor.call("purchases.updatePurchases", { payload, recordId });
      throw new Meteor.Error(
        (error && error.message) || "Something went wrong!!!"
      );
    }
  },
  "stripe.getStripeToken": function (code) {
    try {
      let result = Meteor.http.call(
        "POST",
        `https://connect.stripe.com/oauth/token?client_secret=${
        Meteor.settings.stripe.PRIVATE_KEY
        }&code=${code}&grant_type=authorization_code`
      );

      let payload = {
        userId: this.userId,
        stripe_user_id: result.data.stripe_user_id,
        stripe_user_refresh_token: result.data.refresh_token
      };

      let userData = UserStripeData.findOne({
        userId: this.userId
      });
      if (!userData) {
        Meteor.call("stripe.addStripeJsonForUser", payload);
        return "Successfully Connected";
      } else {
        return "Your acoount is already connected!!";
      }
    } catch (error) {
      throw new Meteor.Error(
        error.response.statusCode,
        error.response &&
        error.response.data &&
        error.response.data.error_description
      );
    }
  },
  "stripe.addStripeJsonForUser": function (data) {
    let customer_id = UserStripeData.insert(data);
    Meteor.users.update(
      { _id: this.userId },
      { $set: { "profile.stripeStatus": true } }
    );
  },
  "stripe.disconnectStripeUser": function () {
    Meteor.users.update(
      { _id: this.userId },
      { $set: { "profile.stripeStatus": false } }
    );
    UserStripeData.remove({ userId: this.userId });
    return "Successfully Disconnected";
  },
  "stripe.findAdminStripeAccount": function (superAdminId) {
    let result = UserStripeData.findOne({ userId: superAdminId });
    if (result) {
      return true;
    } else {
      return false;
    }
  },
  //creating plan for on monthly package creation
  "stripe.createStripePlan": async function (currencyCode, interval, amount) {
    let productId = Meteor.settings.productId;
    try {
      const plan = await stripe.plans.create({
        product: productId,
        currency: currencyCode, // currency code should be in lower case
        interval: interval,
        amount: amount
      });
      return plan.id;
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
  "stripe.createStripeProduct": function (productId) {
    let existingProduct = stripe.products.retrieve(productId, function (
      err,
      product
    ) {
      // asynchronously called
      if (!product && err && err.message.indexOf("No such product") != -1) {
        //Create a service product
        try {
          const product = stripe.products.create(
            {
              name: "Skillshape Monthly Package Product",
              type: "service",
              id: productId
            },
            function (err, result) {
              if (result && result.id) {
                return result.id;
              } else {
                throw new Meteor.Error(
                  (err && err.message) || "Something went wrong!!!"
                );
              }
            }
          );
        } catch (err) { }
      }
    });
  },
  "stripe.handleCustomerAndSubscribe": async function (
    token,
    planId,
    schoolId,
    packageName,
    packageId,
    monthlyPymtDetails
  ) {
    //customer creation and subscribe if new otherwise straight to subscribe
    let startDate,
      expiryDate,
      subscriptionRequest,
      subscriptionDbId,
      payload,
      subscriptionResponse,
      stripeCusId;
    try {
      let userId = this.userId;
      let currentUserProfile = Meteor.users.findOne({
        _id: userId,
        stripeCusId: { $exists: true }
      });
      //find stripeCusId from users or create a new one and store in the users collection
      if (currentUserProfile) {
        stripeCusId = currentUserProfile.stripeCusId;
      } else {
        let stripeCustomer = await stripe.customers.create({
          description: Meteor.user().emails[0].address,
          source: token
        });
        stripeCusId = stripeCustomer.id;
        Meteor.users.update(
          { _id: userId },
          { $set: { stripeCusId: stripeCusId } }
        );
      }
      startDate = getExpiryDateForPackages(new Date());
      expiryDate = getExpiryDateForPackages(
        startDate,
        "Months",
        monthlyPymtDetails[0].month
      );
      subscriptionRequest = {
        customer: stripeCusId,
        items: [{ plan: planId }]
      };
      payload = {
        userId: userId,
        startDate,
        expiryDate,
        status: "inProgress",
        packageId,
        packageName,
        schoolId,
        subscriptionRequest
      };
      // insert subscription  progress in classSubscription
      subscriptionDbId = ClassSubscription.insert(payload);
      subscriptionResponse = await stripe.subscriptions.create(
        subscriptionRequest
      );
      // get subscription id
      payload = {
        subscriptionId: subscriptionResponse.id,
        subscriptionResponse,
        status: "successful"
      };
      // update subscription id in collection
      ClassSubscription.update({ _id: subscriptionDbId }, { $set: payload });
      return true;
    } catch (error) {
      payload = { subscriptionResponse, status: "error" };
      let resultOfErrorUpdate = ClassSubscription.update(
        { _id: subscriptionDbId },
        { $set: payload }
      );
      throw new Meteor.Error(
        (error && error.message) || "Something went wrong"
      );
    }
  }
});
