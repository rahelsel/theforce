import React from 'react';
import { get } from 'lodash';
import { ContainerLoader } from '/imports/ui/loading/container';
import SelectArrayInput from '/imports/startup/client/material-ui-chip-input/selectArrayInput';
import { withStyles } from '/imports/util';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import ConfirmationModal from '/imports/ui/modal/confirmationModal';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withMobileDialog,
} from 'material-ui/Dialog';
import { FormControl } from 'material-ui/Form';
import '/imports/api/classPricing/methods';

const formId = "ClassPriceForm";

const styles = theme => {
    return {
        button: {
          margin: 5,
          width: 150
        }
    }
}

class ClassPriceForm extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            isBusy: false,
            pymtType: get(this.props, 'data.pymtType', ''),
            selectedClassType: get(this.props, 'data.selectedClassType', null),
            expPeriod: get(this.props, 'data.expPeriod', ""),
        }
    }

    handleClassTypeInputChange = (value) => {
        console.log("ClassPriceForm handleClassTypeInputChange -->>",value)
        Meteor.call("classType.getClassTypeByTextSearch",{schoolId:this.props.schoolId, textSearch: value}, (err,res) => {
            console.log("ClassPriceForm classType.getClassTypeByTextSearch res -->>",res)
            this.setState({
                classTypeData: res || [],
            })
        })
    }

    onClassTypeChange = (values)=> {
        console.log("ClassPriceForm onClassTypeChange values-->>",values)
        this.setState({selectedClassType: values})
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { selectedClassType, expPeriod } = this.state;
        const { data, schoolId } = this.props;
        const payload = {
            schoolId: schoolId,
            packageName: this.packageName.value,
            classTypeId: selectedClassType && selectedClassType.map(data => data._id),
            expDuration: this.expDuration.value && parseInt(this.expDuration.value),
            expPeriod: expPeriod,
            noClasses: this.noClasses.value && parseInt(this.noClasses.value),
            cost: this.classPriceCost.value && parseInt(this.classPriceCost.value),

        }
        this.setState({isBusy: true});
        if(data && data._id) {
            this.handleSubmit({ methodName: "classPricing.editclassPricing", doc: payload, doc_id: data._id})
        } else {
            this.handleSubmit({ methodName: "classPricing.addClassPricing", doc: payload })
        }
    }

    handleSubmit = ({methodName, doc, doc_id})=> {
        console.log("handleSubmit methodName-->>",methodName)
        console.log("handleSubmit doc-->>",doc)
        console.log("handleSubmit doc_id-->>",doc_id)
        Meteor.call(methodName, { doc, doc_id }, (error, result) => {
            if (error) {
              console.error("error", error);
            }
            if (result) {
                this.props.onClose()
            }
            this.setState({isBusy: false, error});
        });
    }

    cancelConfirmationModal = ()=> this.setState({showConfirmationModal: false})

	render() {
		const { fullScreen, data } = this.props;
        const { classTypeData } = this.state;

		return (
			<Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
                fullScreen={fullScreen}
            >
            	<DialogTitle id="form-dialog-title">Add Class Package</DialogTitle>
            	{ 
                    this.state.showConfirmationModal && <ConfirmationModal
                        open={this.state.showConfirmationModal}
                        submitBtnLabel="Yes, Delete"
                        cancelBtnLabel="Cancel"
                        message="You will delete this Per Class Package, Are you sure?"
                        onSubmit={() => this.handleSubmit({ methodName: "classPricing.removeClassPricing", doc: data})}
                        onClose={this.cancelConfirmationModal}
                    />
                }
                { this.state.isBusy && <ContainerLoader/>}
            	{ 
                    this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : (
                        <DialogContent>
                            <form id={formId} onSubmit={this.onSubmit}>
                                <TextField
                                    required={true}
                                    defaultValue={data && data.packageName}
                                    margin="dense"
                                    inputRef={(ref)=> this.packageName = ref}
                                    label="Class Package Name"
                                    type="text"
                                    fullWidth
                                />
                                <SelectArrayInput
                                    disabled={false}
                                    floatingLabelText="Class Type"  
                                    optionValue="_id" 
                                    optionText="name" 
                                    input={{ value: this.state.selectedClassType ,onChange: this.onClassTypeChange}} 
                                    onChange={this.onClassTypeChange} 
                                    setFilter={this.handleClassTypeInputChange}
                                    dataSourceConfig={{ text: 'name', value: '_id' }} 
                                    choices={classTypeData} 
                                />
                                <Grid container>
                                    <Grid  item xs={12} sm={6}>
                                        <TextField
                                            required={true}
                                            defaultValue={data && data.expDuration}
                                            margin="dense"
                                            inputRef={(ref)=> this.expDuration = ref}
                                            type="number"
                                            label="Expiration Duration"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid  item xs={12} sm={6}>
                                        <FormControl fullWidth margin='dense'>
                                            <InputLabel htmlFor="expiration-period">Expiration Period</InputLabel>
                                            <Select
                                                required={true}
                                                input={<Input id="expiration-period" />}
                                                value={this.state.expPeriod}
                                                onChange={(event) => this.setState({ expPeriod: event.target.value })}
                                                fullWidth
                                            >
                                                <MenuItem value={"Days"}>Days</MenuItem>
                                                <MenuItem value={"Month"}>Month</MenuItem>
                                                <MenuItem value={"Year"}>Year</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <TextField
                                    required={true}
                                    defaultValue={data && data.noClasses}
                                    margin="dense"
                                    inputRef={(ref)=> this.noClasses = ref}
                                    label="Number of Classes"
                                    type="number"
                                    fullWidth
                                />
                                <TextField
                                    required={true}
                                    defaultValue={data && data.cost}
                                    margin="dense"
                                    inputRef={(ref)=> this.classPriceCost = ref}
                                    label="Cost"
                                    type="number"
                                    fullWidth
                                />
                            </form>
                        </DialogContent>
                    )
                }
                <DialogActions>
                    {
                        data && (
                            <Button onClick={() => this.setState({showConfirmationModal: true})} color="accent">
                                Delete
                            </Button>
                        )
                    }
                    <Button onClick={() => this.props.onClose()} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" form={formId} color="primary">
                      { data ? "Save" : "Submit" } 
                    </Button>
                </DialogActions>
            </Dialog>
		)
	}
}

export default withStyles(styles)(withMobileDialog()(ClassPriceForm));