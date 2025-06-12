checkAuth();

const userId = new URLSearchParams(window.location.search).get('userId');
if (!userId) window.location.href = '/home.html';

document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('chatBtn').href = `/chat.html?userId=${userId}`;
document.getElementById('addProjectBtn').href = `/project-new.html?userId=${userId}`;

async function loadUserDetails() {
  try {
    const user = await apiRequest(`/admin/user/${userId}`);
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
  } catch (error) {
    alert('Error loading user details');
  }
}

async function loadProjects() {
  try {
    const projects = await apiRequest(`/admin/user/${userId}/projects`);
    const tbody = document.getElementById('projectList');
    tbody.innerHTML = projects.map(project => `
      <tr>
        <td>${project.title}</td>
        <td>${project.domain}</td>
        <td class="text-right">
          <a href="/project-edit.html?projectId=${project.id}" class="btn mr-2">Edit</a>
          <a href="/log-edit.html?projectId=${project.id}" class="btn mr-2">Logs</a>
          <button onclick="deleteProject('${project.id}')" class="btn btn-danger">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    alert('Error loading projects');
  }
}

async function deleteProject(projectId) {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await apiRequest(`/admin/project/${projectId}`, 'DELETE');
      loadProjects();
    } catch (error) {
      alert('Error deleting project');
    }
  }
}

loadUserDetails();
loadProjects();