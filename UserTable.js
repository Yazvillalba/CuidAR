function getUsers() {
    return users;
}

function getRoleText(role) {
    const roleLabels = {
        admin: 'Administrador',
        worker: 'Cuidador',
        family: 'Familia'
    };
    return roleLabels[role] || role;
}

function getRolColorClass(role) {
    const rolColor = {
        admin: 'rolColor-admin',
        worker: 'rolColor-worker',
        family: 'rolColor-family'
    };
    return rolColor[role];
}

function getUserStatus(status) {
    const statusConfig = {
        active: { text: 'Activo', class: 'bg-green-100 text-green-800' },
        inactive: { text: 'Inactivo', class: 'bg-red-100 text-red-800' }
    };
    return statusConfig[status] || statusConfig.inactive;
}

function generateUsersTable() {
    const tbody = document.querySelector('#usersTab tbody');
    if (!tbody) return;
    const usersList = getUsers();
    tbody.innerHTML = '';
    usersList.forEach(user => {
        const roleText = getRoleText(user.role);
        const rolColorClass = getRolColorClass(user.role);
        const userStatus = getUserStatus(user.status);
        let imageSrc = '';
        if (user.role === 'worker') {
            imageSrc = user.image || 'Imagenes/Trabajador.jpg';
        } else if (user.role === 'family') {
            imageSrc = user.image || 'Imagenes/Familia.jpg';
        } else {
            imageSrc = user.image || '';
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-4">
                <div class="d-flex align-items-center gap-3">
                    ${imageSrc ? `<img src="${imageSrc}" alt="${user.role}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 50%;">` : ''}
                    <div>
                        <div class="small fw-medium text-gray-900">${user.firstName} ${user.lastName}</div>
                        <div class="small text-gray-500">${user.email}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-4">
                <span class="badge ${rolColorClass} small">${roleText}</span>
            </td>
            <td class="px-4 py-4">
                <button class="btn btn-sm ${userStatus.class} rounded-pill small fw-semibold" 
                        onclick="toggleUserStatus('${user.username}')">
                    ${userStatus.text}
                </button>
            </td>
            <td class="px-4 py-4">
                <div class="d-flex gap-2">
                    <button class="btn btn-sm text-sky-600 p-1 edit-user-btn" title="Editar" data-username="${user.username}">
                        <i data-lucide="edit" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn btn-sm text-red-600 p-1 delete-user-btn" title="Eliminar" data-username="${user.username}">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    lucide.createIcons();
    addTableEventListeners();
}

function updateDashboardStats() {
    const usersList = getUsers();
    const totalUsers = usersList.length;
    const workers = usersList.filter(user => user.role === 'worker').length;
    const families = usersList.filter(user => user.role === 'family').length;
    const admins = usersList.filter(user => user.role === 'admin').length;
    const activeUsers = usersList.filter(user => user.status === 'active').length;
    const totalUsersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(1) .h2');
    const workersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(2) .h2');
    const familiesElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(3) .h2');
    const activeUsersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(4) .h2');
    if (totalUsersElement) totalUsersElement.textContent = totalUsers;
    if (workersElement) workersElement.textContent = workers;
    if (familiesElement) familiesElement.textContent = families;
    if (activeUsersElement) activeUsersElement.textContent = activeUsers;
}

function initializeAdminPage() {
    if (window.location.pathname.includes('admin.html')) {
        updateDashboardStats();
        generateUsersTable();
        setupModalEventListeners();
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(tabId + 'Tab').style.display = 'block';
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

function openCreateUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('createUserModal'));
    modal.show();
}

async function handleCreateUser(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    let image = '';
    const fileInput = form.querySelector('input[name="profileImage"]');
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (file) {
        // Leer la imagen como base64
        image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    } else {
        image = '';
    }
    const role = formData.get('role');
    const newUser = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        role: role,
        status: 'active',
        image: image
    };
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
        showAlert('error', 'Error', 'El nombre de usuario ya existe');
        return;
    }
    users.push(newUser);
    saveUsersToStorage();
    const modal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
    modal.hide();
    form.reset();
    updateDashboardStats();
    generateUsersTable();
    showAlert('success', 'Usuario Creado', 'El nuevo usuario ha sido creado exitosamente');
}

function toggleUserStatus(userId) {
    const user = users.find(u => u.username === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        saveUsersToStorage();
        updateDashboardStats();
        generateUsersTable();
        const status = user.status === 'active' ? 'activado' : 'desactivado';
        showAlert('info', 'Estado Cambiado', `El usuario ha sido ${status} correctamente`);
    }
}

async function handleEditUser(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const originalUsername = formData.get('originalUsername');
    let image = '';
    const fileInput = form.querySelector('input[name="editProfileImage"]');
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (file) {
        // Leer la imagen como base64
        image = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    } else {
        // Mantener la imagen anterior si no se sube una nueva
        const currentUser = users.find(u => u.username === originalUsername);
        image = currentUser && currentUser.image ? currentUser.image : '';
    }
    const role = formData.get('role');
    const updatedUser = {
        username: formData.get('username'),
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        role: role,
        status: formData.get('status'),
        image: image
    };
    const newPassword = formData.get('password');
    if (newPassword && newPassword.trim() !== '') {
        updatedUser.password = newPassword;
    } else {
        const currentUser = users.find(u => u.username === originalUsername);
        if (currentUser) {
            updatedUser.password = currentUser.password;
        }
    }
    if (originalUsername !== updatedUser.username) {
        const existingUser = users.find(u => u.username === updatedUser.username);
        if (existingUser) {
            showAlert('error', 'Error', 'El nombre de usuario ya existe');
            return;
        }
    }
    const userIndex = users.findIndex(u => u.username === originalUsername);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveUsersToStorage();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        form.reset();
        updateDashboardStats();
        generateUsersTable();
        showAlert('success', 'Usuario Actualizado', 'El usuario ha sido actualizado exitosamente');
    } else {
        showAlert('error', 'Error', 'Usuario no encontrado');
    }
}

