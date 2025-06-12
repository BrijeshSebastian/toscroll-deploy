checkAuth();

const projectId = new URLSearchParams(window.location.search).get('projectId');
if (!projectId) window.location.href = '/home.html';

document.getElementById('logoutBtn').addEventListener('click', logout);

async function loadLogs(date) {
  try {
    const logs = await apiRequest(`/admin/project/${projectId}/logs?date=${date}`);
    const logList = document.getElementById('logList');
    logList.innerHTML = logs.map(log => `
      <li class="flex justify-between items-center p-2 bg-white/10 rounded">
        <span class="text-white">${log.entry}</span>
        <div>
          <button onclick="editLog('${log.id}')" class="btn mr-2">Edit</button>
          <button onclick="deleteLog('${log.id}')" class="btn btn-danger">Delete</button>
        </div>
      </li>
    `).join('');
  } catch (error) {
    alert('Error loading logs');
  }
}

document.getElementById('loadLogsBtn').addEventListener('click', () => {
  const date = document.getElementById('logDate').value;
  if (date) loadLogs(date);
});

document.getElementById('logForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const entry = document.getElementById('logEntry').value;
  const date = document.getElementById('logDate').value;
  if (!entry || !date) return alert('Select a date and enter a log');
  try {
    await apiRequest(`/admin/project/${projectId}/logs`, 'POST', { date, entry });
    document.getElementById('logEntry').value = '';
    loadLogs(date);
  } catch (error) {
    alert('Error adding log');
  }
});

async function editLog(logId) {
  const newEntry = prompt('Edit log entry:');
  if (newEntry) {
    try {
      await apiRequest(`/admin/log/${logId}`, 'PUT', { entry: newEntry });
      loadLogs(document.getElementById('logDate').value);
    } catch (error) {
      alert('Error editing log');
    }
  }
}

async function deleteLog(logId) {
  if (confirm('Are you sure you want to delete this log?')) {
    try {
      await apiRequest(`/admin/log/${logId}`, 'DELETE');
      loadLogs(document.getElementById('logDate').value);
    } catch (error) {
      alert('Error deleting log');
    }
  }
}