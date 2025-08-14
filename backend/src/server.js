import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import dotenv from 'dotenv';

// Import database config
import { testConnection } from './config/database.js';

// Import routes
import starsRouter from './routes/stars.js';
import planetsRouter from './routes/planets.js';
import moonsRouter from './routes/moons.js';
import todosRouter from './routes/todos.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  res.status(dbStatus ? 200 : 503).json({
    status: dbStatus ? 'OK' : 'Service Unavailable',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus ? 'Connected' : 'Disconnected',
  });
});

// API routes
app.use('/api/stars', starsRouter);
app.use('/api/planets', planetsRouter);
app.use('/api/moons', moonsRouter);
app.use('/api/todos', todosRouter);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'TaskManager API',
    version: '1.0.0',
    description: 'Backend API for Orbital Task Management System',
    documentation: {
      stars: {
        endpoint: '/api/stars',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'Manage star systems (main goals/projects)',
      },
      planets: {
        endpoint: '/api/planets',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'Manage planets (sub-projects within stars)',
      },
      moons: {
        endpoint: '/api/moons',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        description: 'Manage moons (task groups within planets)',
      },
      todos: {
        endpoint: '/api/todos',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        description: 'Manage todos (individual tasks within moons)',
      },
    },
    authentication: 'Bearer token required for all endpoints',
    database: 'Supabase PostgreSQL with Row Level Security',
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your Supabase configuration.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 TaskManager API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌟 API docs: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 CORS origins: ${corsOrigins.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();