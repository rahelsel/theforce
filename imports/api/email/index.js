import config from "/imports/config";
import get from "lodash/get";
import ClassType from "/imports/api/classType/fields";
import ClassTimes from "/imports/api/classTimes/fields";
import ClassInterest from "/imports/api/classInterest/fields";
import School from "/imports/api/school/fields";
import EmailSignature from './signature.js';
import { getUserFullName } from '/imports/util/getUserData';



export const sendPackagePurchaseEmail = function({ to, buyer, packageName, schoolAdminName }) {
    Email.send({
        to: config.skillshapeAdminEmail, // Replace value of `to` with Admin email if Admin exists.
        from: config.fromEmailForPurchasePackage,
        subject: "Package Purchase Request Recieved",
        html: `Dear ${schoolAdminName},<br/><b>${buyer}</b> has expressed interest in <b>${packageName}</b> class package.
            <br/><br/>
            <br/><br/>
            ${EmailSignature}`
    });
};

// Send Email to school admin when user wants to join a class.
export const sendJoinClassEmail = function({
    currentUserName,
    schoolAdminName,
    classTypeName,
    classTimeName,
    classLink, // Relevant links for class interests.
    memberLink
}) {
    if (Meteor.isServer) {
        Email.send({
            to: config.skillshapeAdminEmail, // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject: "Join Class Request Recieved",
            html: `Hi ${schoolAdminName}, <br/><b>${currentUserName}</b> has showed interest in joining your class: <b>${classTypeName}</b> , <b>${classTimeName}</b>.
                <br/>You can visit the following link OR links to know more about this request:
                ${classLink ? `<a href=${classLink} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Link to Class</a><br/>` : ""}
                ${memberLink ? `<a href=${memberLink} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Link to Member</a><br/>` : ""}
                <br/><br/>
                <br/><br/>
                ${EmailSignature}`
        });
    }
};

// Send Email to school admin when user claim for a school.
export const sendClaimASchoolEmail = function(
    claimSchoolData,
    ROOT_URL,
    manageBySelfUrl,
    schoolAdminRec,
    school,
    modifyUsersRoles,
    To,
) {
    if (Meteor.isServer) {
        const schoolOwnerName = getUserFullName(schoolAdminRec);
        // console.log("To====>",To)
        if(!To) {
            To = config.skillshapeAdminEmail;
        }
        Email.send({
            to: To, // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject: "Claim A school request received",
            html: `
                    Hi${schoolOwnerName || ""},<br/>
                   <b>${claimSchoolData.userName}</b> has requested permission to manage <b>${school.name}</b>. You are listed as the admin. <br/>Do you approve this?<br/><br/>
                   <div>
                       <a href=${modifyUsersRoles.keepMeSuperAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Yes, make them an Admin, and keep me as SuperAdministrator.</a><br/>
                       <a href=${modifyUsersRoles.makeRequesterSuperAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and keep me as an Administrator.</a><br/>
                       <a href=${modifyUsersRoles.removeMeAsAdmin} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Yes, make them SuperAdministrator and remove me as Administrator.</a><br/>
                       <a href=${manageBySelfUrl} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">No, deny their request.</a><br/>
                       <a href=${ROOT_URL}&approve=true style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">I have no idea what this is about.</a><br/>
                   </div>
                   <br/><br/>
                   <br/><br/>
                   ${EmailSignature}`
        });
    }
};
// Send Confirmation email to Member who do claim request for school.
export const sendConfirmationEmail = function(userRec, school) {
    if (Meteor.isServer) {
        Email.send({
            to: config.skillshapeAdminEmail, // Replace value of `to` with Admin email if Admin exists.
            from: config.fromEmailForJoiningClass,
            subject:
                "Confirmation regarding your school claim request received",
            html: `Hi ${(userRec && userRec.profile.firstName) || ""},<br/>
                We have sent your request to the email on file for ${school.name}. We will resolve this as soon as possible.
                <br/><br/>
                <br/><br/>
                ${EmailSignature}`
        });
    }
};

