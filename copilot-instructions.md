# Copilot Instructions for OliveShop E-Commerce Implementation

## Project Overview
Transform OliveShop from a static HTML/CSS/JS website into a fully functional e-commerce platform with complete user authentication, product management, shopping cart, checkout, and order management systems.

## Core Implementation Rules

### Complete Feature Implementation Rule
Every feature is considered COMPLETE only when ALL of the following components are implemented:

1. ✅ **Frontend** - User interface and user experience
2. ✅ **Backend** - Server-side logic and API endpoints
3. ✅ **Database** - Data models, schemas, and migrations
4. ✅ **Integration** - Frontend-Backend-Database connectivity
5. ✅ **Testing** - Unit tests, integration tests, and E2E tests

**NO FEATURE SHALL BE MARKED COMPLETE WITHOUT ALL FIVE COMPONENTS**

## Development Workflow

### 1. Feature Development Order
- Follow the implementation plan strictly
- Complete one feature entirely before moving to the next
- Do not skip any component (Frontend → Backend → Database → Integration → Testing)

### 2. Code Quality Standards
- Write clean, readable, and maintainable code
- Follow consistent naming conventions
- Add comprehensive comments and documentation
- Implement proper error handling
- Use environment variables for sensitive data

### 3. Security First
- Never store passwords in plain text (use bcrypt/argon2)
- Implement JWT for authentication
- Validate all user inputs (client and server side)
- Prevent SQL injection, XSS, CSRF attacks
- Use HTTPS in production
- Implement rate limiting to prevent abuse

### 4. Database Practices
- Design normalized database schemas
- Use migrations for schema changes
- Index frequently queried columns
- Implement proper foreign key relationships
- Use transactions for critical operations

### 5. API Development
- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error response format
- Add request validation middleware
- Document all endpoints
- Version your APIs (e.g., /api/v1/)

### 6. Frontend Standards
- Responsive design (mobile-first approach)
- Cross-browser compatibility
- Accessibility (WCAG 2.1 guidelines)
- Progressive enhancement
- Loading states and error messages
- Form validation with user-friendly messages

### 7. Testing Requirements
Each feature must include:
- **Unit Tests**: Test individual functions/methods
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows
- **Minimum 80% code coverage**

### 8. Git Workflow
- Create feature branches (feature/feature-name)
- Write descriptive commit messages
- Create pull requests for code review
- Merge only after all tests pass
- Tag releases appropriately

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- React.js (for dynamic components)
- Bootstrap 5 or Tailwind CSS
- Axios for API calls
- Form validation libraries

### Backend
- **Primary**: Node.js + Express.js
- **Alternative**: Python + Flask/Django
- JWT for authentication
- bcrypt for password hashing
- Express-validator for input validation
- Multer for file uploads

### Database
- **Primary**: PostgreSQL
- **Caching**: Redis
- **ORM**: Sequelize (Node.js) or SQLAlchemy (Python)

### Payment Integration
- Stripe (primary)
- PayPal (secondary)

### Email Service
- SendGrid or AWS SES

### File Storage
- Cloudinary or AWS S3

### Testing
- Jest (unit & integration tests)
- Supertest (API testing)
- Cypress or Selenium (E2E tests)

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS/Heroku for deployment

## File Structure

```
olivershop/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── shop.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── styles/
│   ├── css/
│   ├── js/
│   └── images/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── config/
│   ├── tests/
│   ├── package.json
│   └── server.js
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/
│   ├── API.md
│   ├── DATABASE_SCHEMA.md
│   └── USER_GUIDE.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── copilot-instructions.md
└── implementation-plan.md
```

## Environment Variables Template

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oliveshop_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@olivershop.com

# Payment
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": []
  }
}
```

## Database Naming Conventions
- Tables: plural, snake_case (e.g., `users`, `order_items`)
- Columns: snake_case (e.g., `first_name`, `created_at`)
- Primary keys: `id`
- Foreign keys: `{table_name}_id` (e.g., `user_id`)
- Timestamps: `created_at`, `updated_at`

## Code Style
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await instead of callbacks
- Handle errors gracefully
- Log important operations
- Comment complex logic

## Documentation Requirements
For each feature, document:
1. Purpose and functionality
2. API endpoints (method, route, parameters, response)
3. Database schema changes
4. Frontend components and flows
5. Testing scenarios
6. Known limitations or issues

## Performance Guidelines
- Implement pagination for large datasets
- Use database indexing
- Cache frequently accessed data (Redis)
- Optimize images (lazy loading, compression)
- Minify CSS/JS in production
- Use CDN for static assets

## Accessibility Requirements
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Alt text for images

## Monitoring & Logging
- Log all errors with stack traces
- Track important user actions
- Monitor API response times
- Set up alerts for critical failures
- Use proper log levels (error, warn, info, debug)

## Deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Static assets optimized
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Backup strategy implemented
- [ ] Monitoring tools configured
- [ ] Error tracking enabled
- [ ] Documentation updated

## Support & Maintenance
- Monitor application logs daily
- Review and respond to user feedback
- Keep dependencies updated
- Regular security audits
- Database backup and recovery testing
- Performance optimization reviews

---

**Last Updated**: 2025-11-08
**Project Start Date**: 2025-11-08
**Current Status**: Planning Phase
**Next Milestone**: Database Setup & Foundation
