import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import OrderCard from './OrderCard';
import './NotificationPage.css';

const NotificationPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('new-order', (order) => {
      console.log('New order received:', order); // Log the received order
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders, order];
        console.log('Updated orders:', updatedOrders); // Log the updated orders
        return updatedOrders;
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('Orders state updated:', orders); // Log the updated orders state
  }, [orders]);

  const filteredOrders = orders.filter((order) =>
    order.drinkTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="notification-page">
      <h1>New Orders</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="order-cards-container">
        {filteredOrders.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;