export const sendClassTimesRequest = function({
    currentUserData,
    schoolOwnerData,
    superAdminData,
    schoolId,
    classTypeName
}) {
    let emailObj = {};
    if (schoolOwnerData && currentUserData) {
        const schoolOwnerName = getUserFullName(schoolOwnerData);
        const userName = getUserFullName(currentUserData);
        emailObj.to = schoolOwnerData.emails[0].address;
        emailObj.subject = "Class Interest";
        emailObj.text = `Hi ${schoolOwnerName}, \n${userName} is interested in learning more about your ${classTypeName} class. \nPlease click this link to update your listing: \n${Meteor.absoluteUrl(
            `SchoolAdmin/${schoolId}/edit`
        )} \n\nThanks, \n\n${EmailSignature}`;
    } else {
        emailObj.to = superAdminData.emails[0].address;
        const schoolData = School.findOne({_id:schoolId});
        (emailObj.subject = "School Admin not found"),
            (emailObj.text = `Hi SuperAdmin, \nCorresponding to this school ${schoolData.name} there is no admin assign yet \n\nThanks, \n\n${EmailSignature}`);
    }
    if (Meteor.isServer) {
        Email.send({
            to: config.skillshapeAdminEmail, //emailObj.to
            from: "Notices@SkillShape.com",
            replyTo: "Notices@SkillShape.com",
            subject: emailObj.subject,
            html: emailObj.text
        });
    }
};

export const sendEmailToStudentForClassTypeUpdation = function(
    userData,
    schoolData,
    classTypeName
) {
    if (Meteor.isServer) {
        const userName = getUserFullName(userData);
        Email.send({
            to: config.skillshapeAdminEmail,//userData.emails[0].address
            from: "Notices@SkillShape.com",
            subject: "School Updated",
            html: `${userName}, <br/>${schoolData.name} has updated their listing for ${classTypeName}. Please go to <br/> ${Meteor.absoluteUrl(
                `schools/${schoolData.slug}`
            )} to view their new information and join the class! <br/><br/>Thanks, <br/><br/>${EmailSignature}`
        });
    }
};

// This function is used to send user registration email and email verification link together.
export const userRegistrationAndVerifyEmail = function(
    user,
    verificationToken,
    passwd,
    fromEmail,
    toEmail
) {
    Email.send({
        from: fromEmail,
        to: config.skillshapeAdminEmail,
        replyTo: fromEmail,
        subject: "skillshape Registration",
        html: `Hi ${user.profile.name},
            <br/><br/>
                Your Email: ${user.emails[0].address} has been registered.
            <br/>
                Please click on the button below to verify your email address and set your password.
            <br/><br/>
            <div>
               <a href=${verificationToken} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Set Password</a>
            </div>
            <br/><br/>
                If the link doesn't work, copy and paste this address into your browser.
            <br/>
                ${verificationToken}
            <br/>
                Your temporary password is  : ${passwd}
            <br/>
            <br/><br/>Thanks, <br/><br/>${EmailSignature}`
    });
};


export const sendPriceInfoRequestEmail = function({
    toEmail,
    fromEmail,
    schoolPageLink,
    updatePriceLink,
    memberLink,
    ownerName,
    classTypeName,
    currentUserName
}) {
    if (Meteor.isServer) {
        Email.send({
            to: toEmail, //emailObj.to
            from: fromEmail,
            replyTo: "Notices@SkillShape.com",
            subject: "Pricing info request received",
            html: `Dear ${ownerName}, <br />${currentUserName} ${memberLink || ''} saw your listing on SkillShape.com for ${classTypeName} at <br />${schoolPageLink} <br /> and would you like to update your pricing <br />${updatePriceLink}
            <br />
            <br />
            Thanks,
            <br />
            <br />
            ${EmailSignature}`
            // html: `Hi ${ownerName}, \n${currentUserName} is interested in learning more about your prices. \nPlease click this link to update your listing: \n${updatePriceLink}
            // \n\nThanks, \n\n${EmailSignature}`
        });
    }
};

