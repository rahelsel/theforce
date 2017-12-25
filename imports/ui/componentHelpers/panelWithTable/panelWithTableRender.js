import React from "react";
import methods from '/imports/ui/modal/formBuilderMethods';
import ChildTable from './childTable';
import {cutString} from '/imports/util';
import classnames from 'classnames';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import red from 'material-ui/colors/red';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import MoreVertIcon from 'material-ui-icons/MoreVert';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Assignment from 'material-ui-icons/Assignment';
import Add from 'material-ui-icons/Add';
import Edit from 'material-ui-icons/Edit';
import Delete from 'material-ui-icons/Delete';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions,
} from 'material-ui/ExpansionPanel';
// import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';

export default function () {

	const { classes, className, settings, mainTableData, schoolId } = this.props;
	const AddForm = settings.mainPanelHeader.actions.component;
	const EditForm = settings.mainTable.actions.edit.component;
	console.log("Panel with table props -->>",this.props);
	console.log("Panel with table state -->>",this.state);
	return (
		<div className={`${className} panel-table`}>
          	{
          		this.state.showAddForm && <AddForm schoolId={schoolId} open={this.state.showAddForm} onClose={this.handleAddFormModal}/>	
          	}
          	{
          		this.state.showEditForm && <EditForm schoolId={schoolId} open={this.state.showEditForm} onClose={this.handleEditFormModal}/>
          	}
          	<Paper elevation={4}>
	            <Grid container className={classes.classtypeHeader}>
	              	<Grid  item sm={2} xs={12} style={{display: 'inline-flex',alignItems: 'center'}}>
	                	<span> <Assignment style={{marginRight: 5}}/>  </span> <span>{settings.mainPanelHeader.title}</span>
	              	</Grid>
	              	<Grid item sm={7} xs={12}>
		                <Typography type="caption" >
		                	{settings.mainPanelHeader.notes}
		                </Typography>
	            	</Grid>
	              	<Grid style={{display: 'inline-flex',alignItems: 'center',justifyContent: 'center'}} item sm={3} xs={12}>
		                <Button onClick={() => this.setState({showAddForm: true})} color="primary" raised dense>
		                  <Add style = {{marginRight: 2}} />
		                  	{settings.mainPanelHeader.actions.buttonTitle}
		                </Button>
	                </Grid>
	            </Grid>
          	</Paper>
          	{
          		_.isArray(mainTableData) &&  mainTableData.map((tableData, index) => {
          			// console.log("tableData -->>",tableData);
					let childTableData = this.props.getChildTableData && this.props.getChildTableData(tableData);
          			// console.log("childTableData -->>",childTableData);
          			return (
          				<ExpansionPanel key={index}>
	          				<ExpansionPanelSummary color="primary" expandIcon={<ExpandMoreIcon />} >
	              
	              				<div style={{marginLeft: 15}}>
	                				<Typography className={classes.secondaryHeading}>{tableData[settings.mainPanelHeader.titleKey]}</Typography>
	              				</div>
	            			</ExpansionPanelSummary>
	            			<ExpansionPanelDetails className={classes.details}>
	            				<Grid container>
	            					<Grid  item md={settings.mainPanelHeader.havingImage ? 7 : 12} sm={12} xs={12}>
	            						<div className={classes.classtypeForm}>
	            							{
	            								settings.mainTable && settings.mainTable.tableFields.map((field, index) => {
			            							// console.log("Field Name -->>",field);
			            							return (
			            								<Grid key={index} container className={classes.classtypeInputContainer}>
												            <Grid item xs={12} sm={3}>
												                <div> {field.label} </div>
												            </Grid>
												            <Grid item xs={12} sm={9}>
												                <div className={classes.inputDisableBox}> <span>{tableData[field.key]}</span> </div>
												            </Grid>
												        </Grid>
	            									)
	            								})
	            							}
		            						<Grid  item xs={12} sm={12} style={{textAlign: 'right'}}>
			            						<Button onClick={() => this.setState({showEditForm: true})} color="primary" raised dense>
						                        <Edit style = {{marginRight: 2}} />
						                        	{ settings.mainTable.actions.edit.title }
						                        </Button>
						                    </Grid>    
	            						</div>
	            					</Grid>
		            				{
		            					settings.childTable && <Grid className={classes.classtypeInputContainer} item md={7} sm={12} xs={12}>
							                <ChildTable 
							                	childTable={settings.childTable}
							                	childTableData={childTableData}
							                />
							            </Grid>
							        }
	            				</Grid>
	            			</ExpansionPanelDetails>
          				</ExpansionPanel>
          			)
          		})
          	}
      </div>
	)
}