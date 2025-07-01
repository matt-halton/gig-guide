import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';

  const EventsPage = () => {

    return (
    <div>
        <h2>Events Placeholder!</h2>
        <ProtectedRoute><h2>You are logged in!</h2></ProtectedRoute>
        <AdminProtectedRoute><h2>You are an admin!</h2></AdminProtectedRoute>
    </div>
    )

    };

export default EventsPage;