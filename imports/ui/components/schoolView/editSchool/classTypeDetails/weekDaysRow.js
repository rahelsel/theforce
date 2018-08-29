import React from "react";
import Grid from "material-ui/Grid";
import { MaterialTimePicker } from "/imports/startup/client/material-ui-time-picker";
import Select from "material-ui/Select";
import MultiSelect from "react-select";
import TextField from "material-ui/TextField";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import config from "/imports/config";
import styled from "styled-components";
import FormGhostButton from "/imports/ui/components/landing/components/buttons/FormGhostButton.jsx";
import * as helpers from "/imports/ui/components/landing/components/jss/helpers.js";
const ButtonWrapper = styled.div`
  margin-bottom: ${helpers.rhythmDiv}px;
`;
export class WeekDaysRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initializeFields();
  }

  initializeFields = () => {
    const { data, locationData} = this.props;
    const state = {
      row: [],
      Weekdays:[
        {value:0,label:"Monday"},
        {value:1,label:"Tuesday"},
        {value:2,label:"Wednesday"},
        {value:3,label:"Thursday"},
        {value:4,label:"Friday"},
        {value:5,label:"Saturday"},
        {value:6,label:"Sunday"}
      ]
    };
    if (!_.isEmpty(data)) {
      for (let key in data) {
        for (let obj of data[key]) {
          state.row.push({
            key: obj.key,
            startTime: obj.startTime,
            duration: obj.duration,
            day: obj.day,
            timeUnits: (obj && obj.timeUnits) || "Minutes",
          });
        }
      }
    } else {
      // Initial state if we are adding time instead of editing class time
      state.row.push({
        key: [],
        startTime: new Date(),
        duration: "",
        day: 0,
        roomId:  !_.isEmpty(locationData.rooms) ? locationData.rooms[0]._id : '',
        timeUnits: "Minutes",
        locationId: !_.isEmpty(locationData) ? locationData[0]._id : ''
      });
    }
    return state;
  };

  handleChangeDate = (index, fieldName, date) => {
    const oldRow = [...this.state.row];
    oldRow[index][fieldName] = new Date(date);
    this.setState({ row: oldRow });
  };

  addNewRow = () => {
    const {  locationData,roomData} = this.props;
    const oldRow = [...this.state.row];
    oldRow.push({
      key: [],
      startTime: new Date(),
      duration: "",
      day: 0,
    });
    this.setState({ row: oldRow });
  };
  //Set default location id if nothing selected 
  removeRow = (index, event) => {
    const oldRow = [...this.state.row];
    oldRow.splice(index, 1);
    this.setState({ row: oldRow });
  };

  handleSelectInputChange = (index, fieldName, event) => {
    const oldRow = [...this.state.row];
    const { locationData } = this.props;
    oldRow[index][fieldName] = event.target.value;

    if (fieldName === "key") {
      let indexOfDay = scheduleDetails.indexOf(event.target.value);
      oldRow[index].day = 1 + scheduleDetails.indexOf(event.target.value);
    }

    if (fieldName === "duration") {
      oldRow[index][fieldName] = parseInt(event.target.value);
    }
    
    this.setState({ row: oldRow });
  };

  getRowData = () => {
    let rowData = this.state.row.filter(data => {
      return data.key;
    });
    const grouped = _.groupBy(rowData, function (item) {
      return item.key;
    });
    return grouped;
  };
  handleWeekDay = (key,index)=> {
    let oldRow= this.state.row;
    oldRow[index][`key`]=key;
    this.setState({row:oldRow});
  }
  render() {
    const { row ,Weekdays} = this.state;
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
                {/*Repeating class is useful when you plan to teach the same class multiple times. You can schedule the recurring class at one go without the need to schedule every time you plan to offer the same class.*/}
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="weekDay" shrink={true}>
                    WeekDay
                  </InputLabel>

                  {/* <Select
                    input={<Input id="weekDay" />}
                    value={data && data.key != '' ? data.key : scheduleDetails[0]}
                    onChange={this.handleSelectInputChange.bind(
                      this,
                      index,
                      "key"
                    )}
                    fullWidth
                  >
                    {scheduleDetails.map((day, key) => {
                      return (
                        <MenuItem key={key} value={day}>
                          {day}
                        </MenuItem>
                      );
                    })}
                  </Select> */}
                  <MultiSelect
                    name="filters"
                    placeholder="Weekdays"
                    value={data.key}
                    options={Weekdays}
                    onChange={(e)=>{this.handleWeekDay(e,index)}}
                    multi
                    style = {{backgroundColor:'antiquewhite'}}
                  />
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <MaterialTimePicker
                  required={true}
                  value={data && data.startTime}
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
                  <Grid item sm={6}>
                    <TextField
                      defaultValue={data && data.duration || 60}
                      margin="dense"
                      onChange={this.handleSelectInputChange.bind(
                        this,
                        index,
                        "duration"
                      )}
                      label="Duration"
                      type="number"
                      fullWidth
                      required={
                        data && data.key && data.key != '' ? true : false
                      } /*Made it mandatory if week day selected*/
                      inputProps={{ min: "0"}}
                    />
                  </Grid>
                  <Grid sm={6}>
                    <FormControl fullWidth margin="dense">
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
              
              
              <Grid item xs={12} sm={4}>
               
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
         
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}

            >
              
              <ButtonWrapper>
                  <FormGhostButton
                    darkGreyColor
                    onClick={this.addNewRow}
                    label="Add Linked Class Time"
                  />
                </ButtonWrapper>
                              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
