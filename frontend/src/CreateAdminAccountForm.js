import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const CreateAdminAccountForm = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { token } = useContext(UserContext);

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/auth/register_admin', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
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

      <Form.Item
        label="Role"
        name="role"
        rules={[{ required: true, message: 'Please select a role!' }]}
      >
        <Select placeholder="Select a role">
          <Option value="admin">admin</Option>
          <Option value="user">user</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAdminAccountForm;
