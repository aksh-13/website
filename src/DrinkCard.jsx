import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DrinkCard.css';

const DrinkCard = ({ image, title, description }) => {
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/order', { state: { title, description, image } });
  };

  return (
    <div className="drink-card">
      <img src={image} alt={title} className="drink-image" />
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="order-button" onClick={handleOrderNow}>Order Now</button>
    </div>
  );
};

export default DrinkCard;