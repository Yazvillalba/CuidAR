// Mensajes de Alerta, con estilos propios
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
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, duration);
} 