import React, {useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import CreateGigForm from './CreateGigForm';
import CreateAdminAccountForm from './CreateAdminAccountForm';
import UserAdminPanel from './UserAdminPanel';
import { Row, Col, message } from 'antd';

  const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const { token } = useContext(UserContext);

    const fetchUsers = async () => {
        try {
        const res = await fetch("http://localhost:5000/auth/list_users", {
        headers: {
          Authorization: "Bearer " + token,
        },
        });
        if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch users");
        }
        const data = await res.json();
        setUsers(data.users);
        } catch (err) {
        message.error("Error: " + err.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
    <div>
        <h2>Admin Page</h2>
        <AdminProtectedRoute>
            <Row gutter = {24}>
                <Col>
                    <h2>Create Gig</h2>
                    <CreateGigForm/ >
                </Col>
                <Col>
                    <h2>Create New User</h2>
                    <CreateAdminAccountForm onSuccess={fetchUsers} / >
                </Col>
                <Col>
                <h2>Admin User Management</h2>
                <UserAdminPanel users={users} onDeleteSuccess={fetchUsers} />
                </Col>
            </Row>
        </AdminProtectedRoute>
    </div>
    )

    };

export default AdminPage;