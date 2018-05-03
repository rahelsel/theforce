import PricingRequest,{PricingRequestSchema} from './fields.js';

Meteor.methods({
  'pricingRequest.addRequest': function(data) {
    const validationContext = PricingRequestSchema.newContext();
    const isValid = validationContext.validate(data);

    if(this.userId) {
      data.existingUser = true;
      data.userId = this.userId;
      data.email = Meteor.users.findOne({_id: this.userId}).emails[0].address;
    }else {
      data.existingUser = false;
    }

    if(isValid) {
      // console.log('adding price request..');
      const pricingRequestAlreadyPresent = PricingRequest.find({email: data.email}).fetch()[0];
      if(pricingRequestAlreadyPresent) {
        return {
          message: 'Already requested for price with this email address'
        }
      }else {
        return PricingRequest.insert(data);
      }
    }else {
      // Return the errors in case something is invalid.
      const invalidData = validationContext.invalidKeys()[0];
      console.log("validation errors...",validationContext.invalidKeys());
      throw new Meteor.Error(invalidData.name +' is '+ invalidData.value);
    }
  }
})
