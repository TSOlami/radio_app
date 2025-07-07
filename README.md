# 🎵 Farmer's Radio App - Django Backend

A comprehensive Django radio streaming application for farmers with both REST API backend and web frontend. This application provides radio station management, user profiles, events, blog content, audio streaming, and real-time features.

## 🚀 Features

### Core Functionality
- **🎵 Audio Streaming**: Real-time radio streaming with HTML5 audio player
- **📻 Radio Station Management**: Browse, search, and filter stations by category, country, language, and quality
- **👤 User Profiles**: User authentication, profile management, and favorite stations
- **📅 Live Events**: Schedule and manage live radio events with real-time status updates
- **📝 Blog System**: Content management with featured posts and tagging
- **📊 Listening History**: Track user listening patterns and detailed statistics
- **📱 Mobile-Responsive**: Wikipedia-style design that works on all devices
- **⭐ Favorites System**: Save and manage favorite radio stations
- **🔍 Advanced Search**: Search stations, events, and blog posts
- **📈 Real-time Features**: Live event status updates and listener counts

### Frontend Features
- **🎧 Audio Player**: Full-featured player with play/pause, volume control, and station info
- **📊 User Dashboard**: Personal statistics, favorites, and listening history
- **🔄 Real-time Updates**: Live events update automatically every 30 seconds
- **⌨️ Keyboard Shortcuts**: Spacebar to play/pause audio
- **📱 Mobile-First Design**: Responsive layout for all screen sizes
- **🎨 Wikipedia-style UI**: Clean, accessible design with no colors

### API Endpoints (REST)

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

### Web Interface
- `/` - Home page with featured content and live events
- `/stations/` - Browse and search radio stations
- `/events/` - View live and upcoming events
- `/blog/` - Read agricultural news and articles
- `/dashboard/` - User dashboard (requires login)
- `/history/` - Full listening history (requires login)
- `/login/` - User login
- `/register/` - User registration

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

The application will be available at `http://localhost:8000/`

### Admin Panel
Access the admin panel at `http://localhost:8000/admin/`
- Username: `admin`
- Password: `admin123`

## 🧪 Testing the Application

### 1. **Web Interface Testing**

**Home Page (`http://localhost:8000/`)**
- View featured radio stations
- See live events (if any)
- Read recent blog posts
- Check platform statistics

**Radio Stations (`http://localhost:8000/stations/`)**
- Browse all available stations
- Use search and filters (category, country, quality)
- Click ▶ button to play stations
- Test audio streaming functionality
- Add/remove favorites (requires login)

**Events Page (`http://localhost:8000/events/`)**
- View live events (marked with red indicator)
- See upcoming events schedule
- Page auto-refreshes every 30 seconds

**Blog (`http://localhost:8000/blog/`)**
- Read featured articles
- Search through blog posts
- Click on articles to read full content

### 2. **User Account Testing**

**Registration (`http://localhost:8000/register/`)**
- Create a new account
- Fill in optional profile information
- Automatic login after registration

**Login (`http://localhost:8000/login/`)**
- Use demo account: `admin` / `admin123`
- Or create your own account

**Dashboard (`http://localhost:8000/dashboard/`)**
- View personal statistics
- Manage favorite stations
- See listening history
- Update profile information

### 3. **Audio Player Testing**

**Basic Playback**
- Click ▶ on any station to start streaming
- Button changes to ⏸ when playing
- Use volume slider to adjust audio
- Click ⏹ to stop playback

**Advanced Features**
- Switch between stations (previous stops automatically)
- Use spacebar for play/pause (when not in input fields)
- Player shows current station name
- Listener count updates when you start/stop

### 4. **Mobile Testing**
- Open on mobile device or use browser dev tools
- Test responsive navigation menu
- Verify audio player works on mobile
- Check table scrolling on small screens

### 5. **Real-time Features Testing**

**Live Events**
- Events page auto-refreshes every 30 seconds
- Live events show red pulsing indicator
- Status updates automatically

**Listener Counts**
- Start playing a station
- Check listener count increases
- Stop playing and count decreases

### 6. **Search and Filter Testing**

**Station Filters**
- Filter by category (Agriculture, News, Music, etc.)
- Filter by country
- Filter by audio quality
- Combine multiple filters
- Use text search

