import config from "/imports/config";
import SkillCategory from "/imports/api/skillCategory/fields";
import SkillSubject from "/imports/api/skillSubject/fields";

const ClassType = new Mongo.Collection(config.collections.classType);
/**
 * Create the schema
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
 */
ClassType.attachSchema(new SimpleSchema({
    createdBy: {
        type: String,
        optional: true
    },
    schoolId: {
        type: String,
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    desc: {
        type: String,
        optional: true
    },
    skillTypeId: {
        type: String,
        optional: true
    },
    classTypeImg: {
        type: String,
        optional: true
    },
    classes: {
        type: [String],
        optional: true
    },
    gender: {
        type:String,
        optional:true
    },
    ageMin : {
        type:String,
        optional:true
    },
    ageMax : {
        type:String,
        optional:true
    },
    experienceLevel : {
        type:String,
        optional:true
    },
    skillCategoryId: {
       type:String,
       optional:true 
    },
    skillSubject: {
       type: [String],
       optional:true 
    },
    filters: {
        type: Object,
        optional: true
    },
    "filters.classPriceCost": {
        type: Number,
        optional: true
    },
    "filters.monthlyPriceCost": {
        type: Object,
        optional: true,
        blackbox: true
    },
    "filters.location": {
        type: [Number], 
        optional: true,
        decimal: true
    },
    "filters.schoolName": {
        type: String,
        optional: true,
    }
}));

ClassType.join(SkillCategory, "skillCategoryId", "skillCategory", ["name"]);

// ClassType.join(SkillSubject, "skillSubject", "subject", []);

Meteor.startup(function() {
    if (Meteor.isServer) {
        ClassType._ensureIndex({ name:"text",desc:"text" });
    }
});

export default ClassType;