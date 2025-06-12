function checkAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
  }
}

function logout() {
  clearToken();
  window.location.href = '/login.html';
}