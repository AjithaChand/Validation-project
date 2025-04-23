import React, { useState } from 'react';
import Calendar from 'react-calendar';

const Calendarcomponent = () => {
    const [date, setDate] = useState(new Date());
  return (
    <div>
        <Calendar onChange={setDate} value={date} />
    </div>
  )
}

export default Calendarcomponent;
