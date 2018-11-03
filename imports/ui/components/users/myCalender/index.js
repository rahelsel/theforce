import React from "react";
import FullCalendarContainer from "/imports/ui/componentHelpers/fullCalendar";
import ClassDetailModal from "/imports/ui/modal/classDetailModal";

export default class MyCalender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setDate = (startDate, endDate) => this.setState({ startDate, endDate });

  handleEventModal = (isOpen, eventData, clickedDate) => {
    this.setState({
      isOpen,
      eventData,
      clickedDate
    });
  };

  render() {
    let { isOpen, eventData, clickedDate } = this.state;
    return (
      <div>
        <FullCalendarContainer
          subscriptionName="ClassSchedule"
          setDate={this.setDate}
          showEventModal={this.handleEventModal}
          {...this.state}
          {...this.props}
          manageMyCalendar={true}
        />
        {isOpen && (
          <ClassDetailModal
            eventData={eventData}
            showModal={isOpen}
            closeEventModal={this.handleEventModal}
            classInterestData={this.props.classInterestData}
            onJoinClassButtonClick={this.props.onJoinClassButtonClick}
            clickedDate={clickedDate}
            routeName={this.props.route && this.props.route.name}
            type={this.props.type}
            params={this.props.params}
          />
        )}
      </div>
    );
  }
}
