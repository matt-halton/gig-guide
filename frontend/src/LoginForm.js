import React, { useContext } from 'react';
import { Form, Input, Button } from 'antd';
import { UserContext } from './UserContext';

const LoginForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { login } = useContext(UserContext);

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Token', data.access_token, 'User', data.user);
            login(data.access_token, data.user);
            form.resetFields();
            if (onSuccess) onSuccess();
        } else {
            console.error('Error:', data.error || 'Unknown error');
            alert(data.error || 'Login failed');
        }

        } catch (error) {
            console.error('Request failed:', error);
            }
    };

    return (
    <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={handleSubmit}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
