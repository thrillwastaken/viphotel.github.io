# VIP Guest Hotel - Quick Start Guide

## Getting Started

### Step 1: Install Node.js
If you haven't already installed Node.js:
1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Verify installation by opening PowerShell and running:
   ```
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
Open PowerShell in the project folder and run:
```
npm install
```

This will install:
- express (web framework)
- nodemailer (email sending)
- body-parser (request handling)
- dotenv (environment variables)
- cors (cross-origin requests)

### Step 3: Configure Email
1. Open `.env` file in the project folder
2. Set up your email configuration:

**For Gmail:**
- EMAIL_USER: your-email@gmail.com
- EMAIL_PASS: Your Gmail App Password (not your regular password)
  - Go to https://myaccount.google.com/
  - Enable 2-Factor Authentication
  - Go to Security → App passwords
  - Generate a password for "Mail" and "Windows"
  - Copy and paste the 16-character password

**For Other Providers:**
- Change EMAIL_SERVICE to: outlook, yahoo, etc.

Example .env:
```
EMAIL_SERVICE=gmail
EMAIL_USER=hotelvip@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
HOTEL_EMAIL=bookings@vipguesthotel.com
PORT=3000
NODE_ENV=development
```

### Step 4: Start the Server
Open PowerShell in project folder and run:
```
npm start
```

You should see:
```
VIP Guest Hotel website running on http://localhost:3000
```

### Step 5: Test the Website
1. Open your browser
2. Go to http://localhost:3000
3. You should see the beautiful hotel website!

## Testing Bookings

1. Click "Bookings" in the navigation
2. Fill in the booking form with your test email
3. Submit the form
4. Check both:
   - Your test email (confirmation)
   - Hotel email (inquiry received)

## Troubleshooting

### "npm: The term 'npm' is not recognized"
- Node.js is not installed or not in PATH
- Restart PowerShell after installing Node.js

### "Port 3000 already in use"
- Another application is using port 3000
- Stop that application or change PORT in .env

### Emails not sending
- Check EMAIL_USER and EMAIL_PASS are correct in .env
- For Gmail: Make sure app password is 16 characters
- Check HOTEL_EMAIL is a valid email address

## File Locations

- Website Pages: `public/` folder
- Styles: `public/css/style.css`
- JavaScript: `public/js/main.js`
- Backend Code: `routes/bookings.js`
- Configuration: `.env`

## Next Steps

1. Add your Google Maps API key for live maps
2. Integrate real weather API
3. Setup a proper email provider
4. Deploy to cloud hosting (Heroku, AWS, Azure, etc.)
5. Purchase a domain name
6. Add SSL certificate

## Support
Contact: info@vipguesthotel.com
