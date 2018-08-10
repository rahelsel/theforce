import isEmpty from "lodash/isEmpty";

import ClassPricing from "./fields";
import ClassType from "/imports/api/classType/fields";
import PriceInfoRequest from "/imports/api/priceInfoRequest/fields";
import School from "/imports/api/school/fields";
import { sendEmailToStudentForPriceInfoUpdate } from "/imports/api/email";



Meteor.methods({
    "classPricing.addClassPricing": function({doc}) {
        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            // console.log("addClassPricing doc-->>",doc);
            if(doc.classTypeId && _.isArray(doc.classTypeId)) {

                ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": doc.cost} }, {multi: true});
            }

            return ClassPricing.insert(doc);

        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.editclassPricing": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            // console.log("editclassPricing doc-->>",doc);
            let classPriceData = ClassPricing.findOne({_id:doc_id});
            let diff = _.difference(classPriceData.classTypeId, doc.classTypeId);

            // console.log("diff-->>",diff);
            if((classPriceData.cost !== doc.cost) || (diff && diff.length > 0)) {

                // console.log("doc.classTypeId-->>",doc.classTypeId);
                if(diff && diff.length > 0) {
                    ClassType.update({ _id: { $in: diff } }, { $set: {"filters.classPriceCost": null} }, {multi: true});
                }

                if(doc.classTypeId && _.isArray(doc.classTypeId) && doc.classTypeId.length > 0) {
                    ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": doc.cost} }, {multi: true});
                }

            }

            return ClassPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.removeClassPricing": function({doc}) {
        const user = Meteor.users.findOne(this.userId);

        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "classPricing_CUD" })) {

            if(doc.classTypeId && _.isArray(doc.classTypeId)) {
                ClassType.update({ _id: { $in: doc.classTypeId } }, { $set: {"filters.classPriceCost": null} }, {multi: true});
            }

            return ClassPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classPricing.notifyStudentForPricingUpdate": function({schoolId}) {
        if(this.userId) {
            const priceInfoRequestData = PriceInfoRequest.find({schoolId,notification: true}).fetch()
            if(!isEmpty(priceInfoRequestData)) {
                for(let obj of priceInfoRequestData) {
                    const userData = Meteor.users.findOne({_id: obj.userId});
                    const schoolData = School.findOne({_id: obj.schoolId})
                    if(userData && schoolData) {
                        PriceInfoRequest.update({ _id: obj._id }, { $set: {notification: false} })
                        sendEmailToStudentForPriceInfoUpdate(userData, schoolData)
                    }
                }
                return {emailSent:true};
            }
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    'classPricing.handleClassTypes':function({ classTypeId, selectedIds, diselectedIds }){
        ClassPricing.update({classTypeId:null},{$set:{classTypeId:[]}})        
    try {
        if (!isEmpty(diselectedIds)) {
            let result = ClassPricing.update({ _id: { $in: diselectedIds } }, { $pop: { classTypeId } }, { multi: true })
        }
        if (!isEmpty(selectedIds)) {
            let result = ClassPricing.update({ _id: { $in: selectedIds } }, { $push: { classTypeId } }, { multi: true })

        }
        return true;
    }
    catch (error) {
        throw new Meteor.Error(error);
    }
}
});