// Utility function to set active nav link
function setActiveNav(page) {
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
  document.querySelector(`a[data-page="${page}"]`)?.classList.add('active');
}

// Display alert message
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(alertDiv, container.firstChild);
  
  setTimeout(() => alertDiv.remove(), 5000);
}

// Get URL parameters
function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

// Fetch rooms for bookings page
async function loadRooms() {
  try {
    const response = await fetch('/api/rooms');
    const rooms = await response.json();
    return rooms;
  } catch (error) {
    console.error('Error loading rooms:', error);
    showAlert('Error loading room information', 'error');
    return [];
  }
}

// Submit booking inquiry
async function submitBooking(event) {
  event.preventDefault();
  
  const formData = {
    guestName: document.getElementById('guestName').value,
    guestEmail: document.getElementById('guestEmail').value,
    checkInDate: document.getElementById('checkInDate').value,
    checkOutDate: document.getElementById('checkOutDate').value,
    roomType: document.getElementById('roomType').value,
    guests: document.getElementById('guests').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      showAlert(result.message, 'success');
      document.getElementById('bookingForm').reset();
    } else {
      showAlert(result.error || 'Error submitting booking', 'error');
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    showAlert('Error submitting booking. Please try again.', 'error');
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  // Determine current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const pageName = currentPage.replace('.html', '') || 'home';
  setActiveNav(pageName);
});
