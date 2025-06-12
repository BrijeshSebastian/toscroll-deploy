checkAuth();

const userId = new URLSearchParams(window.location.search).get('userId');
if (!userId) window.location.href = '/home.html';

document.getElementById('logoutBtn').addEventListener('click', logout);

document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('userId', userId);
formData.append('title', document.getElementById('title').value);
formData.append('domain', document.getElementById('domain').value);
  formData.append('startDate', document.getElementById('startDate').value);
  formData.append('endDate', document.getElementById('endDate').value);
  formData.append('status', document.getElementById('status').value);
  const image = document.getElementById('image').files[0];
  if (image) formData.append('image', image);

  try {
    await fetch(`${API_BASE_URL}/admin/project`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    });
    alert('Project created successfully');
    window.location.href = `/user.html?userId=${userId}`;
  } catch (error) {
    alert('Error creating project');
  }
});