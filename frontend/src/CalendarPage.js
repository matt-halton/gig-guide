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
  const [favouriteEventIds, setFavouriteEventIds] = useState([]);

  const handleEventClick = async (event) => {
  if (!user?.id) {
    console.error("User not logged in.");
    return;
  }

  const isFavourite = favouriteEventIds.includes(event.id);

    try {
        const url = isFavourite
        ? 'http://localhost:5000/gigs/remove_favourite'
        : 'http://localhost:5000/gigs/add_favourite';

        const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            user_id: user.id,
            event_id: event.id,
        }),
        });

        const data = await res.json();

        if (res.ok) {
        console.log(isFavourite ? "Favourite removed!" : "Favourite created!", data);

        // Update local state immediately:
        setFavouriteEventIds((prev) => {
            if (isFavourite) {
            return prev.filter((id) => id !== event.id);
            } else {
            return [...prev, event.id];
            }
        });

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

  useEffect(() => {
  const fetchFavourites = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch('http://localhost:5000/gigs/user_favourites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();
      // Assuming the response is an array of gig IDs or objects with id
      setFavouriteEventIds(data.map(fav => fav.id));
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  fetchFavourites();
}, [user, token]);

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
          eventPropGetter={(event) => {
        if (favouriteEventIds.includes(event.id)) {
            return {
                style: {
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '4px',
            },
        };
        }
        return {};
        }}
      />
    </div>
  );
};

export default CalendarPage;
