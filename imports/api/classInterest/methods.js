import ClassInterest from "./fields";
import { sendJoinClassEmail } from "/imports/api/email";
import { getUserFullName } from "/imports/util/getUserData";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import School from "/imports/api/school/fields";
import SchoolMemberDetails from "/imports/api/schoolMemberDetails/fields";
import { check } from 'meteor/check';

Meteor.methods({
  "classInterest.addClassInterest": function({ doc }) {
    check(doc,Object);
    doc.createdAt = new Date();
    if (this.userId && this.userId == doc.userId) {
      return ClassInterest.insert(doc, () => {
        let currentUserRec = Meteor.users.findOne(this.userId);
        let classTypeData = ClassType.findOne(doc.classTypeId);
        let classTimes = ClassTimes.findOne(doc.classTimeId);
        let schoolData = School.findOne(classTypeData.schoolId);
        let schoolAdminRec = Meteor.users.findOne(schoolData.superAdmin);
        const currentUserName = getUserFullName(currentUserRec);
        const schoolAdminName = getUserFullName(schoolAdminRec);
        // Use `encodeURIComponent()` to encode spaces in class type name.
        let classTypeName = encodeURIComponent(
          classTypeData.name
        ) /* classTypeData.name.split(' ').join('_')*/;
        let classLink = `${Meteor.absoluteUrl()}classType/${classTypeName}/${
          classTypeData._id
        }`;
        let schoolMemberData = SchoolMemberDetails.findOne({
          activeUserId: this.userId
        });
        let memberLink;
        if (schoolMemberData) {
          memberLink = `${Meteor.absoluteUrl()}schools/${
            schoolData.slug
          }/members`;
        }
        sendJoinClassEmail({
          currentUserName,
          schoolAdminName,
          classTypeName: classTypeData.name,
          classTimeName: classTimes.name,
          classLink,
          memberLink
        });
      });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.editClassInterest": function({ doc_id, doc }) {
    check(doc,Object);
    check(doc_id,String);
    if (this.userId === doc.userId) {
      return ClassInterest.update({ _id: doc_id }, { $set: doc });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.removeClassInterest": function({ doc }) {
    check(doc,Object);
    if (this.userId) {
      return ClassInterest.remove({ _id: doc._id, userId: this.userId });
    } else {
      throw new Meteor.Error("Permission denied!!");
    }
  },
  "classInterest.removeClassInterestByClassTimeId": function({ classTimeId }) {
    check(classTimeId,String);
    // console.log("classInterest.removeClassInterestByClassTimeId -->>",classTimeId)
    if (this.userId && classTimeId) {
      return ClassInterest.remove({ userId: this.userId, classTimeId });
    } else {
      throw new Meteor.Error(
        "Unable to delete due to insufficient information!!"
      );
    }
  },
  "classInterest.deleteEventFromMyCalendar": function(
    classTimeId,
    clickedDate
  ) {
    check(classTimeId,String);
    let result = ClassInterest.update(
      { classTimeId: classTimeId, userId: this.userId },
      { $push: { deletedEvents: clickedDate } }
    );
  }
});
