import React from 'react';
import { Form, Input, Button } from 'antd';

const CreateAccountForm = ({ onSuccess }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('User created:', data);
            form.resetFields();
            if (onSuccess) onSuccess();
        } else {
            console.error('Error:', data.error || 'Unknown error');
            alert(data.error || 'Account creation failed');
        }

        } catch (error) {
            console.error('Request failed:', error);
        }
    };

  return (
    <Form
        form={form}
        name="createAccount"
        layout="vertical"
        onFinish={handleSubmit}
    >

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

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
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAccountForm;
