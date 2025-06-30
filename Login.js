let users = [];
//carga de usuarios desde el localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('cuidarUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    } else {
        users = [
            { username: 'admin', password: 'admin123', firstName: 'Administrador', lastName: 'Sistema', role: 'admin', email: 'admin@cuidar.com', status: 'active', image: 'Imagenes/Admin.png' },
            { username: 'cuidador1', password: 'cuidador123', firstName: 'María', lastName: 'González', role: 'worker', email: 'maria@cuidar.com', status: 'active', image: 'Imagenes/Trabajador.jpg' },
            { username: 'cuidador2', password: 'cuidador456', firstName: 'Ana', lastName: 'López', role: 'worker', email: 'ana@cuidar.com', status: 'inactive', image: 'Imagenes/Trabajadora1.avif' },
            { username: 'familia1', password: 'familia123', firstName: 'Carlos', lastName: 'Rodríguez', role: 'family', email: 'carlos@cuidar.com', status: 'active', image: 'Imagenes/Familia.jpg' },
            { username: 'familia3', password: 'familia789', firstName: 'Roberto', lastName: 'Pérez', role: 'family', email: 'roberto@cuidar.com', status: 'inactive', image: 'Imagenes/familia2.jpg' }
        ];
        saveUsersToStorage();
    }
}

//guardar usuarios en el localStorage
function saveUsersToStorage() {
    localStorage.setItem('cuidarUsers', JSON.stringify(users));
}

let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    loadUsersFromStorage();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    if (!isLoggedIn && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
        return;
    }
    if (isLoggedIn && (currentPage === 'index.html' || currentPage === '')) {
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else if (userRole === 'worker') {
            window.location.href = 'cuidador.html';
        } else if (userRole === 'family') {
            window.location.href = 'familia.html';
        }
        return;
    }
    if (currentPage === 'index.html' || currentPage === '') {
        setupLoginEvents();
    }
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
            const user = users.find(u => u.username === username && u.password === password);
            if (user && user.status === 'active') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', user.role);
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else if (user.role === 'worker') {
                    window.location.href = 'cuidador.html';
                } else if (user.role === 'family') {
                    window.location.href = 'familia.html';
                }
            } else if (user && user.status === 'inactive') {
                loginError.textContent = 'Tu cuenta está desactivada.';
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