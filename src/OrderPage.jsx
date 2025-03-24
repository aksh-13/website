import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, description, image } = location.state;
  const [quantity, setQuantity] = useState(1);
  const [tableNumber, setTableNumber] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const order = {
      drinkTitle: title,
      drinkDescription: description,
      quantity,
      tableNumber,
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        navigate('/thank-you');
      } else {
        console.error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="order-page">
      <h1>Order {title}</h1>
      <img src={image} alt={title} className="order-image" />
      <p>{description}</p>
      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <label>
          Table Number:
          <input
            type="number"
            name="tableNumber"
            min="1"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
        </label>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderPage;