import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateUser } from '../middleware/auth.js';
import { createPlanetSchema, updatePlanetSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all planets for a star
router.get('/star/:starId', authenticateUser, async (req, res, next) => {
  try {
    // First verify the star belongs to the user
    const { data: star, error: starError } = await supabase
      .from('stars')
      .select('id')
      .eq('id', req.params.starId)
      .eq('user_id', req.user.id)
      .single();

    if (starError || !star) {
      return res.status(404).json({
        error: 'Star not found',
        message: 'The requested star does not exist or you do not have access to it',
      });
    }

    const { data: planets, error } = await supabase
      .from('planets')
      .select(`
        *,
        moons (
          *,
          todos (*)
        ),
        milestones (*),
        outcomes (*),
        links (*)
      `)
      .eq('star_id', req.params.starId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: planets,
      count: planets.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get single planet by ID
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { data: planet, error } = await supabase
      .from('planets')
      .select(`
        *,
        stars!inner (user_id),
        moons (
          *,
          todos (*)
        ),
        milestones (*),
        outcomes (*),
        links (*)
      `)
      .eq('id', req.params.id)
      .eq('stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Planet not found',
          message: 'The requested planet does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: planet,
    });
  } catch (error) {
    next(error);
  }
});

// Create new planet
router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = createPlanetSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    // Verify the star belongs to the user
    const { data: star, error: starError } = await supabase
      .from('stars')
      .select('id')
      .eq('id', value.star_id)
      .eq('user_id', req.user.id)
      .single();

    if (starError || !star) {
      return res.status(404).json({
        error: 'Star not found',
        message: 'The specified star does not exist or you do not have access to it',
      });
    }

    const { data: planet, error } = await supabase
      .from('planets')
      .insert([value])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: planet,
      message: 'Planet created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update planet
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = updatePlanetSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    const { data: planet, error } = await supabase
      .from('planets')
      .update(value)
      .eq('id', req.params.id)
      .select(`
        *,
        stars!inner (user_id)
      `)
      .eq('stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Planet not found',
          message: 'The requested planet does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: planet,
      message: 'Planet updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete planet
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('planets')
      .delete()
      .eq('id', req.params.id)
      .select('stars!inner (user_id)')
      .eq('stars.user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Planet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;