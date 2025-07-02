import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import CreateGigForm from './CreateGigForm';
import CreateAdminAccountForm from './CreateAdminAccountForm';
import { Row, Col } from 'antd';

  const AdminPage = () => {

    return (
    <div>
        <h2>Admin Page</h2>
        <AdminProtectedRoute>
            <Row gutter = {24}>
                <Col span ={4}>
                    <h2>Create Gig</h2>
                    <CreateGigForm/ >
                </Col>
                <Col>
                    <h2>Create New Admin</h2>
                    <CreateAdminAccountForm/ >
                </Col>
            </Row>
        </AdminProtectedRoute>
    </div>
    )

    };

export default AdminPage;