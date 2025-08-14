export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      stars: '/api/stars',
      planets: '/api/planets',
      moons: '/api/moons',
      todos: '/api/todos',
      health: '/health',
    },
  });
};