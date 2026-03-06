# Backend Setup Guide

## MongoDB Atlas Connection

Your diary app is now connected to MongoDB Atlas with the following credentials:
- **Database**: diaryApp
- **Username**: lathakruthu_db_user
- **Password**: qREmCcvz0S0lBOi8
- **Cluster**: cluster0.bwashpk.mongodb.net

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Backend

Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Login user

### Diary Entries
- `POST /api/entries` - Create new entry
- `GET /api/entries` - Get all user entries
- `GET /api/entries/today` - Get today's entry
- `PUT /api/entries/:id` - Update entry
- `GET /api/entries/search?query=text` - Search entries

## Frontend Configuration

The React Native app is configured to connect to `http://localhost:3000/api`

For testing on physical device, update the API_URL in `utils/api.js`:
```javascript
const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';
```

## Testing

1. Start the backend server
2. Start the React Native app: `npm start`
3. Create an account and start using the app

All data will now be stored in MongoDB Atlas instead of local AsyncStorage.
