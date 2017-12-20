import SkillCategory from "./fields";

Meteor.methods({
    "getSkillCategory": function({textSearch}) {
    	console.log("getSkillCategory called fn",textSearch);
    	// let filter = { $text: { $search: textSearch } }
    	return SkillCategory.find({name: { $regex: new RegExp(textSearch, 'mi') }},{limit: 10}).fetch();
    }
});