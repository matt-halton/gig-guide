import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

const FavouritesPage = () => {
  const { user, token } = useContext(UserContext);
  const [gigs, setGigs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch('http://localhost:5000/gigs/user_favourites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ user_id: user.id })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load favourites');
        }

        setGigs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user && user.id && token) {
      fetchFavourites();
    }
  }, [user, token]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Favourite Gigs</h2>
      {gigs.length === 0 ? (
        <p>No favourites found.</p>
      ) : (
        <ul>
          {gigs.map((gig) => (
            <li key={gig.id}>
              {gig.artist} at {gig.venue} on {new Date(gig.gig_datetime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavouritesPage;
