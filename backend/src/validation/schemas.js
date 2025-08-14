import Joi from 'joi';

// Star validation schemas
export const createStarSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  x: Joi.number().default(0),
  y: Joi.number().default(0),
});

export const updateStarSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  priority: Joi.string().valid('low', 'medium', 'high'),
  x: Joi.number(),
  y: Joi.number(),
});

// Planet validation schemas
export const createPlanetSchema = Joi.object({
  star_id: Joi.string().uuid().required(),
  name: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  status: Joi.string().valid('not_started', 'in_progress', 'blocked', 'done').default('not_started'),
  progress: Joi.number().min(0).max(1).default(0),
  start_date: Joi.date().iso().allow(null),
  due_date: Joi.date().iso().allow(null),
  estimated_time: Joi.string().allow('').max(100),
  risk_level: Joi.string().valid('low', 'medium', 'high').allow(null),
  risk_factors: Joi.string().allow('').max(1000),
  mitigation: Joi.string().allow('').max(1000),
  notes: Joi.string().allow('').max(2000),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
  dependencies: Joi.array().items(Joi.string().uuid()).default([]),
  order_index: Joi.number().integer().min(0).default(0),
});

export const updatePlanetSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  priority: Joi.string().valid('low', 'medium', 'high'),
  status: Joi.string().valid('not_started', 'in_progress', 'blocked', 'done'),
  progress: Joi.number().min(0).max(1),
  start_date: Joi.date().iso().allow(null),
  due_date: Joi.date().iso().allow(null),
  estimated_time: Joi.string().allow('').max(100),
  risk_level: Joi.string().valid('low', 'medium', 'high').allow(null),
  risk_factors: Joi.string().allow('').max(1000),
  mitigation: Joi.string().allow('').max(1000),
  notes: Joi.string().allow('').max(2000),
  tags: Joi.array().items(Joi.string().max(50)),
  dependencies: Joi.array().items(Joi.string().uuid()),
  order_index: Joi.number().integer().min(0),
});

// Moon validation schemas
export const createMoonSchema = Joi.object({
  planet_id: Joi.string().uuid().required(),
  name: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  order_index: Joi.number().integer().min(0).default(0),
});

export const updateMoonSchema = Joi.object({
  name: Joi.string().min(1).max(255),
  description: Joi.string().allow('').max(1000),
  order_index: Joi.number().integer().min(0),
});

// Todo validation schemas
export const createTodoSchema = Joi.object({
  moon_id: Joi.string().uuid().required(),
  text: Joi.string().required().min(1).max(500),
  completed: Joi.boolean().default(false),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical').default('medium'),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived').default('active'),
  due_date: Joi.date().iso().allow(null),
  estimated_hours: Joi.number().min(0).allow(null),
  tags: Joi.array().items(Joi.string().max(50)).default([]),
  notes: Joi.string().allow('').max(1000),
  order_index: Joi.number().integer().min(0).default(0),
});

export const updateTodoSchema = Joi.object({
  text: Joi.string().min(1).max(500),
  completed: Joi.boolean(),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  status: Joi.string().valid('active', 'paused', 'completed', 'archived'),
  due_date: Joi.date().iso().allow(null),
  estimated_hours: Joi.number().min(0).allow(null),
  tags: Joi.array().items(Joi.string().max(50)),
  notes: Joi.string().allow('').max(1000),
  order_index: Joi.number().integer().min(0),
});

// Milestone validation schemas
export const createMilestoneSchema = Joi.object({
  planet_id: Joi.string().uuid().required(),
  name: Joi.string().required().min(1).max(255),
  due_date: Joi.date().iso().allow(null),
  completed: Joi.boolean().default(false),
});

// Outcome validation schemas
export const createOutcomeSchema = Joi.object({
  planet_id: Joi.string().uuid().required(),
  label: Joi.string().required().min(1).max(255),
  target: Joi.string().allow('').max(255),
  achieved: Joi.boolean().default(false),
});

// Link validation schemas
export const createLinkSchema = Joi.object({
  planet_id: Joi.string().uuid().required(),
  title: Joi.string().allow('').max(255),
  url: Joi.string().uri().required().max(500),
});