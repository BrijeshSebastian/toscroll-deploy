checkAuth();

let selectedUserId = new URLSearchParams(window.location.search).get('userId');

document.getElementById('logoutBtn').addEventListener('click', logout);

async function loadUsers() {
  try {
    const users = await apiRequest('/admin/users');
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map(user => `
      <li>
        <button onclick="selectUser('${user.id}')" class="w-full text-left p-2 rounded ${selectedUserId === user.id ? 'bg-blue-500' : 'hover:bg-white/10'} text-white">
          ${user.name}
        </button>
      </li>
    `).join('');
    if (selectedUserId) selectUser(selectedUserId);
  } catch (error) {
    alert('Error loading users');
  }
}

async function selectUser(userId) {
  selectedUserId = userId;
  loadUsers(); // Refresh list to highlight selected
  try {
    const messages = await apiRequest(`/admin/chat/${userId}`);
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.innerHTML = messages.map(msg => `
      <div class="${msg.fromAdmin ? 'text-right' : 'text-left'} mb-2">
        <span class="inline-block p-2 rounded ${msg.fromAdmin ? 'bg-blue-500' : 'bg-gray-500'} text-white">
          ${msg.text}
        </span>
      </div>
    `).join('');
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    alert('Error loading chat');
  }
}

document.getElementById('userSearch').addEventListener('input', (e) => {
  const search = e.target.value.toLowerCase();
  const items = document.querySelectorAll('#userList li');
  items.forEach(item => {
    const name = item.textContent.toLowerCase();
    item.style.display = name.includes(search) ? '' : 'none';
  });
});

document.getElementById('chatForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedUserId) return alert('Select a user first');
  const message = document.getElementById('messageInput').value;
  if (!message) return;
  try {
    await apiRequest(`/admin/chat/${selectedUserId}`, 'POST', { message });
    document.getElementById('messageInput').value = '';
    selectUser(selectedUserId); // Refresh chat
  } catch (error) {
    alert('Error sending message');
  }
});

loadUsers();