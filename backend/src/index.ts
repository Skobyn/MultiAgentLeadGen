import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Import routes
import apiRoutes from './api/routes';
import { setupErrorHandlers } from './utils/errorHandler';
import logger from './utils/logger';

// Create Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Setup Socket.io connections
io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`);

  // Handle chatbot messages
  socket.on('chat:message', (data) => {
    // In a real app, this would process the message through NLP
    // and generate appropriate responses
    logger.info(`Received message: ${JSON.stringify(data)}`);
    
    // Mock response - in production, this would call the AI service
    setTimeout(() => {
      socket.emit('chat:response', {
        message: `This is a mock response to: ${data.message}`,
        timestamp: new Date().toISOString(),
      });
    }, 1000);
  });

  // Handle lead generation status updates
  socket.on('leads:status', (data) => {
    logger.info(`Lead generation status update: ${JSON.stringify(data)}`);
    // In production, this would emit updates to the client about
    // ongoing lead generation processes
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
setupErrorHandlers(app);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leadgen';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

export default app;