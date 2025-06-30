// Datos de usuarios - Ahora se cargan desde localStorage
let users = [];

// Función para cargar usuarios desde localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('cuidarUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        // Datos iniciales por defecto
        users = [
            {
                username: 'admin',
                password: 'admin123',
                firstName: 'Administrador',
                lastName: 'Sistema',
                role: 'admin',
                email: 'admin@cuidar.com',
                status: 'active'
            },
            {
                username: 'cuidador1',
                password: 'cuidador123',
                firstName: 'María',
                lastName: 'González',
                role: 'worker',
                email: 'maria@cuidar.com',
                status: 'active'
            },
            {
                username: 'cuidador2',
                password: 'cuidador456',
                firstName: 'Ana',
                lastName: 'López',
                role: 'worker',
                email: 'ana@cuidar.com',
                status: 'inactive'
            },
            {
                username: 'familia1',
                password: 'familia123',
                firstName: 'Carlos',
                lastName: 'Rodríguez',
                role: 'family',
                email: 'carlos@cuidar.com',
                status: 'active'
            },
            {
                username: 'familia3',
                password: 'familia789',
                firstName: 'Roberto',
                lastName: 'Pérez',
                role: 'family',
                email: 'roberto@cuidar.com',
                status: 'inactive'
            }
        ];
        // Guardar los datos iniciales en localStorage
        saveUsersToStorage();
    }
}

// Función para guardar usuarios en localStorage
function saveUsersToStorage() {
    localStorage.setItem('cuidarUsers', JSON.stringify(users));
}

let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Cargar usuarios desde localStorage al inicio
    loadUsersFromStorage();
    
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si no está logueado y no está en la página de login, redirigir
    if (!isLoggedIn && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
        return;
    }
    
    // Si está logueado y está en la página de login, redirigir según el rol
    if (isLoggedIn && (currentPage === 'index.html' || currentPage === '')) {
        const userRole = localStorage.getItem('userRole');
        
        // Redirigir según el rol
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else if (userRole === 'worker') {
            window.location.href = 'cuidador.html';
        } else if (userRole === 'family') {
            window.location.href = 'familia.html';
        }
        return;
    }
    
    // Configurar eventos solo si estamos en la página de login
    if (currentPage === 'index.html' || currentPage === '') {
        setupLoginEvents();
    }
    
    // Configurar eventos de las páginas de construcción
    if (currentPage === 'admin.html' || currentPage === 'cuidador.html' || currentPage === 'familia.html') {
        setupConstructionEvents();
    }
});

function setupLoginEvents() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const loginError = document.getElementById('loginError');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Buscar usuario en la lista de usuarios cargada desde localStorage
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user && user.status === 'active') {
                // Guardar estado de login
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', user.role);
                
                // Redirigir según el rol
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else if (user.role === 'worker') {
                    window.location.href = 'cuidador.html';
                } else if (user.role === 'family') {
                    window.location.href = 'familia.html';
                }
            } else if (user && user.status === 'inactive') {
                loginError.textContent = 'Tu cuenta está desactivada. Contacta al administrador.';
                loginError.classList.remove('hidden');
            } else {
                loginError.textContent = 'Usuario o contraseña incorrectos';
                loginError.classList.remove('hidden');
            }
        });
    }
    
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                passwordInput.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            
            lucide.createIcons();
        });
    }
}

function setupConstructionEvents() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }
    
    // Mostrar información del usuario
    displayUserInfo();
}

function displayUserInfo() {
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    const userFullName = document.getElementById('userFullName');
    const userRoleElement = document.getElementById('userRole');
    
    if (userFullName && username) {
        userFullName.textContent = username;
    }
    
    if (userRoleElement && userRole) {
        const roleLabels = {
            admin: { text: 'Administrador', class: 'bg-red-100 text-red-800' },
            worker: { text: 'Cuidador', class: 'bg-green-100 text-green-800' },
            family: { text: 'Familia', class: 'bg-blue-100 text-blue-800' }
        };
        
        const role = roleLabels[userRole];
        if (role) {
            userRoleElement.textContent = role.text;
            userRoleElement.className = `text-xs px-2 py-1 rounded-full ${role.class}`;
        }
    }
}

// Función para obtener todos los usuarios
function getUsers() {
    return users;
}

// Función para obtener el texto del rol
function getRoleText(role) {
    const roleLabels = {
        admin: 'Administrador',
        worker: 'Cuidador',
        family: 'Familia'
    };
    return roleLabels[role] || role;
}

// Función para obtener que clase de CSS va según el rol
function getRolColorClass(role) {
    const rolColor = {
        admin: 'rolColor-admin',
        worker: 'rolColor-worker',
        family: 'rolColor-family'
    };
    return rolColor[role];
}

// Función para obtener el estado del usuario
function getUserStatus(status) {
    const statusConfig = {
        active: { text: 'Activo', class: 'bg-green-100 text-green-800' },
        inactive: { text: 'Inactivo', class: 'bg-red-100 text-red-800' }
    };
    return statusConfig[status] || statusConfig.inactive;
}

