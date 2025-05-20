# NIGGALEK Application
NIGGALEK is a mobile application built with React Native and Expo that features prayer tracking, news browsing, and an AI-powered customer support system using Google's Gemini AI model.

# Preview
![Alt Text](/assets/images/demo.png)


## Installation Guide
### Prerequisites
- Node.js (v14.0 or higher)
- npm (v6.0 or higher)
- Expo CLI

### Installation Steps
1. Clone the repository
``` bash
   git clone https://github.com/yourusername/niggalek.git
   cd niggalek
```
1. Install dependencies
``` bash
   npm install
```
1. Create a `.env` file (for storing API keys safely)

## Running the Application
### Backend Server
The application uses a Laravel backend server to handle prayer tracking data.
1. Start the backend server:
``` bash
   cd backend
   php artisan serve
```
This will start the backend server at `http://127.0.0.1:8000`
### Frontend Application
1. Start the Expo development server:
``` bash
   npm start
```
1. Run on a specific platform:
``` bash
   npm run android
   # or
   npm run ios
   # or
   npm run web
```
## API Endpoints
The application interacts with the following API endpoints:
### Prayer Tracking API
- **GET `/api/niggalek`**: Retrieve all prayer records
- **POST `/api/niggalek`**: Create a new prayer record
   - Required fields: `name`, `category`, `date`

- **PUT `/api/niggalek/{id}`**: Update an existing prayer record
   - Required fields: `name`, `category`, `date`

- **DELETE `/api/niggalek/{id}`**: Delete a prayer record

### News API
- The app uses NewsAPI for the Explore tab
- Endpoint: `https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`

### AI Customer Service
- Uses Google's Gemini AI model for customer support
- Model: `gemini-2.0-flash-lite`

## Testing Results
### Backend API Testing (Postman)
_GET request to retrieve all prayer records_
_POST request to create a new prayer record_
_PUT request to update an existing prayer record_
_DELETE request to remove a prayer record_
### Mobile App Screenshots
_Prayer Tracking Home Screen_
_News Exploration Screen_
_AI-powered Customer Service Interface_
## Features
1. **Prayer Tracker**: Add, edit, and delete prayer records with categories (wajib/sunnah) and dates
2. **News Explorer**: Browse latest news articles from various sources
3. **AI Customer Service**: Get AI-powered assistance for any questions or issues

## Technologies Used
- React Native
- Expo
- TypeScript
- Laravel (Backend)
- Google Gemini AI
- News API
- twrnc (TailwindCSS for React Native)
