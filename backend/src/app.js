const express = require('express');
const cors = require('cors');

const aiRoutes = require('./routes/ai.route.js');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ai', aiRoutes);

module.exports = app;
