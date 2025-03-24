const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors'); // Import the cors package
const QRCode = require('qrcode'); // Import the QRCode library

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Use the cors middleware

mongoose.connect('mongodb+srv://shrotriakshaj:V0VykonS6z9on4Ho@orders.mlhw3.mongodb.net/orders?retryWrites=true&w=majority&ssl=true', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// QR Code generation endpoint
app.get('/generate_qr/:tableNumber', async (req, res) => {
  const { tableNumber } = req.params;

  try {
    // Define the URL for the table
    const url = `https://saukaevents-1eeh8h42k-akshajs-projects-2701b487.vercel.app/order?table=${tableNumber}`;

    // Generate the QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    // Send the QR code as a response
    res.status(200).json({ tableNumber, qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error('Error generating QR code:', err.message);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Example order endpoint (optional, for testing)
app.post('/api/orders', async (req, res) => {
  const { drinkTitle, drinkDescription, quantity, tableNumber } = req.body;
  console.log('Order received:', req.body); // Log the received order
  try {
    const order = new mongoose.model('Order', {
      drinkTitle: String,
      drinkDescription: String,
      quantity: Number,
      tableNumber: Number,
    })({
      drinkTitle,
      drinkDescription,
      quantity,
      tableNumber,
    });
    await order.save();
    io.emit('new-order', order);
    res.status(201).send(order);
  } catch (err) {
    console.error('Error saving order:', err.message);
    res.status(500).send({ error: 'Failed to save order' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});