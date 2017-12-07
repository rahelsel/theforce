import MonthlyPricing from "./fields";
import Classes from "/imports/api/classes/fields";

function updateClasses({classTypeId, doc }) {
    if(classTypeId && _.isArray(classTypeId)) {
        const allCost = doc && {
            oneMonCost: doc.oneMonCost && parseInt(doc.oneMonCost),
            threeMonCost: doc.threeMonCost && parseInt(doc.threeMonCost),
            sixMonCost: doc.sixMonCost && parseInt(doc.sixMonCost),
            annualCost: doc.annualCost && parseInt(doc.annualCost),
            lifetimeCost: doc.lifetimeCost && parseInt(doc.lifetimeCost),
        }
        Classes.update({ classTypeId: { $in: classTypeId } }, { $set: {"filters.monthlyPriceCost": allCost} });
    }
    return;
}

Meteor.methods({
    "monthlyPricing.addMonthlyPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.addMonthlyPricing methods called!!!");
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            // doc.remoteIP = this.connection.clientAddress;
            console.log(doc);
            updateClasses({classTypeId: doc.classTypeId, doc});
            return MonthlyPricing.insert(doc);
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.editMonthlyPricing": function(doc_id, doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.editMonthlyPricing methods called!!!",doc_id, doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
       
            let monthlyPriceData = MonthlyPricing.findOne({_id:doc_id});
            let diff = _.difference(monthlyPriceData.classTypeId, doc.classTypeId);
            if(diff && diff.length > 0) {
                updateClasses({classTypeId: diff, doc: null});
            }
            updateClasses({classTypeId: doc.classTypeId, doc});
            return MonthlyPricing.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "monthlyPricing.removeMonthlyPricing": function(doc) {
        const user = Meteor.users.findOne(this.userId);
        // console.log("MonthlyPricing.removeMonthlyPricing methods called!!!",doc);
        if (checkMyAccess({ user, schoolId: doc.schoolId, viewName: "monthlyPricing_CUD" })) {
            updateClasses({classTypeId: doc.classTypeId, doc: null});
            return MonthlyPricing.remove({ _id: doc._id });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
});