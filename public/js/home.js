checkAuth();

document.getElementById('logoutBtn').addEventListener('click', logout);

async function loadPendingUsers() {
  try {
    const users = await apiRequest('/admin/pending-users');
    const tbody = document.getElementById('pendingUsers');
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td class="text-right">
          <button onclick="approveUser('${user.id}')" class="btn">Approve</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    alert('Error loading pending users');
  }
}

async function loadAllUsers() {
  try {
    const users = await apiRequest('/admin/users');
    const tbody = document.getElementById('allUsers');
    tbody.innerHTML = users.map(user => `
      <tr>
        <td><a href="/user.html?userId=${user.id}" class="text-blue-300 hover:underline">${user.name}</a></td>
        <td>${user.email}</td>
        <td class="text-right">
          <button onclick="deleteUser('${user.id}')" class="btn btn-danger">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    alert('Error loading users');
  }
}

async function approveUser(userId) {
  try {
    await apiRequest(`/admin/approve-user/${userId}`, 'POST');
    loadPendingUsers();
  } catch (error) {
    alert('Error approving user');
  }
}

async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await apiRequest(`/admin/user/${userId}`, 'DELETE');
      loadAllUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  }
}

loadPendingUsers();
loadAllUsers();