# Contest Tracker
Here Is Video Link :- https://www.loom.com/share/14aeeb38067a450dad47c5938d9eafb0?sid=bd6fd771-d942-4982-93cc-ed394f7a39b5
A MERN stack application that tracks competitive programming contests from various platforms and manages their solutions.

## Features

- **Contest Tracking**: Automatically fetches contests from:
  - Codeforces
  - CodeChef
  - LeetCode

- **Real-time Information**:
  - Contest dates and times
  - Time remaining before contest start
  - Contest duration
  - Contest status (upcoming, ongoing, past)

- **Filtering**:
  - Filter contests by platform
  - Filter by status (upcoming, ongoing, past)
  - View bookmarked contests

- **Solution Management**:
  - Automatic fetching of solutions from YouTube playlists
  - Manual solution linking capability
  - View all contest solutions

- **Responsive Design**:
  - Mobile-friendly interface
  - Tablet support
  - Dark/Light mode toggle

## Tech Stack

- **Frontend**:
  - React.js
  - Redux for state management
  - Responsive CSS
  - Theme switching capability

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - YouTube Data API integration

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contest-tracker
YOUTUBE_API_KEY=your_youtube_api_key
CODEFORCES_PLAYLIST_ID=your_playlist_id
CODECHEF_PLAYLIST_ID=your_playlist_id
LEETCODE_PLAYLIST_ID=your_playlist_id
```

4. Start the servers:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

## API Endpoints

### Contests
- `GET /api/contests` - Get all contests with optional filters
- `GET /api/contests/bookmarked` - Get bookmarked contests
- `PATCH /api/contests/:id/bookmark` - Toggle contest bookmark
- `GET /api/contests/:id/videos` - Get related videos for a contest

### Solutions
- `POST /api/contests/:id/solution` - Add solution to a contest
- `GET /api/solutions` - Get all contest solutions

## Data Models

### Contest
```javascript
{
  name: String,
  url: String,
  platform: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
  isBookmarked: Boolean,
  status: String,
  solutionVideo: {
    youtubeId: String,
    title: String,
    addedAt: Date,
    addedBy: String
  }
}
```

## Features in Detail

### Contest Auto-Update
- Contests are automatically fetched every hour
- Status is automatically updated based on current time
- New contests are added to the database
- Existing contests are updated if changed

### Solution Auto-Fetch(Future Work)
- Solutions are automatically fetched from YouTube playlists every 12 hours
- Matches video titles with contest names
- Updates contest records with solution information
- Manual solution linking is also available

### Theme Switching
- Supports both light and dark modes
- Theme preference is saved in localStorage
- Automatically detects system preference

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
