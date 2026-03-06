# 📱 Personal Diary App - Navigation Flow

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Check Login Status
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              NOT LOGGED IN        LOGGED IN
                    ↓                   ↓
         ┌──────────────────┐    ┌──────────────┐
         │  WELCOME SCREEN  │    │  HOME SCREEN │
         │                  │    │  (Main App)  │
         │  • App Title     │    └──────────────┘
         │  • College Name  │
         │  • Team Members  │
         │  • [Login]       │
         │  • [Sign Up]     │
         └──────────────────┘
                ↓       ↓
        ┌───────┘       └───────┐
        ↓                       ↓
┌──────────────┐        ┌──────────────┐
│ LOGIN SCREEN │        │ SIGNUP SCREEN│
│              │        │              │
│ • Email      │        │ • Name       │
│ • Password   │        │ • Email      │
│ • [Login]    │←──────→│ • Password   │
│ • Forgot?    │        │ • [Sign Up]  │
└──────────────┘        └──────────────┘
        ↓
        ↓ (Forgot Password)
        ↓
┌──────────────────┐
│ FORGOT PASSWORD  │
│                  │
│ • Email          │
│ • [Send Link]    │
│ • Back to Login  │
└──────────────────┘
        ↓
        ↓ (Success)
        ↓
    [Back to Login]


═══════════════════════════════════════════════════════════════════
                    AFTER SUCCESSFUL LOGIN
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                    MAIN APPLICATION                              │
│                  (Bottom Tab Navigation)                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│  HOME TAB    │      │  SEARCH TAB  │     │  STATS TAB   │
│      🏠      │      │      🔍      │     │      📊      │
└──────────────┘      └──────────────┘     └──────────────┘
        ↓                     ↓                     ↓


═══════════════════════════════════════════════════════════════════
                         HOME SCREEN
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Header: Today's Diary | [Logout]                                │
├─────────────────────────────────────────────────────────────────┤
│  📅 Current Date                                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ College Name & Team Members                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  How are you feeling?                                            │
│  [😊 Happy] [😢 Sad] [😡 Angry] [😌 Calm] [😴 Tired]           │
│                                                                   │
│  Category                                                         │
│  [Personal] [Work] [Travel] [Health] [Other]                    │
│                                                                   │
│  Write your thoughts...                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │  [Text Area - Multi-line input]                          │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [📷 Photo]  [🎤 Voice]                                          │
│                                                                   │
│  [Attached Photos Display]                                       │
│                                                                   │
│  [💾 Save Entry] or [✏️ Update Entry]                           │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                        SEARCH SCREEN
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Header: Search Diary                                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search by text, category, or mood...                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📅 Jan 15, 2025                              😊 Happy    │   │
│  │ [Personal]                                                │   │
│  │ Today was a great day! I finished my...                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📅 Jan 14, 2025                              😌 Calm     │   │
│  │ [Work]                                                    │   │
│  │ Had a productive meeting today...                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [More entries...]                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    (Tap on any entry)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  [← Back]  Entry Detail  [Edit]                                 │
├─────────────────────────────────────────────────────────────────┤
│  📅 January 15, 2025                                             │
│                                                                   │
│  Mood: 😊 Happy                                                  │
│  Category: [Personal]                                            │
│                                                                   │
│  Full entry text displays here...                               │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit.       │
│  Sed do eiusmod tempor incididunt ut labore et dolore magna.    │
│                                                                   │
│  [Attached Photos]                                               │
│  [Photo 1] [Photo 2]                                             │
│                                                                   │
│  ─────────────────────────────────────────────────────────      │
│  EDIT MODE (when Edit button pressed):                          │
│  • Editable mood selection                                      │
│  • Editable category selection                                  │
│  • Editable text area                                           │
│  • [Save Changes] button                                        │
│  • [Cancel] button                                              │
│  ❌ NO DELETE BUTTON                                            │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      STATISTICS SCREEN
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│  Header: Statistics                                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📊 Overview                                              │   │
│  │                                                           │   │
│  │ Total Entries:        25                                 │   │
│  │ This Month:           8                                  │   │
│  │ Longest Streak:       5 days                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 😊 Mood Distribution                                     │   │
│  │                                                           │   │
│  │ 😊 Happy    ████████████████░░░░░░░░  10                │   │
│  │ 😢 Sad      ████████░░░░░░░░░░░░░░░░   5                │   │
│  │ 😡 Angry    ████░░░░░░░░░░░░░░░░░░░░   2                │   │
│  │ 😌 Calm     ████████████░░░░░░░░░░░░   8                │   │
│  │ 😴 Tired    ████░░░░░░░░░░░░░░░░░░░░   3                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📁 Category Distribution                                 │   │
│  │                                                           │   │
│  │ Personal    ████████████████░░░░░░░░  12                │   │
│  │ Work        ████████████░░░░░░░░░░░░   8                │   │
│  │ Travel      ████░░░░░░░░░░░░░░░░░░░░   3                │   │
│  │ Health      ████░░░░░░░░░░░░░░░░░░░░   2                │   │
│  │ Other       ████░░░░░░░░░░░░░░░░░░░░   0                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════

