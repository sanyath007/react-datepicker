import React from 'react';
import PropTypes from 'prop-types';

import Calendar from '../Calendar';
import { isDate, getDateISO } from '../../helpers/calendar';

import * as Styled from './styles';
import { Date } from 'core-js';

class Datepicker extends React.Component {
  state = { 
    date: null,
    min: null,
    max: null,
    calendarOpen: false
  }

  componentDidMount() {
    const { value: date, min, max } = this.props;

    const minDate = getDateISO(min ? new Date(min): null);
    const maxDate = getDateISO(max ? new Date(max): null);
    const newDate = getDateISO(date ? new Date(date) : null);

    minDate && this.setState({ min: minDate });
    maxDate && this.setState({ max: maxDate });
    newDate && this.setState({ new: newDate });
  }

  componentDidUpdate(prevProps) {
    const { value: date, min, max } = this.props;
    const { value: prevDate, min: prevMin, max: prevMax } = prevProps;
    
    const dateISO = getDateISO(new Date(date));
    const prevDateISO = getDateISO(new Date(prevDate));

    const minISO = getDateISO(new Date(min));
    const prevMinISO = getDateISO(new Date(prevMin));

    const maxISO = getDateISO(new Date(max));
    const prevMaxISO = getDateISO(new Date(prevMax));

    (minISO !== prevMinISO) && this.setState({ min: minISO });    
    (maxISO !== prevMaxISO) && this.setState({ max: maxISO });    
    (dateISO !== prevDateISO) && this.setState({ date: dateISO });    
  }

  
  toggleCalendar = () => this.setState({ calendarOpen: !this.state.calendarOpen });

  handleChange = event => event .preventDefault();
  
  handleDateChange = date => {
    const { onDateChanged } = this.props;
    const { date: currentDate } = this.state;
    const newDate = date ? getDateISO(date) : null;

    currentDate !== newDate &&
      this.setState({ date: newDate, calendarOpen: false }, () => {
        typeof onDateChanged === 'function' && onDateChanged(this.state.date);
      }) 
  }

  get value() {
    return this.state.date || '';
  }

  get date() {
    const { date } = this.state; 
    return date ? new Date(date) : null;
  }

  get mindate() {
    const { min } = this.state;
    return min ? new Date(min) : null;
  }

  get maxdate() {
    const { max } = this.state;
    return max ? new Date(max) : null;
  }

  render() {
    const { label } = this.props;
    const { calendarOpen } = this.state;
    const [value, placeholder] = [this.value, 'YYYY-MM-DD'].map(v => v.replace(/-/g, ' / '));

    return (
      <Styled.DatePickerContainer>
        <Styled.DatePickerFormGroup>

          <Styled.DatePickerLabel>{ label || 'Enter Date' }</Styled.DatePickerLabel>

          <Styled.DatePickerInput
            type="text"
            value={value}
            onChange={this.handleChange}
            readOnly="readonly"
            placeholder={placeholder}
          />

        </Styled.DatePickerFormGroup>

        <Styled.DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
          <Styled.DatePickerDropdownToggle color="transparent" />

          <Styled.DatePickerDropdownMenu>
            { calendarOpen && (
              <Calendar 
                date={this.date} 
                min={this.mindate} 
                max={this.maxdate} 
                onDateChanged={this.handleDateChange}
              />
            )}
          </Styled.DatePickerDropdownMenu>
        </Styled.DatePickerDropdown>
      </Styled.DatePickerContainer>
    );
  }
}

Datepicker.propTypes = {
  min: PropTypes.string,
  max: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChanged: PropTypes.func
}

export default Datepicker;
