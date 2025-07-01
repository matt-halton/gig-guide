import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from './UserContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(UserContext);
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        const verify = async () => {

            if (!token) {
                setIsValid(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/auth/verify', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setIsValid(data.valid);
            } catch (err) {
                setIsValid(false);
            }
        };

        verify();
        }, [token]);

    if (isValid === null) return null;        // or <LoadingSpinner />
    if (!isValid) return null;               // or <Redirect /> if using React Router

    return <>{children}</>;

};

export default ProtectedRoute;
