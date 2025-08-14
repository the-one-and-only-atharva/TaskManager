import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateUser } from '../middleware/auth.js';
import { createStarSchema, updateStarSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all stars for authenticated user
router.get('/', authenticateUser, async (req, res, next) => {
  try {
    const { data: stars, error } = await supabase
      .from('stars')
      .select(`
        *,
        planets (
          *,
          moons (
            *,
            todos (*)
          ),
          milestones (*),
          outcomes (*),
          links (*)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: stars,
      count: stars.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get single star by ID
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { data: star, error } = await supabase
      .from('stars')
      .select(`
        *,
        planets (
          *,
          moons (
            *,
            todos (*)
          ),
          milestones (*),
          outcomes (*),
          links (*)
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Star not found',
          message: 'The requested star does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: star,
    });
  } catch (error) {
    next(error);
  }
});

// Create new star
router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = createStarSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    const { data: star, error } = await supabase
      .from('stars')
      .insert([{
        ...value,
        user_id: req.user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: star,
      message: 'Star created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update star
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = updateStarSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    const { data: star, error } = await supabase
      .from('stars')
      .update(value)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Star not found',
          message: 'The requested star does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: star,
      message: 'Star updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete star
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('stars')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Star deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;