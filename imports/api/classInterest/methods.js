import ClassInterest from "./fields";
import {sendJoinClassEmail} from "/imports/api/email";


Meteor.methods({
    "classInterest.addClassInterest": function({doc}) {
        doc.createdAt = new Date();
        return ClassInterest.insert(doc,()=> {
            sendJoinClassEmail({classTypeData:doc});
        });
    },
    "classInterest.editClassInterest": function({doc_id, doc}) {
        if (this.userId === doc.userId) {
            return ClassInterest.update({ _id: doc_id }, { $set: doc });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classInterest.removeClassInterest": function({doc}) {
        if (this.userId) {
            return ClassInterest.remove({ _id: doc._id, userId: this.userId });
        } else {
            throw new Meteor.Error("Permission denied!!");
        }
    },
    "classInterest.removeClassInterestByClassTimeId": function({classTimeId}) {
        console.log("classInterest.removeClassInterestByClassTimeId -->>",classTimeId)
        if (this.userId && classTimeId) {
            return ClassInterest.remove({ userId: this.userId, classTimeId });
        } else {
            throw new Meteor.Error("Unable to delete due to insufficient information!!");
        }
    },
});