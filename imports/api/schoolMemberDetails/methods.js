import SchoolMemberDetails from "./fields";
import {get,isArray,isEmpty} from "lodash";
import { sendEmailToStudentForClaimAsMember } from "/imports/api/email";
import School from "/imports/api/school/fields.js";
import { check } from 'meteor/check';

Meteor.methods({
  "schoolMemberDetails.acceptInvitation": function({
    memberId,
    schoolId,
    acceptInvite
  }) {
    check(memberId,String);
    check(schoolId,String);

    let schoolMemberDetailsData = SchoolMemberDetails.findOne({
      _id: memberId,
      schoolId: schoolId
    });
    if (
      schoolMemberDetailsData &&
      this.userId === schoolMemberDetailsData.activeUserId
    ) {
      if (schoolMemberDetailsData.inviteAccepted) {
        throw new Meteor.Error("You already accepted the Invitation!");
      } else {
        return SchoolMemberDetails.update(
          { _id: memberId, schoolId: schoolId },
          {
            $set: {
              inviteAccepted: true
            }
          }
        );
      }
    } else {
      throw new Meteor.Error("You already have a session with another user please logout to accept invitation.");
    }
  },
  "schoolMemberDetails.getAllSchoolMembers": function({ schoolId }) {
    check(schoolId,String);

    if (schoolId) {
      return SchoolMemberDetails.find({ schoolId }).fetch();
    } else {
      throw new Meteor.Error("Unable to get due to invalid informations!!");
    }
  },
  "schoolMemberDetails.editSchoolMemberDetails": function({ doc_id, doc }) {
    check(doc,Object);
    check(doc_id,String);

    const user = Meteor.users.findOne(this.userId);
    const memberData = SchoolMemberDetails.findOne({ _id: doc_id });
    // We are editing a school member without email here so need to check if entered email already exist OR not.
    if (doc && doc.studentWithoutEmail && doc.email) {
      // Check if user OR member is already exist or not.
      const userRecExist = Meteor.users.findOne({
        "emails.address": doc.email
      });
      // Need to update these things in school member so that Admin can not edit the user again. Make sense ?
      doc.studentWithoutEmail = false;
      if (!userRecExist) {
        let newlyCreatedUser;
        doc.sendMeSkillShapeNotification = true;
        doc.name = doc.firstName;
        newlyCreatedUser = Meteor.call("user.createUser", {
          ...doc,
          signUpType: "member-signup"
        });
        doc.activeUserId = newlyCreatedUser.user._id;
      } else {
        // User is already a member in skillshape then need to make them as a School member if they are not member in a Class.
        let filters = { email: doc.email, schoolId: doc.schoolId };
        doc.activeUserId = userRecExist._id;
        if (isArray(doc.classIds)) {
          filters.classIds = { $in: doc.classIds };
        }
        let memberDetail = SchoolMemberDetails.findOne(filters);
        if (memberDetail) {
          throw new Meteor.Error("Member already exist with this Email");
        }
        let fromEmail = "Notices@SkillShape.com";
        let toEmail = get(userRecExist, "emails[0].address");
        let ROOT_URL = `${Meteor.absoluteUrl()}?acceptInvite=${true}&memberId=${doc_id}&schoolId=${
          doc.schoolId
        }`;
        let rejectionUrl = `${Meteor.absoluteUrl()}?rejectInvite=${true}&memberId=${doc_id}&schoolId=${
          doc.schoolId
        }`;
        let schoolData = School.findOne(doc.schoolId);
        sendEmailToStudentForClaimAsMember(
          user,
          schoolData,
          userRecExist,
          "",
          fromEmail,
          toEmail,
          ROOT_URL,
          rejectionUrl
        );
      }
    }

    if (doc.classmatesNotes && memberData.classmatesNotes) {
      doc.classmatesNotes = {
        ...memberData.classmatesNotes,
        ...doc.classmatesNotes
      };
    }

    return SchoolMemberDetails.update({ _id: doc_id }, { $set: doc });
  },
  "schoolMemberDetails.rejectInvitation": function({ memberId, schoolId }) {
    check(memberId,String);
    check(schoolId,String);
    
    let schoolMemberDetailsData = SchoolMemberDetails.findOne({
      _id: memberId,
      schoolId: schoolId
    });
    if (
      schoolMemberDetailsData &&
      this.userId === schoolMemberDetailsData.activeUserId
    ) {
      if (schoolMemberDetailsData.inviteAccepted) {
        throw new Meteor.Error("You already accepted the Invitation!");
      } else {
        return SchoolMemberDetails.remove({
          _id: memberId,
          schoolId: schoolId
        });
      }
    } else {
      throw new Meteor.Error("You already have a session with another user please logout to reject invitation.");
    }
  },
  "schoolMemberDetails.addNewMember": function(memberData) {
    check(memberData,Object);
    let filter = {
      schoolId: memberData.schoolId,
      activeUserId: memberData.activeUserId
    }
    if(memberData.from=="classes"){
      filter.classTypeId= memberData.classTypeId;
      let record = SchoolMemberDetails.findOne(filter);
      if(!record) SchoolMemberDetails.insert(memberData) ;
      return;
    }
    let userData = SchoolMemberDetails.findOne(filter);
    if (userData) {
      if (memberData && memberData.packageDetails) {
        let packageDetails = userData.packageDetails || {};
        memberData.packageDetails = {
          ...packageDetails,
          ...memberData.packageDetails
        };
        SchoolMemberDetails.update(
          {
            schoolId: memberData.schoolId,
            activeUserId: memberData.activeUserId
          },
          { $set: { ...memberData } }
        );
        return userData._id;
      }
    } else {
      return SchoolMemberDetails.insert(memberData);
    }
  }
});
