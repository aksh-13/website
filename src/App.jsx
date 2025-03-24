import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import DrinkCard from './DrinkCard';
import OrderPage from './OrderPage';
import ThankYouPage from './ThankYouPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import NotificationPage from './NotificationPage';
import React from 'react';
import logo from './assets/Sauka_logo.png'; // Import the logo
import mojito from './assets/mojito.jpg'; // Import the mojito image
import nepalBlackTea from './assets/Nepal_Black_Tea.png'; // Import the Nepal Black Tea image
import greenDrink from './assets/green_drink.png'; // Import the green drink image

function App() {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const drinks = [
    {
      image: mojito,
      title: 'Mojito',
      description: 'This is a description for Mojito.',
    },
    {
      image: nepalBlackTea,
      title: 'Nepal Black Tea',
      description: 'This is a description for Nepal Black Tea.',
    },
    {
      image: greenDrink,
      title: 'Green Drink',
      description: 'This is a description for Green Drink.',
    },
  ];

  const filteredDrinks = drinks.filter((drink) =>
    drink.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <button className="navbar-toggler" onClick={handleNavCollapse}>
          &#9776;
        </button>
        <ul className={`navbar-links ${isNavCollapsed ? 'collapsed' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/notifications">Notifications</Link></li>
        </ul>
      </nav>
      <div className="content">
        {location.pathname === '/' && (
          <>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <h1 className="header">Mocktails</h1>
            <div className="drink-container">
              {filteredDrinks.map((drink, index) => (
                <React.Fragment key={index}>
                  <DrinkCard
                    image={drink.image}
                    title={drink.title}
                    description={drink.description}
                  />
                  {index < filteredDrinks.length - 1 && <hr className="drink-divider" />}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;