import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Tooltip } from '@mui/material';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const holidays = [
  { date: dayjs('2025-01-01'), name: "New Year's Day" },
  { date: dayjs('2025-01-26'), name: 'Republic Day' },
  { date: dayjs('2025-03-29'), name: 'Holi' },
  { date: dayjs('2025-03-31'), name: 'Ramzan' },
  { date: dayjs('2025-05-01'), name: 'Labour Day' },
  { date: dayjs('2025-08-15'), name: 'Independence Day' },
  { date: dayjs('2025-10-02'), name: 'Gandhi Jayanti' },
  { date: dayjs('2025-10-20'), name: 'Diwali' },
  { date: dayjs('2025-12-25'), name: 'Christmas' },
];

const HolidayList = () => {
  return (
    <Box 
    p={2} 
    sx={{ 
      width: 250, 
      height: 350, 
      overflowY: 'auto', 
      backgroundColor: '#fafafa', 
      borderRadius: 2, 
      boxShadow: 3, 
      mt: 0, 
      position: '',
      top: 0,
      border: '1px solid #e0e0e0' 
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
      Holiday List for 2025
    </Typography>
    <List>
      {holidays.map((holiday, index) => (
        <div key={index}>
          <ListItem sx={{ padding: '8px 16px', ':hover': { backgroundColor: '#f5f5f5' } }}>
            <ListItemText
              primary={holiday.name}
              secondary={holiday.date.format('MMM DD, YYYY')}
              sx={{ color: '#555' }}
            />
          </ListItem>
          <Divider sx={{ borderColor: '#e0e0e0' }} />
        </div>
      ))}
    </List>
  </Box>
  
  );
};

const HolidayCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const renderHolidayDay = (date, selectedDates, pickersDayProps) => {
    const dayDate = date.startOf('day');
    const holiday = holidays.find(h => 
      h.date.startOf('day').isSame(dayDate)
    );

    const isHoliday = Boolean(holiday);

    return (
      <Tooltip 
        title={isHoliday ? `${holiday.name} - ${holiday.date.format('MMM DD, YYYY')}` : ''} 
        arrow
      >
        <PickersDay
          {...pickersDayProps}
          sx={{
            ...(isHoliday && {
              backgroundColor: '#ff0000 !important',
              color: '#ffffff !important',
              fontWeight: 'bold !important',
              borderRadius: '50% !important',
              border: '2px solid #ffffff !important',
              '&:hover': {
                backgroundColor: '#ff5252 !important',
              },
              '&.Mui-selected': {
                backgroundColor: '#ff0000 !important',
                color: '#ffffff !important',
              }
            }),
            '&.MuiPickersDay-root': {
              width: 36,
              height: 36,
              fontSize: '0.875rem',
            }
          }}
        />
      </Tooltip>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box p={2} width="100%" maxWidth={800}>
      
      <Box sx={{ display: 'none', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderDay={renderHolidayDay}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: 'background.paper',
                }}
              />
            </LocalizationProvider>
          </Box>
          
        
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
            <HolidayList/>
          </Box>
    </Box>

    
  );
};

export default HolidayCalendar;