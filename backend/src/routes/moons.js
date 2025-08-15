import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { createMoonSchema, updateMoonSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all moons for a planet
router.get('/planet/:planetId', authenticateUser, async (req, res, next) => {
  try {
    const { data: moons, error } = await req.userClient
      .from('moons')
      .select(`
        *,
        todos (*),
        planets!inner (
          stars!inner (user_id)
        )
      `)
      .eq('planet_id', req.params.planetId)
      .eq('planets.stars.user_id', req.user.id)
      .order('order_index', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: moons,
      count: moons.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get single moon by ID
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { data: moon, error } = await req.userClient
      .from('moons')
      .select(`
        *,
        todos (*),
        planets!inner (
          stars!inner (user_id)
        )
      `)
      .eq('id', req.params.id)
      .eq('planets.stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Moon not found',
          message: 'The requested moon does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: moon,
    });
  } catch (error) {
    next(error);
  }
});

// Create new moon
router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = createMoonSchema.validate(req.body, { stripUnknown: true });
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    // Verify the planet belongs to the user
    const { data: planet, error: planetError } = await req.userClient
      .from('planets')
      .select(`
        id,
        stars!inner (user_id)
      `)
      .eq('id', value.planet_id)
      .eq('stars.user_id', req.user.id)
      .single();

    if (planetError || !planet) {
      return res.status(404).json({
        error: 'Planet not found',
        message: 'The specified planet does not exist or you do not have access to it',
      });
    }

    const { data: moon, error } = await req.userClient
      .from('moons')
      .insert([value])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: moon,
      message: 'Moon created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update moon
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = updateMoonSchema.validate(req.body, { stripUnknown: true });
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    const { data: moon, error } = await req.userClient
      .from('moons')
      .update(value)
      .eq('id', req.params.id)
      .select(`
        *,
        planets!inner (
          stars!inner (user_id)
        )
      `)
      .eq('planets.stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Moon not found',
          message: 'The requested moon does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: moon,
      message: 'Moon updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete moon
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error } = await req.userClient
      .from('moons')
      .delete()
      .eq('id', req.params.id)
      .select(`
        planets!inner (
          stars!inner (user_id)
        )
      `)
      .eq('planets.stars.user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Moon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;