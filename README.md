# Personal Diary Application

A complete frontend mobile application built with React Native and Expo for managing personal diary entries.

## Features

### Authentication
- **Welcome Screen**: Displays app title, college name, and team member names
- **Sign Up**: Create account with password validation (min 8 chars, 1 uppercase, 1 special symbol)
- **Login**: Authenticate with email and password
- **Forgot Password**: Request password reset link

### Diary Management
- **Write Entries**: Create daily diary entries with rich content
- **Edit Entries**: Modify existing entries (no delete option as per requirements)
- **Mood Tracking**: Select mood for each entry (Happy, Sad, Angry, Calm, Tired)
- **Categorization**: Organize entries by category (Personal, Work, Travel, Health, Other)
- **Photo Attachments**: Add multiple photos to entries
- **Voice Notes**: Record audio notes for entries
- **Search**: Find entries by text, category, or mood
- **Statistics**: View analytics including:
  - Total entries count
  - Entries this month
  - Longest writing streak
  - Mood distribution
  - Category distribution

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**: AsyncStorage (local storage)
- **Media**: Expo Image Picker, Expo AV
- **UI**: Custom components with modern design

## Project Structure

```
d:\Dairy/
├── App.js                          # Main app entry with authentication flow
├── screens/
│   ├── WelcomeScreen.js           # Welcome/landing screen
│   ├── SignupScreen.js            # User registration
│   ├── LoginScreen.js             # User authentication
│   ├── ForgotPasswordScreen.js    # Password reset
│   ├── HomeScreen.js              # Main diary entry screen
│   ├── SearchScreen.js            # Search diary entries
│   ├── EntryDetailScreen.js       # View/edit individual entry
│   └── StatisticsScreen.js        # Analytics and statistics
├── navigation/
│   └── MainNavigator.js           # Bottom tab navigation
├── utils/
│   └── constants.js               # App constants (college, team info)
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
└── babel.config.js                # Babel configuration

```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Steps

1. **Navigate to project directory**:
   ```bash
   cd d:\Dairy
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**:
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **iOS**: Press `i` in terminal or scan QR code with Expo Go app (Mac only)
   - **Web**: Press `w` in terminal

## Usage Guide

### First Time Setup
1. Launch the app to see the Welcome Screen
2. Tap "Sign Up" to create an account
3. Enter your name, email, and password (must meet requirements)
4. After successful signup, login with your credentials

### Writing Diary Entries
1. After login, you'll see the Home screen
2. Select your mood and category
3. Write your thoughts in the text area
4. Optionally add photos or voice notes
5. Tap "Save Entry" to save
6. Edit anytime by returning to Home screen

### Searching Entries
1. Navigate to Search tab
2. Enter keywords to search by text, mood, or category
3. Tap any entry to view details
4. Edit entries from the detail screen

### Viewing Statistics
1. Navigate to Statistics tab
2. View total entries, monthly count, and streak
3. See mood and category distributions

## Key Features Implementation

### Password Validation
- Minimum 8 characters
- At least one uppercase letter
- At least one special symbol (!@#$%^&*(),.?":{}|<>)

### Data Persistence
- All data stored locally using AsyncStorage
- Entries organized by date
- No backend required (mock authentication)

### No Delete Option
- As per requirements, entries can only be edited, not deleted
- Users can modify existing entries anytime

### Navigation
- Bottom tabs for main sections (Home, Search, Statistics)
- Stack navigation for detail views
- Logout option in Home screen header

## Customization

### Update Team Information
Edit `utils/constants.js`:
```javascript
export const APP_INFO = {
  appName: 'Personal Diary App',
  collegeName: 'Your College Name',
  teamMembers: [
    'Member 1',
    'Member 2',
    'Member 3',
    'Member 4'
  ]
};
```

### Modify Colors
Update color values in screen StyleSheets:
- Primary: `#3498db` (blue)
- Success: `#27ae60` (green)
- Background: `#f5f5f5` (light gray)

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx expo start -c
   ```

2. **Dependencies not found**:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **AsyncStorage warnings**:
   - These are normal and don't affect functionality
   - Data persists correctly

4. **Image picker not working**:
   - Ensure permissions are granted on device
   - Check app.json has correct permissions

## Future Enhancements (Backend Integration)

When ready to add backend:
- Replace AsyncStorage with API calls
- Implement real authentication with JWT
- Add cloud storage for photos
- Enable sync across devices
- Add backup/restore functionality

## Notes

- This is a FRONTEND-ONLY application
- Uses mock authentication (no real backend)
- Data stored locally on device
- Photos stored as local URIs
- Voice recordings stored temporarily

## License

This project is created for educational purposes.

## Team

- College: ABC College of Engineering
- Team Members: John Doe, Jane Smith, Mike Johnson, Sarah Williams

---

**Built with ❤️ using React Native & Expo**
