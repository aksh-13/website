import React from 'react';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  return (
    <div className="order-card">
      <h3>{order.drinkTitle}</h3>
      <p>{order.drinkDescription}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Table: {order.tableNumber}</p>
    </div>
  );
};

export default OrderCard;