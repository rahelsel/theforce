import React , {Component,Fragment} from 'react';
import isEmpty from 'lodash/isEmpty';
import { findDOMNode } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import * as helpers from '../jss/helpers.js';
import ClassTimeClock from './ClassTimeClock.jsx';
import ClassTimeNewClock from './ClassTimeNewClock.jsx';

const ONE_TIME = 'onetime';
const DAYS_IN_WEEK = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const OuterWrapper = styled.div`
  width: ${props => props.width || 250}px;
  overflow: hidden;
`;
const InnerWrapper = styled.div`
  ${helpers.flexCenter}
  width: 100%;
  min-height: 160px;
  position: relative;
`;

const ClockWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ChangeSlide = styled.div`
  width: 100%;
  font-family: ${helpers.specialFont};
  ${helpers.flexCenter}
`;

const ScheduleSeperator = styled.span`
  font-weight: 600;
  margin: 0 ${helpers.rhythmDiv/2}px;
`;

const Schedule = styled.p`
  display: inline-block;
  width: 100%;
  text-align: center;
  margin: 0;
  margin-top: ${helpers.rhythmDiv}px;
  font-weight: 400;
  font-size: ${helpers.baseFontSize}px;
  text-transform: capitalize;
`;

const Days = styled.p`
  ${helpers.flexCenter}
  margin: 0;
`;

const Day = styled.p`
  ${helpers.flexCenter}
  margin: 0;
  margin-right: ${helpers.rhythmDiv/2}px;
  font-size: 12px;
  line-height: 1;
  font-family: ${helpers.specialFont};
  font-weight: 500;
  width: 28px;
  height: 28px;
  text-transform: capitalize;
  cursor: pointer;
  border-radius: 50%;
  padding: ${helpers.rhythmDiv}px;
  border: 1px solid ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };
  color: ${props => props.active ? helpers.primaryColor : `rgba(${helpers.classTimeClockButtonColor},0.8)` };

  &:last-of-type {
    margin-right: 0;
  }
`;

const Seperator = styled.span`
  font-weight: 400;
`;

class ClassTimeClockManager extends Component {
  state = {
    currentIndex: 0,
    lastIndex: 0
  }

  getDayInShortFormat = (dayDb) => {
    const day = dayDb.toLowerCase();
    return day.substr(0,2);
  }

  formatDataBasedOnScheduleType = (data) => {
    // In this method we basically need to format data
    /* eg formatted data..
    classTimes : {
      'monday': [{
          time: '07:00',
          timePeriod: 'am',
          duration: 120,
          date: "2018-04-06T06:45:54.289Z"
      }],
      'wednesday': [{
        time: '3:00',
        timePeriod: 'pm',
        duration: 145,
        date: "2018-04-16T06:45:54.289Z"
      },
      {
        time: '05:30',
        timePeriod: 'am',
        duration: 175,
        date: "2018-04-16T06:45:54.289Z"
      }]
    }

    NOTE: Recurring, Ongoing scheduleType are already formatted (or easy to format) this way,
        but for oneTime we need to transform into this format to feed data to clock(s).
    */
    return data;
  }


  startAutoMaticSlider = () => {
    this.sliderInterval = setInterval(() => {
      let newIndex = this.state.currentIndex + 1;
      // console.log(newIndex,this.state.lastIndex);

      if(newIndex === this.state.lastIndex) {
        newIndex = 0;
      }

      this.handleSliderState(newIndex);
    },this.state.slideTime);
  }

  handleDayClick = (index) => (e) => {
    e.preventDefault();
    // console.log('clicked',index,"=============");

    this.handleSliderState(index);
  }

  handleSliderState = (newIndex) => {
    this.setState({
      currentIndex: newIndex
    });
  }


  render() {
    console.log(' clock times clock manager -----> ',this.props.data,".....");
    const formattedClassTimes = this.formatDataBasedOnScheduleType(this.props.classTimes);
    return (<Fragment>
        {/*Clock Times*/}
        <OuterWrapper width={this.props.outerWidth}>
          <InnerWrapper>
            {/* NOTE : This is not to be used when we are using the ClassTimeNewClock */}
            {/* <ClassTimeClock data={this.props.data} visible={this.state.currentIndex} {...this.props.clockProps} /> */}

            {formattedClassTimes && DAYS_IN_WEEK.map((day,i) => {
              // console.log(this.props,'this.props......')
              if(formattedClassTimes[day]) {
                return <ClassTimeNewClock
                  currentDay={day}
                  scheduleType={this.props.scheduleType}
                  scheduleData={formattedClassTimes[day]}
                  visible={i === this.state.currentIndex}
                  clockProps={this.props.clockProps} />
              }
              return null;
            })}
          </InnerWrapper>
        </OuterWrapper>

        <ChangeSlide>
          <Days>
            {formattedClassTimes && DAYS_IN_WEEK.map((day,i) => {
              // console.log(this.props,'this.props......')
              if(formattedClassTimes[day]){
                return(<Day
                  key={i}
                  active={i === this.state.currentIndex}
                  onClick={this.handleDayClick(i)}>
                  {this.getDayInShortFormat(day)}
                </Day>)
              }
              return null;
            })}
          </Days>
        </ChangeSlide>

        {<Schedule>{ this.props.scheduleType}</Schedule>}
      </Fragment>
    )
  }
}

ClassTimeClockManager.propTypes = {
  classTimes: PropTypes.arrayOf(PropTypes.object),
  scheduleType: PropTypes.string,
}

ClassTimeClockManager.defaultProps = {

}

export default ClassTimeClockManager;