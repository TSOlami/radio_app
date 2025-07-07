# 🎵 Farmer's Radio App - Django Backend

A comprehensive Django REST API backend for a farmer-focused radio streaming application. This backend provides all the necessary endpoints and functionality for managing radio stations, user profiles, events, blog content, and more.

## 🚀 Features

### Core Functionality
- **Radio Station Management**: Browse, search, and filter radio stations by category, country, language, and quality
- **User Profiles**: User authentication, profile management, and favorite stations
- **Live Events**: Schedule and manage live radio events with real-time status
- **Blog System**: Content management with featured posts and tagging
- **Listening History**: Track user listening patterns and statistics
- **Contact System**: Handle user inquiries and feedback

### API Endpoints

#### Radio Stations
- `GET /api/stations/` - List all active stations
- `GET /api/stations/{id}/` - Get station details
- `GET /api/stations/popular/` - Get most popular stations
- `GET /api/stations/featured/` - Get featured stations
- `POST /api/stations/{id}/toggle_favorite/` - Toggle favorite status (auth required)
- `POST /api/stations/{id}/increment_listeners/` - Increment listener count
- `POST /api/stations/{id}/decrement_listeners/` - Decrement listener count

#### Categories
- `GET /api/categories/` - List all categories with station counts

#### User Profile
- `GET /api/profile/me/` - Get current user profile (auth required)
- `GET /api/profile/favorites/` - Get user's favorite stations (auth required)
- `PUT /api/profile/{id}/` - Update profile (auth required)

#### Events
- `GET /api/events/` - List all events
- `GET /api/events/upcoming/` - Get upcoming events
- `GET /api/events/live/` - Get currently live events
- `GET /api/events/featured/` - Get featured events

#### Blog
- `GET /api/blog/` - List published blog posts
- `GET /api/blog/{slug}/` - Get blog post by slug
- `GET /api/blog/featured/` - Get featured posts
- `GET /api/blog/recent/` - Get recent posts

#### Listening History
- `GET /api/history/` - Get user's listening history (auth required)
- `POST /api/history/` - Add listening session (auth required)
- `GET /api/history/stats/` - Get listening statistics (auth required)

#### Contact
- `POST /api/contact/` - Submit contact form

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

### Quick Start

1. **Clone and setup virtual environment**:
```bash
python -m venv radio_env
source radio_env/bin/activate  # On Windows: radio_env\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Environment Configuration**:
Create a `.env` file with:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

4. **Database Setup**:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Load Sample Data**:
```bash
python manage.py populate_sample_data
```

6. **Run Development Server**:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Admin Panel
Access the admin panel at `http://localhost:8000/admin/`
- Username: `admin`
- Password: `admin123`

## 📊 Database Models

### Core Models
- **Category**: Radio station categories (Agriculture, News, Music, etc.)
- **RadioStation**: Radio station information with streaming URLs
- **UserProfile**: Extended user profiles with favorites and preferences
- **Event**: Scheduled radio events and shows
- **BlogPost**: Content management for articles and news
- **ListeningHistory**: User listening session tracking
- **Contact**: Contact form submissions

### Key Features
- **Automatic timestamps** on all models
- **Soft delete** capabilities where appropriate
- **Rich metadata** for better organization
- **Optimized queries** with select_related and prefetch_related

## 🔧 Configuration

### Settings Overview
- **REST Framework**: Configured with pagination and authentication
- **CORS**: Enabled for frontend integration
- **Media Files**: Configured for image uploads
- **Database**: SQLite for development (easily configurable for production)

### Environment Variables
- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts

## 🧪 Testing

Run the test suite:
```bash
python manage.py test
```

The test suite includes:
- Model tests for data integrity
- API endpoint tests
- Authentication tests
- Business logic tests

## 📱 Frontend Integration

This backend is designed to work with various frontend frameworks:
- **React/Next.js**: Full SPA support with REST API
- **Vue.js**: Compatible with Vuex for state management
- **Mobile Apps**: React Native, Flutter, or native apps
- **Web Components**: Can be integrated with any modern web framework

### CORS Configuration
CORS is pre-configured for common development ports:
- `http://localhost:3000` (React default)
- `http://127.0.0.1:3000`

## 🚀 Production Deployment

### Environment Setup
1. Set `DEBUG=False` in production
2. Configure proper `SECRET_KEY`
3. Set up production database (PostgreSQL recommended)
4. Configure static file serving
5. Set up media file storage (AWS S3, etc.)

### Security Considerations
- Use HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Use environment variables for sensitive data
- Regular security updates

## 📈 Performance Optimization

### Database Optimization
- Indexes on frequently queried fields
- Optimized querysets with select_related/prefetch_related
- Database connection pooling for production

### Caching Strategy
- Redis for session storage and caching
- Cache frequently accessed data
- API response caching for static content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test files for usage examples

## 🔄 API Versioning

The API is currently at version 1. Future versions will maintain backward compatibility where possible.

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [API Testing with Postman](https://www.postman.com/)

---

Built with ❤️ for the farming community 🌾