function setupModalEventListeners() {
    const createUserForm = document.getElementById('createUserForm');
    if (createUserForm) {
        createUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCreateUser(e);
        });
    }
    const editUserForm = document.getElementById('editUserForm');
    if (editUserForm) {
        editUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEditUser(e);
        });
    }
}

function addTableEventListeners() {
    document.querySelectorAll('.edit-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            openEditUserModal(username);
        });
    });
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            openDeleteUserModal(username);
        });
    });
}

function openEditUserModal(username) {
    const user = users.find(u => u.username === username);
    if (!user) {
        showAlert('error', 'Error', 'Usuario no encontrado');
        return;
    }
    document.getElementById('editOriginalUsername').value = user.username;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editRole').value = user.role;
    document.getElementById('editPassword').value = '';
    document.getElementById('editStatus').value = user.status;
    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

function openDeleteUserModal(username) {
    const user = users.find(u => u.username === username);
    if (!user) {
        showAlert('error', 'Error', 'Usuario no encontrado');
        return;
    }
    document.getElementById('deleteUserName').textContent = `${user.firstName} ${user.lastName} (${user.username})`;
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = function() {
        deleteUser(username);
    };
    const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    modal.show();
}

function deleteUser(username) {
    const currentUsername = localStorage.getItem('username');
    if (username === currentUsername) {
        showAlert('error', 'Error', 'No puedes eliminar tu propia cuenta');
        return;
    }
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        saveUsersToStorage();
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
        modal.hide();
        updateDashboardStats();
        generateUsersTable();
        showAlert('success', 'Usuario Eliminado', `El usuario ${deletedUser.firstName} ${deletedUser.lastName} ha sido eliminado exitosamente`);
    } else {
        showAlert('error', 'Error', 'Usuario no encontrado');
    }
} 