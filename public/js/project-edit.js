checkAuth();

const projectId = new URLSearchParams(window.location.search).get('projectId');
if (!projectId) window.location.href = '/home.html';

document.getElementById('logoutBtn').addEventListener('click', logout);

async function loadProject() {
  try {
    const project = await apiRequest(`/admin/project/${projectId}`);
    document.getElementById('title').value = project.title;
    document.getElementById('domain').value = project.domain;
    document.getElementById('startDate').value = project.startDate;
    document.getElementById('endDate').value = project.endDate || '';
    document.getElementById('status').value = project.status;
  } catch (error) {
    alert('Error loading project');
  }
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('domain', document.getElementById('domain').value);
  formData.append('startDate', document.getElementById('startDate').value);
  formData.append('endDate', document.getElementById('endDate').value);
  formData.append('status', document.getElementById('status').value);
  const image = document.getElementById('image').files[0];
  if (image) formData.append('image', image);

  try {
    await fetch(`${API_BASE}/admin/project/${projectId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    });
    alert('Project updated successfully');
    window.location.href = `/user.html?userId=${(await apiRequest(`/admin/project/${projectId}`)).userId}`;
  } catch (error) {
    alert('Error updating project');
  }
});

loadProject();