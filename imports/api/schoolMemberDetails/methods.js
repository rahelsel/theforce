import SchoolMemberDetails from "./fields";

Meteor.methods({
    "schoolMemberDetails.acceptInvitation": function({ memberId, schoolId, acceptInvite}) {
    	console.log("schoolMemberDetailsData -->>",memberId, schoolId, acceptInvite)
    	let schoolMemberDetailsData = SchoolMemberDetails.findOne({_id: memberId, schoolId: schoolId})
    	console.log("schoolMemberDetailsData -->>",schoolMemberDetailsData, this.userId)
    	if(schoolMemberDetailsData && this.userId === schoolMemberDetailsData.activeUserId) {

    		if(schoolMemberDetailsData.inviteAccepted) {
    			throw new Meteor.Error("You already accepted the Invitation!");
    		} else {
    			return SchoolMemberDetails.update(
    				{_id: memberId, schoolId: schoolId},
    				{
			            $set: {
			                'inviteAccepted': true,
			            }
			        }
    			)
    		}

    	} else {
    		throw new Meteor.Error("Access Denied due to invalid informations!!");
    	}
    },
    "schoolMemberDetails.getAllSchoolMembers": function({ schoolId }) {
        if(schoolId) {
            return SchoolMemberDetails.find({schoolId}).fetch();
        } else {
            throw new Meteor.Error("Unable to get due to invalid informations!!");
        }
    },
    "schoolMemberDetails.editSchoolMemberDetails": function({doc_id, doc}) {
        const user = Meteor.users.findOne(this.userId);
        console.log("EditSchoolMemberDetails -->>",doc)
        const memberData = SchoolMemberDetails.findOne({ _id: doc_id });

        if(doc.classmatesNotes && memberData.classmatesNotes) {
            doc.classmatesNotes = {...memberData.classmatesNotes, ...doc.classmatesNotes}
        }

        return SchoolMemberDetails.update({ _id: doc_id }, { $set: doc });
    },
    "schoolMemberDetails.rejectInvitation": function({ memberId, schoolId}) {
        console.log("schoolMemberDetailsData -->>",memberId, schoolId)
        let schoolMemberDetailsData = SchoolMemberDetails.findOne({_id: memberId, schoolId: schoolId})
        console.log("schoolMemberDetailsData -->>",schoolMemberDetailsData, this.userId)
        if(schoolMemberDetailsData && this.userId === schoolMemberDetailsData.activeUserId) {
            if(schoolMemberDetailsData.inviteAccepted) {
                throw new Meteor.Error("You already accepted the Invitation!");
            } else {
                return SchoolMemberDetails.remove({_id: memberId, schoolId: schoolId});
            }
        } else {
            throw new Meteor.Error("Access Denied due to invalid informations!!");
        }
    },
})