User Actions                Storage (AsyncStorage)
─────────────              ──────────────────────

Sign Up          ──────→   'user' : { name, email, password }
                           
Login            ──────→   'currentUser' : { user data }

Create Entry     ──────→   'entry_YYYY_M_D' : { entry data }
                           'allEntries' : [ array of entries ]

Edit Entry       ──────→   Update 'entry_YYYY_M_D'
                           Update 'allEntries' array

Search           ←──────   Read 'allEntries'

Statistics       ←──────   Read 'allEntries'
                           Calculate metrics

Logout           ──────→   Remove 'currentUser'


═══════════════════════════════════════════════════════════════════
                    SCREEN TRANSITION MAP
═══════════════════════════════════════════════════════════════════

Welcome Screen
    ├─→ Login Screen
    │       ├─→ Forgot Password Screen
    │       │       └─→ Back to Login
    │       └─→ Home Screen (on success)
    │
    └─→ Signup Screen
            └─→ Login Screen (on success)

Home Screen (Main App)
    ├─→ Home Tab
    │       └─→ [Logout] → Welcome Screen
    │
    ├─→ Search Tab
    │       └─→ Entry Detail Screen
    │               └─→ [Edit Mode]
    │                       └─→ [Save] → Back to Search
    │
    └─→ Statistics Tab


═══════════════════════════════════════════════════════════════════
                      FEATURE MATRIX
═══════════════════════════════════════════════════════════════════

Screen              | Create | Read | Update | Delete
─────────────────────────────────────────────────────
Home Screen         |   ✅   |  ✅  |   ✅   |   ❌
Search Screen       |   ❌   |  ✅  |   ❌   |   ❌
Entry Detail Screen |   ❌   |  ✅  |   ✅   |   ❌
Statistics Screen   |   ❌   |  ✅  |   ❌   |   ❌

Note: Delete is intentionally disabled as per requirements


═══════════════════════════════════════════════════════════════════
                    PERMISSION FLOW
═══════════════════════════════════════════════════════════════════

Photo Attachment:
User taps [📷 Photo]
    ↓
Request Photo Library Permission
    ↓
    ├─→ Granted → Open Image Picker → Select Photos → Display
    └─→ Denied → Show Error Message

Voice Recording:
User taps [🎤 Voice]
    ↓
Request Microphone Permission
    ↓
    ├─→ Granted → Start Recording → Stop → Save
    └─→ Denied → Show Error Message


═══════════════════════════════════════════════════════════════════
                    STATE MANAGEMENT
═══════════════════════════════════════════════════════════════════

App.js (Root)
    ├─→ isLoggedIn (boolean)
    ├─→ loading (boolean)
    └─→ Manages authentication state

HomeScreen
    ├─→ entry (string)
    ├─→ mood (string)
    ├─→ category (string)
    ├─→ photos (array)
    ├─→ recording (object)
    ├─→ isEditing (boolean)
    └─→ todayEntry (object)

SearchScreen
    ├─→ searchQuery (string)
    ├─→ allEntries (array)
    └─→ filteredEntries (array)

StatisticsScreen
    └─→ stats (object)
        ├─→ totalEntries
        ├─→ moodCounts
        ├─→ categoryCounts
        ├─→ entriesThisMonth
        └─→ longestStreak


═══════════════════════════════════════════════════════════════════

This diagram shows the complete navigation and data flow of the
Personal Diary Application. All screens are interconnected and
data flows seamlessly through AsyncStorage.

```

## Quick Reference

### Navigation Hierarchy
```
Stack Navigator (Auth)
    ├── Welcome
    ├── Signup
    ├── Login
    └── ForgotPassword

Tab Navigator (Main)
    ├── Home
    ├── Search (Stack)
    │   ├── SearchList
    │   └── EntryDetail
    └── Statistics
```

### Key User Journeys

**First Time User:**
Welcome → Signup → Login → Home → Create Entry

**Returning User:**
Login → Home → View/Edit Today's Entry

**Search Journey:**
Home → Search Tab → Enter Query → Tap Entry → View/Edit

**Analytics Journey:**
Home → Statistics Tab → View Insights

---

**All flows implemented and working! ✅**
