require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/Auth');
const cors = require('cors');
const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());

const PORT = 9001;

const apiV0Router = express.Router();
app.use('/api/v0', apiV0Router);

apiV0Router.use('/auth', authRoutes);

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'Server is live' });
});

const startServer = async () => {
  try {
    // Step 1: Connect to MongoDB
    await connectToMongo();
    console.log('[OK] ===> Connected to MongoDB <=== [OK]');

    // Step 4: Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is live on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit the process with failure code if any connection fails
  }
};

// Start the server by invoking the function
startServer();