// Función para generar la tabla de usuarios
function generateUsersTable() {
    const tbody = document.querySelector('#usersTab tbody');
    if (!tbody) return;
    
    const usersList = getUsers();
    tbody.innerHTML = '';
    
    usersList.forEach(user => {
        const roleText = getRoleText(user.role);
        const rolColorClass = getRolColorClass(user.role);
        const userStatus = getUserStatus(user.status);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-4 py-4">
                <div class="d-flex align-items-center">
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
                    <button class="btn btn-sm text-sky-600 p-1" title="Editar">
                        <i data-lucide="edit" style="width: 1rem; height: 1rem;"></i>
                    </button>
                    <button class="btn btn-sm text-red-600 p-1" title="Eliminar">
                        <i data-lucide="trash-2" style="width: 1rem; height: 1rem;"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Recrear los iconos de Lucide
    lucide.createIcons();
}

// Función para actualizar las estadísticas del dashboard
function updateDashboardStats() {
    const usersList = getUsers();
    const totalUsers = usersList.length;
    const workers = usersList.filter(user => user.role === 'worker').length;
    const families = usersList.filter(user => user.role === 'family').length;
    const admins = usersList.filter(user => user.role === 'admin').length;
    const activeUsers = usersList.filter(user => user.status === 'active').length;
    
    // Actualizar contadores en el dashboard
    const totalUsersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(1) .h2');
    const workersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(2) .h2');
    const familiesElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(3) .h2');
    const activeUsersElement = document.querySelector('#dashboardTab .col-md-6.col-lg-3:nth-child(4) .h2');
    
    if (totalUsersElement) totalUsersElement.textContent = totalUsers;
    if (workersElement) workersElement.textContent = workers;
    if (familiesElement) familiesElement.textContent = families;
    if (activeUsersElement) activeUsersElement.textContent = activeUsers;
}


// Función para inicializar la página de administrador
function initializeAdminPage() {
    if (window.location.pathname.includes('admin.html')) {
        updateDashboardStats();
        generateUsersTable();
        setupModalEventListeners();
    }
}

// Función para cambiar entre pestañas
function switchTab(tabId) {
    // Ocultar todos los contenidos de pestañas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // Remover clase active de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar el contenido de la pestaña seleccionada
    document.getElementById(tabId + 'Tab').style.display = 'block';
    
    // Agregar clase active al enlace seleccionado
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Función para abrir modal de crear usuario
function openCreateUserModal() {
    const modal = new bootstrap.Modal(document.getElementById('createUserModal'));
    modal.show();
}


// Función para manejar la creación de usuarios
function handleCreateUser(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const newUser = {
        username: formData.get('username'),
        password: formData.get('password'),
        email: formData.get('email'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        role: formData.get('role'),
        status: 'active'
    };
    
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.username === newUser.username);
    if (existingUser) {
        showAlert('error', 'Error', 'El nombre de usuario ya existe');
        return;
    }
    
    // Agregar el nuevo usuario
    users.push(newUser);
    
    // Guardar en localStorage
    saveUsersToStorage();
    
    // Cerrar modal y limpiar formulario
    const modal = bootstrap.Modal.getInstance(document.getElementById('createUserModal'));
    modal.hide();
    form.reset();
    
    // Actualizar la interfaz
    updateDashboardStats();
    generateUsersTable();
    
    showAlert('success', 'Usuario Creado', 'El nuevo usuario ha sido creado exitosamente');
}

// Función para cambiar el estado del usuario (activo/inactivo)
function toggleUserStatus(userId) {
    const user = users.find(u => u.username === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        
        // Guardar en localStorage
        saveUsersToStorage();
        
        updateDashboardStats();
        generateUsersTable();
        const status = user.status === 'active' ? 'activado' : 'desactivado';
        showAlert('info', 'Estado Cambiado', `El usuario ha sido ${status} correctamente`);
    }
}

// Función para mostrar alertas personalizadas
function showAlert(type, title, message, duration = 5000) {
    const alertId = 'alert-' + Date.now();
    const iconMap = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
            <div class="d-flex align-items-center">
                <i data-lucide="${iconMap[type]}" class="me-2" style="width: 1rem; height: 1rem;"></i>
                <strong>${title}</strong>
            </div>
            <p class="mb-0 mt-1">${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    lucide.createIcons();
    
    // Eliminar alert tras 5 segundos
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, duration);
}

// Función para configurar los event listeners de los modales
function setupModalEventListeners() {
    // Event listener para el formulario de crear usuario
    const createUserForm = document.getElementById('createUserForm');
    if (createUserForm) {
        createUserForm.addEventListener('submit', handleCreateUser);
    }
}

// limpiar datos de localStorage
function clearLocalStorage() {
    localStorage.removeItem('cuidarUsers');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    // Recargar la página para aplicar los cambios
    window.location.reload();
}