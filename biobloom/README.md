# BioBloom Solutions

A sustainable agriculture platform that helps farmers optimize their crop rotation and monitor air quality.

## Features

- User Authentication (Email & Google)
- Crop Rotation Assistant
- AQI Monitoring
- Profile Management
- Responsive Design

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Google OAuth
- HTML5/CSS3/JavaScript

## Deployment Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- Render account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Deployment Steps

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add all variables from your `.env` file

### MongoDB Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Set up database access (user & password)
4. Set up network access (IP whitelist)
5. Get your connection string and add it to MONGODB_URI

### Google OAuth Setup

1. Go to Google Cloud Console
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-render-app.onrender.com/auth/google/callback`
6. Copy Client ID and Secret to your environment variables

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Run development server: `npm run dev`

## License

MIT 