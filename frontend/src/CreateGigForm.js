import React, { useContext } from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { UserContext } from './UserContext';
import dayjs from 'dayjs';

const CreateGigForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const { token } = useContext(UserContext);

  const handleSubmit = async (values) => {
    try {

    const payload = {
    ...values,
    gig_datetime: values.gig_datetime.toISOString(),
    };

      const response = await fetch('http://localhost:5000/gigs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Gig created:', data);
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
      name="createGig"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Artist"
        name="artist"
        rules={[{ required: true, message: 'Please input the artist name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Venue"
        name="venue"
        rules={[{ required: true, message: 'Please input the venue!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Gig Date and Time"
        name="gig_datetime"
        rules={[{ required: true, message: 'Please select the gig date and time!' }]}
      >
        <DatePicker
        showTime={{ format: 'HH:mm' }}
        style={{ width: '100%' }}
        format="YYYY-MM-DDTHH:mm:ssZ"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Create Gig
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateGigForm;