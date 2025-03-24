import React, { useState } from 'react';
import './ThankYouPage.css';

const ThankYouPage = () => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="thank-you-page">
      <h1>Thank You for Your Order!</h1>
      <p>We appreciate your business. Please leave a review below:</p>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${rating >= star ? 'selected' : ''}`}
            onClick={() => handleRating(star)}
          >
            &#9733;
          </span>
        ))}
      </div>
      {rating > 0 && <p>You rated us {rating} stars. Thank you!</p>}
    </div>
  );
};

export default ThankYouPage;