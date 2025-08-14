# TaskManager Backend API

A comprehensive REST API for the TaskManager orbital task management system, built with Node.js, Express, and Supabase.

## 🚀 Features

- **Hierarchical Task Management**: Stars → Planets → Moons → Todos
- **User Authentication**: Secure JWT-based authentication with Supabase
- **Row Level Security**: Database-level security ensuring users only access their data
- **Real-time Capabilities**: Built on Supabase for real-time updates
- **Comprehensive Validation**: Input validation with Joi schemas
- **RESTful API**: Clean, consistent API design
- **Error Handling**: Comprehensive error handling and logging
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Configurable cross-origin resource sharing

## 📦 Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the migration file in the Supabase SQL editor:
     ```sql
     -- Copy and paste the contents of supabase/migrations/create_taskmanager_schema.sql
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🌟 API Endpoints

### Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_supabase_access_token>
```

### Stars (Main Goals/Projects)
- `GET /api/stars` - Get all stars for authenticated user
- `GET /api/stars/:id` - Get single star with nested data
- `POST /api/stars` - Create new star
- `PUT /api/stars/:id` - Update star
- `DELETE /api/stars/:id` - Delete star

### Planets (Sub-projects)
- `GET /api/planets/star/:starId` - Get all planets for a star
- `GET /api/planets/:id` - Get single planet with nested data
- `POST /api/planets` - Create new planet
- `PUT /api/planets/:id` - Update planet
- `DELETE /api/planets/:id` - Delete planet

### Moons (Task Groups)
- `GET /api/moons/planet/:planetId` - Get all moons for a planet
- `GET /api/moons/:id` - Get single moon with todos
- `POST /api/moons` - Create new moon
- `PUT /api/moons/:id` - Update moon
- `DELETE /api/moons/:id` - Delete moon

### Todos (Individual Tasks)
- `GET /api/todos/moon/:moonId` - Get all todos for a moon
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion
- `PATCH /api/todos/reorder` - Bulk update todo order
- `DELETE /api/todos/:id` - Delete todo

### Utility
- `GET /health` - Health check endpoint
- `GET /api` - API documentation

## 📊 Data Structure

### Star
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "string",
  "description": "string",
  "priority": "low|medium|high",
  "x": "number",
  "y": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "planets": [...]
}
```

### Planet
```json
{
  "id": "uuid",
  "star_id": "uuid",
  "name": "string",
  "description": "string",
  "priority": "low|medium|high",
  "status": "not_started|in_progress|blocked|done",
  "progress": "number (0-1)",
  "start_date": "date",
  "due_date": "date",
  "estimated_time": "string",
  "risk_level": "low|medium|high",
  "risk_factors": "string",
  "mitigation": "string",
  "notes": "string",
  "tags": ["string"],
  "dependencies": ["uuid"],
  "order_index": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "moons": [...],
  "milestones": [...],
  "outcomes": [...],
  "links": [...]
}
```

### Moon
```json
{
  "id": "uuid",
  "planet_id": "uuid",
  "name": "string",
  "description": "string",
  "order_index": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "todos": [...]
}
```

### Todo
```json
{
  "id": "uuid",
  "moon_id": "uuid",
  "text": "string",
  "completed": "boolean",
  "priority": "low|medium|high|critical",
  "status": "active|paused|completed|archived",
  "due_date": "date",
  "estimated_hours": "number",
  "tags": ["string"],
  "notes": "string",
  "order_index": "number",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level security ensuring users can only access their own data
- **JWT Authentication**: Secure token-based authentication via Supabase
- **Input Validation**: Comprehensive validation using Joi schemas
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Helmet.js**: Security headers for Express applications

## 🛠️ Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (placeholder)

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Supabase configuration
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── notFound.js          # 404 handler
│   ├── routes/
│   │   ├── stars.js             # Star endpoints
│   │   ├── planets.js           # Planet endpoints
│   │   ├── moons.js             # Moon endpoints
│   │   └── todos.js             # Todo endpoints
│   ├── validation/
│   │   └── schemas.js           # Joi validation schemas
│   └── server.js                # Main server file
├── supabase/
│   └── migrations/
│       └── create_taskmanager_schema.sql
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
CORS_ORIGINS=https://your-frontend-domain.com
```

### Deployment Platforms
This API can be deployed to:
- **Vercel** (recommended for Node.js APIs)
- **Railway**
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "count": 10
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": ["Validation error details..."]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see the LICENSE file for details.