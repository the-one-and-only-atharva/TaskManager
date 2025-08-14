import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateUser } from '../middleware/auth.js';
import { createTodoSchema, updateTodoSchema } from '../validation/schemas.js';

const router = express.Router();

// Get all todos for a moon
router.get('/moon/:moonId', authenticateUser, async (req, res, next) => {
  try {
    const { data: todos, error } = await supabase
      .from('todos')
      .select(`
        *,
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('moon_id', req.params.moonId)
      .eq('moons.planets.stars.user_id', req.user.id)
      .order('order_index', { ascending: true });

    if (error) throw error;

    res.json({
      success: true,
      data: todos,
      count: todos.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get single todo by ID
router.get('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { data: todo, error } = await supabase
      .from('todos')
      .select(`
        *,
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('id', req.params.id)
      .eq('moons.planets.stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Todo not found',
          message: 'The requested todo does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
});

// Create new todo
router.post('/', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = createTodoSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    // Verify the moon belongs to the user
    const { data: moon, error: moonError } = await supabase
      .from('moons')
      .select(`
        id,
        planets!inner (
          stars!inner (user_id)
        )
      `)
      .eq('id', value.moon_id)
      .eq('planets.stars.user_id', req.user.id)
      .single();

    if (moonError || !moon) {
      return res.status(404).json({
        error: 'Moon not found',
        message: 'The specified moon does not exist or you do not have access to it',
      });
    }

    const { data: todo, error } = await supabase
      .from('todos')
      .insert([value])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: todo,
      message: 'Todo created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Update todo
router.put('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error: validationError, value } = updateTodoSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.details.map(d => d.message),
      });
    }

    const { data: todo, error } = await supabase
      .from('todos')
      .update(value)
      .eq('id', req.params.id)
      .select(`
        *,
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('moons.planets.stars.user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Todo not found',
          message: 'The requested todo does not exist or you do not have access to it',
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: todo,
      message: 'Todo updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Toggle todo completion
router.patch('/:id/toggle', authenticateUser, async (req, res, next) => {
  try {
    // First get the current todo
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select(`
        completed,
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('id', req.params.id)
      .eq('moons.planets.stars.user_id', req.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          error: 'Todo not found',
          message: 'The requested todo does not exist or you do not have access to it',
        });
      }
      throw fetchError;
    }

    // Toggle the completion status
    const { data: todo, error } = await supabase
      .from('todos')
      .update({ 
        completed: !currentTodo.completed,
        status: !currentTodo.completed ? 'completed' : 'active'
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: todo,
      message: `Todo marked as ${todo.completed ? 'completed' : 'active'}`,
    });
  } catch (error) {
    next(error);
  }
});

// Bulk update todo order
router.patch('/reorder', authenticateUser, async (req, res, next) => {
  try {
    const { todoIds } = req.body;
    
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid data',
        message: 'todoIds must be a non-empty array',
      });
    }

    // Update each todo with its new order index
    const updates = todoIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    const { data: todos, error } = await supabase
      .from('todos')
      .upsert(updates, { onConflict: 'id' })
      .select(`
        *,
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('moons.planets.stars.user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      data: todos,
      message: 'Todo order updated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Delete todo
router.delete('/:id', authenticateUser, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', req.params.id)
      .select(`
        moons!inner (
          planets!inner (
            stars!inner (user_id)
          )
        )
      `)
      .eq('moons.planets.stars.user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;