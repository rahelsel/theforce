import React from 'react';
import SchoolDetailsRender from './schoolDetailsRender';
import styles from "/imports/ui/components/schoolView/style";
import { withStyles, toastrModal } from "/imports/util";

class SchoolDetails extends React.Component {

  constructor(props) {
    super(props);
    let { schoolData } = this.props;
    let {
      name,
      website,
      phone,
      firstName,
      lastName,
      email,
      backGroundVideoUrl,
      mainImage,
      aboutHtml,
      studentNotesHtml,
      currency,
    } = schoolData;

    this.state = {
      aboutHtml: aboutHtml || "",
      studentNotesHtml: studentNotesHtml || "",
      name: name || "",
      website: website || "",
      phone: phone,
      firstName: firstName || "",
      lastName: lastName || "",
      email: email,
      backGroundVideoUrl: backGroundVideoUrl || "",
      mainImage: schoolData.mainImage || "",
      isLoading:false, // Loading variable in state.
      currency: currency || "",
      previousSelectedCurrency: currency || ""
    };
  }

  componentDidMount() {
    // $('#summernote1').summernote();
    // $('#summernote2').summernote();
  }

  updateSchool = () => {
    let imageFile = this.refs.schoolImage.files[0];
    debugger;
    if(imageFile) {
      S3.upload({ files: { "0": imageFile}, path: "schools"}, (err, res) => {
        if(err) {
        }
        if(res) {
          this.editSchoolCall(res)
        }
      })
    } else {
      this.editSchoolCall()
    }
  }

  editSchoolCall = (nextTab, event) => {
    // Start loading on when user press button to update school details.
    debugger;
    this.setState({isLoading: true});
    const { schoolId,toastr } = this.props;

    let schoolObj = {...this.state}
    if(this.props.schoolData && this.props.schoolData.mainImage) {
      schoolObj['mainImage'] = this.props.schoolData && this.props.schoolData.mainImage;
    }
    // This function is used to edit school details.
    Meteor.call("editSchool", schoolId, schoolObj, (error, result) => {
      if (error) {
        toastr.error("Oops! something went wrong.",error.message);
      }
      if (result) {
          toastr.success("School details editing successful.","Success");
      }
      // Stop loading on completion of editing school details.
      this.setState({isLoading: false});
      if(nextTab) {
        this.props.moveToNextTab(1);
      }
    });
  }

  onAddMedia = ()=> {

  }

  closeMediaUpload = ()=> {

  }

  onEditMedia = ()=> {

  }
  // This is used to set Content into `About School` editor.
  aboutSchoolTREOnChange = (value)=> {
    this.setState({ aboutHtml: value })
  }
  // This is used to set Content into `Notes for Students` editor.
  studentNotesTREOnChange = (value)=> {
    this.setState({ studentNotesHtml: value })
  }

  render() {
    return SchoolDetailsRender.call(this, this.props, this.state)
  }
}

export default withStyles(styles)(toastrModal(SchoolDetails))