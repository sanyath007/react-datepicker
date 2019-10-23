import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import calendar, {
  isDate,
  isSameDay,
  isSameMonth,
  getDateISO,
  getNextMonth,
  getPreviousMonth,
  WEEK_DAYS,
  CALENDAR_MONTHS
} from "../../helpers/calendar";

class Calendar extends Component {
  state = { ...this.resolveStateFromProp(), today: new Date() };

  componentDidMount() {
    const now = new Date();
    const tomorrow = new Date().setHours(0,0,0,0) + 24 * 60 * 60 * 1000;
    const ms = tomorrow - now;

    this.dayTimeout = setTimeout(() => {
      this.setState({ today: new Date() }, this.clearDayTimeout);
    }, ms);
  }

  componentDidUpdate(prevProps) {
    const { date, onDateChanged } = this.props;
    const { date: prevDate } = prevProps;
    const dateMatch = date == prevDate || isSameDay(date, prevDate);

    !dateMatch &&
      this.setState(this.resolveStateFromDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date);
      });
  }

  componentWillUnmount() {
    this.clearPressureTimer();
    this.clearDayTimeout()
  }

  clearDayTimeout = () => {
    this.dayTimeout && this.clearTimeout(this.dayTimeout);
  }

  resolveStateFromDate(date) {
    const isDateObject = isDate(date);
    const _date = isDateObject ? date : new Date();

    return {
      current: isDateObject ? date : null,
      month: +_date.getMonth() + 1,
      year: _date.getFullYear()
    };
  }

  resolveStateFromProp() {
    return this.resolveStateFromDate(this.props.date);
  }

  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const calendarMonth = month || +current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();

    return calendar(calendarMonth, calendarYear);
  };

  gotoDate = date => event => {
    event && event.preventDefault();
    
    const { current } = this.state;
    const { onDateChanged } = this.props;

    !(current && isSameDay(date, current)) &&
      this.setState(this.resolveStateFromDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date);
      });
  }
  
  /** 
   * Render the month and year header with arrow controls
   * for navigating through months and years
   */
  renderMonthAndYear = () => {
    const { month, year } = this.state;

    const monthname = Object.keys(CALENDAR_MONTHS)[
      Math.max(0, Math.min(month - 1, 11))
    ];

    return (
      <Styled.CalendarHeader>
        <Styled.ArrowLeft
          onMouseDown={this.handlePrevious}
          onMouseUp={this.clearPressureTimer}
          title="Previous Mounth"
        />

        <Styled.CalendarMonth>
          {monthname} {year}
        </Styled.CalendarMonth>

        <Styled.ArrowRight
          onMouseDown={this.handleNext}
          onMouseUp={this.clearPressureTimer}
          title="Next Mounth"
        />
      </Styled.CalendarHeader>
    );
  };

  /**
   * Render the label for day of the week
   * This method is used as a map callback as seen in render()
   */
  renderDayLabel = (day, index) => {
    const daylabel = WEEK_DAYS[day].toUpperCase();

    return (
      <Styled.CalendarDay key={daylabel} index={index}>
        {daylabel}
      </Styled.CalendarDay>
    );
  }

  /**
   * Render a calendar date as returned from the calendar builder function
   * This method is used as a map callback as seen in render()
   */
  renderCalendarDate = (date, index) => {
    const { current, month, year, today } = this.state;

    const _date = new Date(date.join("-"));

    const isToday = isSameDay(_date, today);

    const isCurrent = current && isSameDay(_date, current);

    const inMonth = month && year && isSameDay(_date, new Date([year, month, 1].join("-")));

    const onClick = this.gotoDate(_date);

    const props = { index, inMonth, onClick, title: _date.toDateString() };

    const DateComponent = isCurrent
      ? Styled.HighlightedCalendarDate
      : isToday
        ? Styled.TodayCalendarDate
        : Styled.CalendarDate;

    return (
      <DateComponent key={getDateISO(_date)} {...props}>
        {_date.getDate()}
      </DateComponent>
    );
  };

  render() {
    return (
      <Styled.CalendarContainer>
        {this.renderMonthAndYear()}

        <Styled.CalendarGrid>
          <Fragment>{Object.keys(WEEK_DAYS).map(this.renderDayLabel)}</Fragment>

          <Fragment>
            {this.getCalendarDates().map(this.renderCalendarDate)}
          </Fragment>
        </Styled.CalendarGrid>
      </Styled.CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Calendar;
