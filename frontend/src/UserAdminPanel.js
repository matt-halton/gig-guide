import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { UserContext } from './UserContext';

const UserAdminPanel = ({users, onDeleteSuccess}) => {
  const { token } = useContext(UserContext);

  const handleDelete = async (userId) => {
    try {
      const res = await fetch("http://localhost:5000/auth/delete_user/" + userId, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      message.success("User " + userId + " deleted successfully");
      onDeleteSuccess();
    } catch (err) {
      message.error("Error: " + err.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) =>
        record.id === 1 ? (
          <span>Cannot Delete</span>
        ) : (
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
    </div>
  );
};

export default UserAdminPanel;
