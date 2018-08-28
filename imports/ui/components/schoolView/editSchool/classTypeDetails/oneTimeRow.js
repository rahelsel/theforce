import React from "react";
import Grid from "material-ui/Grid";
import { MaterialDatePicker } from "/imports/startup/client/material-ui-date-picker";
import { MaterialTimePicker } from "/imports/startup/client/material-ui-time-picker";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import Button from "material-ui/Button";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import config from "/imports/config";
import { DialogActions } from "material-ui/Dialog";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
export class OneTimeRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    let state;
    const { data, locationData, parentData } = this.props;
    if (_.isEmpty(data)) {

      state = {
        row: [
          {
            startDate: new Date(),
            startTime: new Date(),
            duration: "",
            roomId:  !_.isEmpty(locationData.rooms) ? locationData.rooms[0]._id : '',
            timeUnits: "Minutes",
            locationId: !_.isEmpty(locationData) ? locationData[0]._id : ''
          }
        ]
      };
      this.props.handleNoOfRow(1);
    } else {
      state = { row: [...data] };
      this.props.handleNoOfRow(data.length);
    }
    state.row.map((data, index)=>{
      const oldRow = [...state.row];
      locationData.map((data1,index1)=>{
       if (data1._id == data.locationId && !oldRow[index]['roomData'] && !oldRow[index]['roomId'] ){
         oldRow[index]['roomData'] =  data1 && data1.rooms ? data1.rooms : [];
         oldRow[index]['roomId'] = data.roomId ? data.roomId : !_.isEmpty(oldRow[index]['roomData']) ? oldRow[index]['roomData'][0].id : '';
       }
     })
     state.row=oldRow;
      })
    return state;
  };
 
  addNewRow = () => {
    const {locationData,data,roomData} = this.props;
    const oldRow = [...this.state.row];
    oldRow.push({
      startDate: new Date(),
      startTime: new Date(),
      duration: "",
      roomId:  oldRow[oldRow.length-1]['roomId'] ? oldRow[oldRow.length-1]['roomId'] : '',
      locationId: oldRow[oldRow.length-1]['locationId'] ? oldRow[oldRow.length-1]['locationId'] : '',
      roomData: oldRow[oldRow.length-1]['roomData'] ? oldRow[oldRow.length-1]['roomData'] :[]
    });
    this.setState({ row: oldRow });
    this.props.handleNoOfRow(1);
  };

  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
    this.props.handleNoOfRow(-1);
  };

  handleChangeDate = (index, fieldName, date) => {
    const oldRow = [...this.state.row];
    if (fieldName == "startTime") {
      let selectedDate = oldRow[index]["startDate"];
      let currentDate = selectedDate.getDate();
      date = new Date(date).setDate(currentDate);
    } else {
      // Need to change time according to selected date.
      oldRow[index]["startTime"] = new Date(date);
    }
    oldRow[index][fieldName] = new Date(date);
    this.setState({ row: oldRow });
  };
  //Set default location id if nothing selected 
  setDefaultLocation=(defaultLocId)=>{
    this.setState({locationId:defaultLocId})
    return defaultLocId;
  }
  handleSelectInputChange = (index, fieldName, event) => {
    //index condition in if below is removed
    const { locationData } = this.props;

    if (fieldName && event) {
      const oldRow = [...this.state.row];
      if (fieldName === "duration") {
        oldRow[index][fieldName] = parseInt(event.target.value);
      } else {
        oldRow[index][fieldName] = event.target.value;
      }
      if(fieldName == 'locationId' || fieldName == 'roomId'){
        oldRow.map((data2, index2)=>{
          locationData.map((data1,index1)=>{
           if (data1._id == data2.locationId){
             oldRow[index]['roomData'] =  data1 && data1.rooms ? data1.rooms : [];
             oldRow[index]['roomId'] =  !_.isEmpty(oldRow[index]['roomData']) ? oldRow[index]['roomData'][0].id : '';
           }
         })
          })
      }
      this.setState({ row: oldRow });
    }
  };
  getRowData = () => {
    return this.state.row;
  };
  handleRoomData = (locationId,roomId,index)=> {
  this.setState({row:oldRow});
  }
  render() {
    const { row } = this.state;
    const {locationData} = this.props;
    
    return (
      <div>
        {row.map((data, index) => {
          return (
            <Grid
              style={{
                border: "1px solid black",
                marginBottom: 15,
                padding: 5,
                backgroundColor: "antiquewhite"
              }}
              key={index}
              container
            >
              <Grid item sm={6} xs={12}>
                <MaterialDatePicker
                  required={true}
                  hintText={"Date"}
                  floatingLabelText={"Date *"}
                  value={data ? data.startDate : ""}
                  onChange={this.handleChangeDate.bind(
                    this,
                    index,
                    "startDate"
                  )}
                  fullWidth={true}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <MaterialTimePicker
                  required={true}
                  value={data ? data.startTime : ""}
                  floatingLabelText={"Start Time *"}
                  hintText={"Start Time"}
                  onChange={this.handleChangeDate.bind(
                    this,
                    index,
                    "startTime"
                  )}
                  fullWidth={true}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Grid
                  container
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    padding: "3px"
                  }}
                >
                  <Grid sm={6}>
                    <TextField
                      required={true}
                      defaultValue={data && data.duration != "" ? data.duration : 60}
                      margin="dense"
                      label="Duration"
                      type="number"
                      onChange={this.handleSelectInputChange.bind(
                        this,
                        index,
                        "duration"
                      )}
                      fullWidth
                      inputProps={{ min: "0"}}
                    />
                  </Grid>
                  <Grid sm={6}>
                    <FormControl
                      fullWidth
                      margin="dense"
                      style={{ padding: "4px" }}
                    >
                      <InputLabel htmlFor="weekDay" shrink={true}>
                        Units
                      </InputLabel>
                      <Select
                        input={<Input id="duration" />}
                        value={(data && data.timeUnits) || "Minutes"}
                        onChange={this.handleSelectInputChange.bind(
                          this,
                          index,
                          "timeUnits"
                        )}
                        fullWidth
                      >
                        {config.duration.map((data, index) => {
                          return (
                            <MenuItem
                              key={`${index}-${data.value}`}
                              value={data.value}
                            >
                              {data.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="dense">
                      <InputLabel htmlFor="location">Location</InputLabel>
                      <Select
                        required={true}
                        input={<Input id="location" />}
                        value={data.locationId}
                        onChange={this.handleSelectInputChange.bind(
                          this,
                          index,
                          "locationId"
                        )}
                        fullWidth
                      >
                        {_.isEmpty(locationData) && (
                          <MenuItem value="" disabled>
                            No location added in Locations.
                          </MenuItem>
                        )}
                        {locationData.map((data, index) => {
                          return (
                            <MenuItem key={index} value={data._id}>{`${
                              data.address
                            }, ${data.city}, ${data.country}`}</MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
            
              <Grid item sm={6} xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="roomId">Room</InputLabel>
                  <Select
                    input={<Input id="roomId" />}
                    value={data.roomId}
                    onChange={this.handleSelectInputChange.bind(
                      this,
                      index,
                      "roomId"
                    )}
                    fullWidth
                  >
                    {_.isEmpty(data.roomData) && (
                      <MenuItem value="" disabled>
                        No location added in Locations.
                      </MenuItem>
                    )}
                    {data.roomData&&
                      data.roomData.map((data, index) => {
                        return (
                          <MenuItem key={index} value={data.id}>
                            {data.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                {/* <Button
                  onClick={this.removeRow.bind(this, index)}
                  raised
                  color="accent"
                  style={{
                    backgroundColor: 'red',
                    color: "black",
                    fontWeight: 600
                  }}
                >
                  Delete
                </Button> */}
                 <ButtonWrapper>
            <FormGhostButton
              alertColor
              onClick={this.removeRow.bind(this, index)}
              label="Delete"
            />
          </ButtonWrapper>
              </Grid>
            </Grid>
          );
        })}
        <div>
          <div>
            {/* <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <Typography
                type="caption"
                style={{ maxWidth: "188px", padding: "8px" }}
              >
                Use this if there is another class with the same repeating
                pattern and students are expected to attend all class times in
                this group.
              </Typography>

              <Typography
                type="caption"
                style={{ maxWidth: "188px", padding: "8px" }}
              >
                Use this if there is a different repeating type or students can
                come to any class time available.
              </Typography>
            </div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}
            >
              {/* <Button onClick={this.addNewRow} raised color="secondary"
                style={{
                  backgroundColor: 'mediumseagreen',
                  color: "black",
                  fontWeight: 600
                }}
              >
                Add Linked Class Time
              </Button> */}
              <ButtonWrapper>
                  <FormGhostButton
                    darkGreyColor
                    onClick={this.addNewRow}
                    label="Add Linked Class Time"
                  />
                </ButtonWrapper>
              {/* <Button
                onClick={this.props.saveClassTimes.bind(this, event, {
                  addSeperateTime: true
                })}
                raised
                color="secondary"
              >
                Add Separate Class Time
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
