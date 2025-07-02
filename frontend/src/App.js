import React, { useState, useContext } from 'react';
import { Layout, Menu, Button, Modal, Row, Col } from 'antd';
import LoginForm from './LoginForm';
import CreateAccountForm from './CreateAccountForm';
import ProtectedRoute from './ProtectedRoute';
import AdminPage from './AdminPage';
import CalendarPage from './CalendarPage';
import FavouritesPage from './FavouritesPage';
import { UserContext } from './UserContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleLoginCancel = () => {
    setIsLoginModalVisible(false);
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalVisible(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    logout();
  }

  const HomePage = () => (
    <div>
        <h2>Hello!</h2>
        <ProtectedRoute>
            <h2>You Are Logged In</h2>
        </ProtectedRoute>
    </div>
  )

  return (
    <Layout>
      <Header style={{ background: '#001529'}}>
        <Row justify="space-between" align="middle">
            <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ color: 'white', fontSize: '20px', marginRight: '20px' }}>
                        Gig Guide
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ minWidth: 350 }}
                        defaultSelectedKeys={['1']}
                        items={[
                        { key: '1', label: 'Home' },
                        { key: '2', label: 'Admin' },
                        { key: '3', label: 'Calendar' },
                        { key: '4', label: 'Favourites' },
                        ]}
                        onClick={({ key }) => {
                        if (key === '1') navigate('/');
                        if (key === '2') navigate('/admin');
                        if (key === '3') navigate('/calendar');
                        if (key === '4') navigate('/favourites');
                        }}
                    />
                </div>
            </Col>
            <Col>
                { isLoggedIn ? (
                <Button type="primary" onClick={handleLogout}>
                    Logout
                </Button>
                ) : (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    type="primary"
                    onClick={showCreateModal}
                    style={{ marginRight: '20px' }}
                >
                    Create Account
                </Button>
                <Button
                    type="primary"
                    onClick={showLoginModal}
                >
                    Login
                </Button>
                </div>
                )}
            </Col>
        </Row>
      </Header>

      <Content style={{ padding: '24px', minHeight: '80vh' }}>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        ©2025
      </Footer>

      <Modal
        title="Login"
        open={isLoginModalVisible}
        onCancel={handleLoginCancel}
        footer={null}
      >
        <LoginForm onSuccess={handleLogin} />
      </Modal>

      <Modal
        title="Create"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={null}
      >
        <CreateAccountForm onSuccess={() => setIsCreateModalVisible(false)}/>
      </Modal>

    </Layout>
  );
};

export default App;
