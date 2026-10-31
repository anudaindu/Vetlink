// ===========================
// VetLink — Toast Notifications
// ===========================
// Replaces all alert() calls with elegant slide-in toast messages

(function () {
    'use strict';

    // Create toast container on load
    document.addEventListener('DOMContentLoaded', function () {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
    });

    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - 'success' | 'error' | 'warning' | 'info'
     * @param {number} duration - Auto-dismiss in ms (default 4000)
     */
    window.showToast = function (message, type, duration) {
        type = type || 'info';
        duration = duration || 4000;

        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;

        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            <div class="toast-progress"><div class="toast-progress-bar"></div></div>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(function () {
            toast.classList.add('toast-show');
        });

        // Set progress bar animation
        const bar = toast.querySelector('.toast-progress-bar');
        if (bar) {
            bar.style.transition = 'width ' + duration + 'ms linear';
            requestAnimationFrame(function () {
                bar.style.width = '0%';
            });
        }

        // Auto dismiss
        setTimeout(function () {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
            setTimeout(function () { toast.remove(); }, 300);
        }, duration);
    };

    /**
     * Show a confirmation modal
     * @param {string} title
     * @param {string} message
     * @param {Function} onConfirm
     * @param {string} confirmText
     * @param {string} type - 'danger' | 'warning' | 'info'
     */
    window.showConfirmModal = function (title, message, onConfirm, confirmText, type) {
        confirmText = confirmText || 'Confirm';
        type = type || 'danger';

        // Remove existing modal
        const existing = document.getElementById('confirm-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel-btn">Cancel</button>
                    <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'} modal-confirm-btn">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        requestAnimationFrame(function () {
            modal.classList.add('modal-show');
        });

        const closeModal = function () {
            modal.classList.remove('modal-show');
            setTimeout(function () { modal.remove(); }, 300);
        };

        modal.querySelector('.modal-cancel-btn').addEventListener('click', closeModal);
        modal.querySelector('.modal-confirm-btn').addEventListener('click', function () {
            closeModal();
            if (onConfirm) onConfirm();
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    };
})();
