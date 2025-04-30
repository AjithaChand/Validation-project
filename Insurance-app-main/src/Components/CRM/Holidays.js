import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const holidays = [
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-03-29', name: 'Holi' },
  {date:'2025-03-31',name:"Ramzan"},
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  {date:'2025-10-20',name:"Diwali"},
  { date: '2025-12-25', name: 'Christmas' }
];

const isSameDay = (d1, d2) => dayjs(d1).isSame(d2, 'day');

const HolidayCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const renderDay = (date, _selectedDates, pickersDayProps) => {
    const holiday = holidays.find(h => isSameDay(h.date, date));
    return holiday ? (
      <Tooltip title={holiday.name} arrow>
        <Box
          sx={{
            borderRadius: '50%',
            backgroundColor: '#ff5252',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {date.date()}
        </Box>
      </Tooltip>
    ) : (
      <Box>{date.date()}</Box>
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Total Holidays in 2025: {holidays.length}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          slots={{ day: renderDay }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default HolidayCalendar;
