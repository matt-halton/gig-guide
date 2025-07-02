import React, { useEffect, useState, useContext } from 'react';
import { Calendar, DateLocalizer, dateFnsLocalizer } from 'react-big-calendar';
import { UserContext } from './UserContext';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO, format, parse, startOfWeek, getDay } from 'date-fns';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const { token } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');

  const handleEventClick = async (event) => {
    if (!user?.id) {
    console.error("User not logged in.");
    return;
    }

    try {
        const res = await fetch('http://localhost:5000/gigs/add_favourite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            user_id: user.id,
            event_id: event.id
        })
        });

        const data = await res.json();

        if (res.ok) {
        console.log("Favourite created!", data);
        } else {
        console.error("Server error:", data.error);
        }
    } catch (error) {
    console.error("Request failed:", error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/gigs/all', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        const data = await res.json();

        const formatted = data.map((gig) => ({
          id: gig.id,
          title: `${gig.artist} at ${gig.venue}`,
          start: parseISO(gig.gig_datetime),
          end: parseISO(gig.gig_datetime),
          allDay: false,
        }));

        setEvents(formatted);
      } catch (error) {
        console.error('Error fetching gigs:', error);
      }
    };

    fetchEvents();
  }, [token]);

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%', backgroundColor: 'white' }}
        onSelectEvent={handleEventClick}
      />
    </div>
  );
};

export default CalendarPage;
