let accessToken = '';
let refreshToken = '';

async function login() {
  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user1' })
  });
  const data = await response.json();
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  document.getElementById('message').innerText = 'Logged in successfully';
}

async function accessProtected() {
  if (!accessToken) {
    document.getElementById('message').innerText = 'Please log in first';
    return;
  }
  const response = await fetch('http://localhost:5000/protected', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (response.status === 403) {
    document.getElementById('message').innerText = 'Access token expired, refreshing token...';
    await refreshToken();
    return accessProtected();
  }

  const data = await response.json();
  document.getElementById('message').innerText = data.message;
}

async function refreshToken() {
  const response = await fetch('http://localhost:5000/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken })
  });

  if (response.ok) {
    const data = await response.json();
    accessToken = data.accessToken;
    document.getElementById('message').innerText = 'Token refreshed successfully';
  } else {
    document.getElementById('message').innerText = 'Failed to refresh token';
  }
}
