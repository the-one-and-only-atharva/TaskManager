import { createUserClient } from '../config/database.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid access token'
      });
    }

    if (!process.env.SUPABASE_ANON_KEY) {
      console.error('Missing SUPABASE_ANON_KEY environment variable');
      return res.status(500).json({
        error: 'Server misconfiguration',
        message: 'Authentication is not configured on the server'
      });
    }

    const token = authHeader.substring(7);
    const userClient = createUserClient(token);
    
    const { data: { user }, error } = await userClient.auth.getUser();
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided access token is invalid or expired'
      });
    }

    req.user = user;
    req.userClient = userClient;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      if (!process.env.SUPABASE_ANON_KEY) {
        return next();
      }
      const token = authHeader.substring(7);
      const userClient = createUserClient(token);
      
      const { data: { user }, error } = await userClient.auth.getUser();
      
      if (!error && user) {
        req.user = user;
        req.userClient = userClient;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};