**Blog Search**
- Search articles by title or content
- Test with various keywords

### 7. **Favorites System Testing**
- Login to your account
- Click ☆ next to stations to add favorites
- Star changes to ★ when favorited
- View favorites in dashboard
- Remove favorites by clicking ★

### 8. **Listening History Testing**
- Play various stations for different durations
- Check dashboard for recent history
- View full history page
- Verify statistics are calculated correctly

### 9. **Admin Panel Testing**
- Login at `http://localhost:8000/admin/`
- Add new radio stations
- Create events and blog posts
- Manage user accounts
- View contact form submissions

### 10. **API Testing**
You can also test the REST API directly:

```bash
# Get all stations
curl http://localhost:8000/api/stations/

# Get live events
curl http://localhost:8000/api/events/live/

# Get blog posts
curl http://localhost:8000/api/blog/
```

## 🎯 Sample Test Scenarios

### Scenario 1: New User Experience
1. Visit home page
2. Browse featured stations
3. Click play on a station
4. Register for an account
5. Add stations to favorites
6. Check dashboard statistics

### Scenario 2: Content Discovery
1. Go to stations page
2. Filter by "Agriculture" category
3. Search for "farming"
4. Play a relevant station
5. Read related blog articles
6. Check upcoming agricultural events

### Scenario 3: Mobile User
1. Open on mobile device
2. Navigate through responsive menu
3. Test audio playback on mobile
4. Add favorites using touch interface
5. View dashboard on small screen

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
- **Templates**: Django template system with Wikipedia-style CSS
- **Static Files**: Served during development

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
- Template rendering tests

## 🎨 Design Philosophy

The frontend follows Wikipedia's design principles:
- **No colors**: Clean, professional appearance
- **Typography-focused**: Clear hierarchy with proper fonts
- **Accessibility**: High contrast, keyboard navigation
- **Performance**: Minimal CSS, fast loading
- **Mobile-first**: Responsive design for all devices

## 🔊 Audio Streaming

The application uses HTML5 Audio API for streaming:
- **Format Support**: MP3, AAC, OGG streams
- **Cross-browser**: Works on all modern browsers
- **Mobile Support**: iOS and Android compatible
- **Error Handling**: Graceful fallback for failed streams
- **Volume Control**: User-adjustable volume
- **Real-time Updates**: Listener count tracking

## 🚀 Production Deployment

### Environment Setup
1. Set `DEBUG=False` in production
2. Configure proper `SECRET_KEY`
3. Set up production database (PostgreSQL recommended)
4. Configure static file serving
5. Set up media file storage (AWS S3, etc.)
6. Configure proper CORS origins
7. Set up SSL/HTTPS for audio streaming

### Security Considerations
- Use HTTPS in production
- Configure proper CORS origins
- Set up rate limiting
- Use environment variables for sensitive data
- Regular security updates
- Secure audio stream URLs

## 📈 Performance Optimization

### Database Optimization
- Indexes on frequently queried fields
- Optimized querysets with select_related/prefetch_related
- Database connection pooling for production
- Efficient pagination for large datasets

### Caching Strategy
- Redis for session storage and caching
- Cache frequently accessed data
- API response caching for static content
- Template fragment caching

### Frontend Optimization
- Minimal CSS (single file)
- Compressed audio streams
- Lazy loading for images
- Efficient JavaScript (vanilla JS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 🐛 Troubleshooting

### Audio Issues
- **No sound**: Check browser audio permissions
- **Stream fails**: Verify stream URL is accessible
- **Mobile issues**: Ensure HTTPS in production

### Login Issues
- **Can't login**: Use demo account `admin`/`admin123`
- **Registration fails**: Check password requirements
- **Session expires**: Re-login to continue

### Performance Issues
- **Slow loading**: Check database queries in admin
- **High memory**: Restart development server
- **Audio lag**: Check internet connection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test files for usage examples
- Test with the demo account first

## 🔄 API Versioning

The API is currently at version 1. Future versions will maintain backward compatibility where possible.

## 🎵 Audio Formats Supported

- **MP3**: Most common format, widely supported
- **AAC**: High quality, good compression
- **OGG**: Open source format
- **HLS**: HTTP Live Streaming for better performance

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [HTML5 Audio API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---
