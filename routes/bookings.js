const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
require('dotenv').config();

// ─── In-Memory Stores (replace with a database for production) ───
let bookings = [];
let feedback = [];
let contacts = [];
let adminToken = null;
let bookingCounter = 1;
let feedbackCounter = 1;
let contactCounter = 1;

// ─── Email Transporter ───
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(options) {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-hotel-email@gmail.com') return;
  try {
    await transporter.sendMail(options);
  } catch (e) {
    console.error('Email error:', e.message);
  }
}

// ─── Admin Auth Middleware ───
function requireAdmin(_req, res, next) {
  const token = _req.headers['x-admin-token'];
  if (!token || token !== adminToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Room Types ───
const roomTypes = [
  { id: 1, name: 'Single Room', description: 'Comfortable room with one queen bed. Ideal for solo travelers or couples.', price: 112, capacity: 2, available: 6, amenities: ['Air Conditioning', 'Free WiFi', 'Kitchenette', 'Cable TV', 'Hot/Cold Shower'] },
  { id: 2, name: 'Double Twin Room', description: 'Spacious room with two queen beds and original Palauan tropical murals.', price: 122, capacity: 4, available: 6, amenities: ['Air Conditioning', 'Free WiFi', 'Kitchenette', 'Cable TV', 'Hot/Cold Shower', 'Tropical Mural'] },
  { id: 3, name: 'Triple Room', description: 'Great for families — one queen bed plus two single beds.', price: 132, capacity: 5, available: 5, amenities: ['Air Conditioning', 'Free WiFi', 'Kitchenette', 'Cable TV', 'Hot/Cold Shower'] }
];

// ─── PUBLIC ROUTES ───

// GET rooms
router.get('/rooms', (_req, res) => res.json(roomTypes));

// POST booking inquiry
router.post('/bookings', async (req, res) => {
  const { guestName, guestEmail, checkInDate, checkOutDate, roomType, guests, phone, message } = req.body;

  if (!guestName || !guestEmail || !checkInDate || !checkOutDate || !roomType) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const booking = {
    id: bookingCounter++,
    guestName,
    guestEmail,
    checkInDate,
    checkOutDate,
    roomType,
    guests: guests || 1,
    phone: phone || '',
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);

  // Email to hotel
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: process.env.HOTEL_EMAIL,
    subject: `New Booking Inquiry #${booking.id} — VIP Guest Hotel`,
    html: `
      <h2>New Booking Inquiry #${booking.id}</h2>
      <p><strong>Guest:</strong> ${guestName} (${guestEmail})</p>
      <p><strong>Room:</strong> ${roomType}</p>
      <p><strong>Check-in:</strong> ${checkInDate} &nbsp; <strong>Check-out:</strong> ${checkOutDate}</p>
      <p><strong>Guests:</strong> ${guests}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Special Requests:</strong> ${message || 'None'}</p>
    `
  });

  // Confirmation to guest
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: guestEmail,
    subject: 'Booking Inquiry Received — VIP Guest Hotel, Palau',
    html: `
      <h2>Thank you, ${guestName}!</h2>
      <p>We have received your booking inquiry for the <strong>${roomType}</strong>.</p>
      <ul>
        <li>Check-in: ${checkInDate}</li>
        <li>Check-out: ${checkOutDate}</li>
        <li>Guests: ${guests}</li>
      </ul>
      <p>Our team will contact you within 24 hours to confirm your reservation.</p>
      <p><em>Alii Welcome Home — VIP Guest Hotel, Koror, Palau</em></p>
    `
  });

  res.json({
    success: true,
    bookingId: booking.id,
    message: `Booking inquiry #${booking.id} received! Check your email for confirmation. Our team will be in touch within 24 hours.`
  });
});

// POST contact inquiry
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const contact = {
    id: contactCounter++,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString()
  };
  contacts.push(contact);

  await sendEmail({
    from: process.env.EMAIL_USER,
    to: process.env.HOTEL_EMAIL,
    subject: `Contact Inquiry: ${subject} — VIP Guest Hotel`,
    html: `<h2>Contact Inquiry</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`
  });

  res.json({ success: true, message: 'Message received!' });
});

// POST feedback
router.post('/feedback', async (req, res) => {
  const { name, email, room, stayDate, overallRating, comments, recommend, allowPublic } = req.body;

  if (!name || !email || !comments) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const item = {
    id: feedbackCounter++,
    name,
    email,
    room: room || '',
    stayDate: stayDate || '',
    overallRating: overallRating || null,
    comments,
    recommend: recommend || null,
    allowPublic: allowPublic || false,
    createdAt: new Date().toISOString()
  };
  feedback.push(item);

  await sendEmail({
    from: process.env.EMAIL_USER,
    to: process.env.HOTEL_EMAIL,
    subject: `New Guest Feedback (${overallRating}★) — VIP Guest Hotel`,
    html: `<h2>Guest Feedback</h2><p><strong>From:</strong> ${name} (${email})</p><p><strong>Room:</strong> ${room || 'Not specified'}</p><p><strong>Rating:</strong> ${overallRating}/5</p><p><strong>Comments:</strong> ${comments}</p>`
  });

  res.json({ success: true });
});

// ─── ADMIN ROUTES ───

// POST admin login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'viphotel2026';

  if (username === validUser && password === validPass) {
    adminToken = crypto.randomBytes(32).toString('hex');
    res.json({ token: adminToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// GET all bookings (admin)
router.get('/admin/bookings', requireAdmin, (_req, res) => {
  res.json([...bookings].reverse());
});

// PATCH booking status
router.patch('/admin/bookings/:id/status', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ error: 'Not found' });
  booking.status = status;
  res.json({ success: true });
});

// GET all feedback (admin)
router.get('/admin/feedback', requireAdmin, (_req, res) => {
  res.json([...feedback].reverse());
});

// GET all contacts (admin)
router.get('/admin/contacts', requireAdmin, (_req, res) => {
  res.json([...contacts].reverse());
});

module.exports = router;
