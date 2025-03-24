const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors'); // Import the cors package
const QRCode = require('qrcode'); // Import the QRCode library

const app = express();
const server = http.createServer(app);

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://saukaevents.vercel.app' // Production frontend
];

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

// Use middleware
app.use(bodyParser.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Connect to MongoDB
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
    const url = `https://saukaevents.vercel.app/order?table=${tableNumber}`;

    // Generate the QR code as a data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    // Send the QR code as a response
    res.status(200).json({ tableNumber, qrCode: qrCodeDataUrl });
  } catch (err) {
    console.error('Error generating QR code:', err.message);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Example order endpoint
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
server.listen(process.env.PORT || 3000, () => {
  console.log('Server is running');
});