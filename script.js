// Datos de usuarios demo
const users = [
    {
        username: 'admin',
        password: 'admin123',
        firstName: 'Administrador',
        lastName: 'Sistema',
        role: 'admin',
        email: 'admin@cuidar.com'
    },
    {
        username: 'cuidador1',
        password: 'cuidador123',
        firstName: 'María',
        lastName: 'González',
        role: 'caregiver',
        email: 'maria@cuidar.com'
    },
    {
        username: 'familia1',
        password: 'familia123',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        role: 'family',
        email: 'carlos@cuidar.com'
    }
];

let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
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
        } else if (userRole === 'caregiver') {
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
            
            // Credenciales demo
            const validCredentials = [
                { username: 'admin', password: 'admin123', role: 'admin' },
                { username: 'cuidador1', password: 'cuidador123', role: 'caregiver' },
                { username: 'familia1', password: 'familia123', role: 'family' }
            ];
            
            const user = validCredentials.find(cred => 
                cred.username === username && cred.password === password
            );
            
            if (user) {
                // Guardar estado de login
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', user.role);
                
                // Redirigir según el rol
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else if (user.role === 'caregiver') {
                    window.location.href = 'cuidador.html';
                } else if (user.role === 'family') {
                    window.location.href = 'familia.html';
                }
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
            caregiver: { text: 'Cuidador', class: 'bg-green-100 text-green-800' },
            family: { text: 'Familia', class: 'bg-blue-100 text-blue-800' }
        };
        
        const role = roleLabels[userRole];
        if (role) {
            userRoleElement.textContent = role.text;
            userRoleElement.className = `text-xs px-2 py-1 rounded-full ${role.class}`;
        }
    }
} 