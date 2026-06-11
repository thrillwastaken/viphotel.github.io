# VIP Guest Hotel Website

A modern, fully responsive hotel booking website for VIP Guest Hotel in Palau with email-based reservation system.

## Features

### Pages
- **Home Page** - Welcome section with:
  - Current weather widget
  - Google Map showing hotel location in Koror, Palau
  - TripAdvisor-style guest reviews
  - News & updates bulletin
  - Quick booking call-to-action

- **Bookings Page** - Room reservation system:
  - Display of available room types with details
  - Room amenities and pricing
  - Booking inquiry form with guest information
  - Email confirmation system

- **About Page** - Hotel information:
  - Hotel history and mission
  - Why choose VIP Guest Hotel
  - Management team profiles
  - Guest testimonials

- **Contact Page** - Full contact details:
  - Phone, email, address, business hours
  - Quick contact message form
  - Location map
  - FAQ section
  - Social media links

### Technical Features
- **Email Booking System** - Customers provide email, hotel receives inquiry
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Green and gold luxury hotel theme
- **Backend API** - Node.js/Express server
- **Email Integration** - Nodemailer for sending booking inquiries

## Project Structure

```
vip-guest-hotel/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── index.html
│   ├── bookings.html
│   ├── about.html
│   └── contact.html
├── routes/
│   └── bookings.js
├── server.js
├── package.json
├── .env
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to project directory:
```bash
cd "VIP Guest Hotel Workspace"
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit `.env` file with your email configuration:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-hotel-email@gmail.com
EMAIL_PASS=your-app-password
HOTEL_EMAIL=bookings@vipguesthotel.com
PORT=3000
```

### Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Email Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on Gmail account
2. Generate an app-specific password
3. Use the app password in `.env` file

### Other Email Services
Update `.env` with your service provider (e.g., outlook, yahoo, etc.)

## API Endpoints

### GET /api/rooms
Returns list of available room types with pricing and amenities

### POST /api/bookings
Submits a booking inquiry
- **Body**: `{ guestName, guestEmail, checkInDate, checkOutDate, roomType, guests, message }`
- **Response**: Success message or error

## Room Types
- Standard Room - $80/night (2 guests)
- Deluxe Room - $120/night (2 guests)
- Suite - $180/night (4 guests)
- Ocean View Room - $150/night (2 guests)

## Customization

### Colors
Edit CSS variables in `public/css/style.css`:
- `--primary-color`: #1a472a (dark green)
- `--secondary-color`: #d4af37 (gold)
- `--accent-color`: #2e5c4a (medium green)

### Room Data
Modify room information in `routes/bookings.js`

### Hotel Info
Update contact details, staff profiles, and reviews in HTML files

## Google APIs Integration

To enable real Google Maps and Weather data:
1. Get API keys from Google Cloud Console
2. Add to .env:
   ```
   GOOGLE_MAPS_API_KEY=your_key
   GOOGLE_WEATHER_API_KEY=your_key
   ```
3. Update API key in HTML files

## Deployment

### Heroku
```bash
heroku login
heroku create vip-guest-hotel
git push heroku main
```

### Other Platforms
Configure environment variables on your hosting platform and deploy.

## Support
For issues or questions: info@vipguesthotel.com

---
© 2026 VIP Guest Hotel. All rights reserved.