export const sendEmailForSubscription = function({
  toEmail,
  fromEmail,
  subject,
  updateFor,
  currentUserName,
  unsubscribeLink,
  joinSkillShapeLink,
}) {
  if (Meteor.isServer) {
      Email.send({
          to: toEmail, //emailObj.to
          from: fromEmail,
          replyTo: "Notices@SkillShape.com",
          subject: subject,
          html: `Dear ${currentUserName},<br /> You have joined the SkillShape list in order to get updates for ${updateFor}.
          <br />If you don't remember signing up, click here:
          <br />${unsubscribeLink}
          <br />
          <br />
          If you want to join SkillShape to register for classes, manage your media, and connect with other members. (FREE membership!), click here:
          <br />${joinSkillShapeLink}
          <br />
          <br />Thanks,
          <br />
          <br />
          ${EmailSignature}`
      });
  }
};

export const sendEmailToStudentForPriceInfoUpdate = function(
    userData,
    schoolData
) {
    if (Meteor.isServer) {
        const userName = getUserFullName(userData);
        Email.send({
            to: "sam@skillshape.com", // Needs to replace this with requester's Email.
            from: "Notices@SkillShape.com",
            subject: "School has updated pricing info",
            html: `Hi ${userName}, \n${schoolData.name} has updated their prices. Please go to \n ${Meteor.absoluteUrl(
                `SchoolAdmin/${schoolData._id}/edit`)} to view their new information! \n\nThanks, \n\n${EmailSignature}`
        });
    }
};


export const sendEmailToStudentForClaimAsMember = function(
    currentUserData,
    schoolData,
    user,
    passwd,
    fromEmail,
    toEmail,
    ROOT_URL,
    rejectionUrl
) {
    if (Meteor.isServer) {
        const adminName =  getUserFullName(currentUserData);
        const userName =  getUserFullName(user);
        Email.send({
            to: toEmail,
            from: fromEmail,
            subject: "School member invitation received",
            html: `Hi ${userName},<br/>
            ${adminName} from ${schoolData.name}  has invited you to claim your account on SkillShape.com
            <div>
               Click <b>Claim your account</b> to accept the invitation :<br/>
               <a href=${ROOT_URL} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50; color: white; text-decoration: none;">Claim your account</a><br/>
               ${rejectionUrl  ? `If this is a mistake, click here to reject the invitation :<a href=${rejectionUrl} style="display: block; width: 224px; text-align: center; padding: .7em;font-size: 16px; font-family: 'Zilla Slab', serif; margin-right: 8px;background-color: #4caf50;color: white; text-decoration: none;">Reject the invitation</a><br/>` :""}
            </div>
            ${passwd ? `Your temporary password is  : ${passwd} You will be asked to make your own when you click the link above.`: ''}
             \n\nThanks, \n\n${EmailSignature}`
        });
    }
};


export const sendClassTypeLocationRequestEmail = function({
    toEmail,
    fromEmail,
    updatePriceLink,
    ownerName,
    currentUserName
}) {
    if (Meteor.isServer) {
        Email.send({
            to: 'rajat.rastogi@daffodilsw.com', //emailObj.to
            from: fromEmail,
            replyTo: "Notices@SkillShape.com",
            subject: "Class Type location request received",
            html: `Hi ${ownerName}, \n${currentUserName} is interested in learning more about your prices. \nPlease click this link to update your listing: \n${updatePriceLink}
            \n\nThanks, \n\n${EmailSignature}`
        });
    }
};

export const sendEmailToSchool = function(message,studentName,contactName,schoolData,subject,yourEmail, yourName) {
    if (Meteor.isServer) {
        Email.send({
            to: "sam@skillshape.com", // Needs to replace this with requester's Email.
            from: "Notices@SkillShape.com",
            subject: subject,
            html: `Hi, ${contactName}<br/>
                   ${yourEmail ? `User Email: ${yourEmail}<br/>`: ""}
                   ${yourName ? `User Name:${yourName}<br/>`: ""}
                   ${studentName} saw your listing on SkillShape.com ${Meteor.absoluteUrl(
                   `schools/${schoolData.slug}`)} and has the following message for you:
                   <br/> ${message} <br/>Thanks, <br/>${EmailSignature}`
        });
    }
}
