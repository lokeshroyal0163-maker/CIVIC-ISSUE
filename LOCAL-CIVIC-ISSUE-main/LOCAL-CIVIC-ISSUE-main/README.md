# Local Civic Issue Reporter

A web application that allows citizens to report local civic issues like potholes, garbage dumps, broken street lights, water supply problems, and other municipal concerns to local authorities.

## Features

- **User Registration & Authentication**: Secure user signup and login system
- **Issue Reporting**: Report civic issues with descriptions, categories, location, and photo uploads
- **Issue Tracking**: View all reported issues with status updates
- **User Dashboard**: Personal dashboard to manage profile and view reported issues
- **Contact System**: Contact form to reach support/authorities
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **File Handling**: Multer for image uploads
- **Session Management**: Express Session

## Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MongoDB**
   - **Option A: MongoDB Community Server (Local)**
     - Download from: https://www.mongodb.com/try/download/community
     - Follow installation instructions for your OS
     - Start MongoDB service
   - **Option B: MongoDB Atlas (Cloud)**
     - Create account at: https://www.mongodb.com/atlas
     - Create a cluster and get connection string

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## Installation & Setup Guide

### Step 1: Download/Clone the Project

If you have Git installed:
```bash
git clone <repository-url>
cd LOCAL-CIVIC-ISSUE
```

Or download the ZIP file and extract it.

### Step 2: Install Dependencies

Open Command Prompt/PowerShell in the project directory and run:

```bash
npm install
```

This will install all required packages:
- express
- mongodb
- mongoose
- body-parser
- express-session
- multer
- path

### Step 3: Database Setup

#### For Local MongoDB:
1. Start MongoDB service:
   - Windows: MongoDB should start automatically, or run `mongod` in command prompt
   - Mac: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

2. The application will connect to: `mongodb://127.0.0.1:27017/civic_reporter`

#### For MongoDB Atlas (Cloud):
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Set environment variable:
   ```bash
   set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civic_reporter
   ```

### Step 4: Start the Application

Run the following command in the project directory:

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
📂 Serving static files from: [project-path]/public
```

### Step 5: Access the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## Application Structure

```
LOCAL-CIVIC-ISSUE/
├── public/                 # Frontend files
│   ├── index.html         # Landing page
│   ├── login.html         # Login page
│   ├── signup.html        # Registration page
│   ├── main.html          # Dashboard
│   ├── report.html        # Issue reporting form
│   ├── view-issues.html   # View all issues
│   ├── profile.html       # User profile
│   ├── contact.html       # Contact/Help page
│   ├── style.css          # Main stylesheet
│   ├── file.css           # Landing page styles
│   ├── signup.js          # Client-side validation
│   ├── bg.jpg             # Background image
│   ├── uploads/           # Uploaded images directory
│   ├── models/            # Mongoose models (legacy)
│   └── views/routes/      # Route files (legacy)
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## How to Use the Application

### 1. Registration
- Go to http://localhost:3000
- Click "Sign Up"
- Fill in username, email, and password
- Click "Sign Up"

### 2. Login
- Click "Login" on the homepage
- Enter your username and password
- Click "Login"

### 3. Report an Issue
- After login, click "Report an Issue" in the navigation
- Fill out the form:
  - Issue Title
  - Category (Road/Infrastructure, Water Supply, etc.)
  - Description
  - Location
  - Upload image (optional)
- Click "Submit Report"

### 4. View Issues
- Click "View Issues" to see all reported issues
- Issues are displayed with:
  - Title and category
  - Description
  - Location and date
  - Reporter name
  - Status (Pending/In Progress/Resolved)
  - Image (if uploaded)

### 5. Profile Management
- Click "Profile" to view your account details
- Use "Logout" to end your session

### 6. Contact Support
- Click "Contact & Help" for support information
- Use the contact form to send messages

## Database Collections

The application creates the following MongoDB collections:

1. **users**: Stores user account information
   - username, email, password, createdAt

2. **issues**: Stores reported civic issues
   - userId, username, title, description, location, category, status, createdAt, image

3. **contacts**: Stores contact form submissions
   - name, email, message, createdAt

## Environment Variables

You can set these environment variables:

- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string (default: mongodb://127.0.0.1:27017/civic_reporter)

Example for Windows:
```cmd
set PORT=3000
set MONGO_URI=mongodb://127.0.0.1:27017/civic_reporter
npm start
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string
   - Verify network connectivity for Atlas

2. **Port Already in Use**
   - Change port: `set PORT=3001` then `npm start`
   - Kill process using the port

3. **File Upload Issues**
   - Ensure `public/uploads/` directory exists
   - Check file permissions

4. **Session Issues**
   - Clear browser cookies
   - Restart the server

### Development Mode

For development with automatic restarts:
```bash
npm install -g nodemon
npm run dev
```

## Security Notes

- Passwords are stored in plain text (for demo purposes)
- In production, use bcrypt for password hashing
- Add input validation and sanitization
- Implement proper authentication middleware
- Use HTTPS in production
- Set up proper CORS policies

## Future Enhancements

- Password hashing with bcrypt
- Email verification
- Admin panel for issue management
- Real-time notifications
- Issue status updates
- Location-based filtering
- Image compression
- API rate limiting
- User roles and permissions

## Support

For issues or questions:
- Email: support@civicreport.gov.in
- Helpline: +91 852 005 8226

## License

This project is licensed under the MIT License.
