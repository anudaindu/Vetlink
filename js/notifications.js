// ============================================================================
// VetLink — High-Performance Notifications & Modal System (60 FPS, Zero CLS)
// ============================================================================

(function () {
    'use strict';

    const containerId = 'toast-container';

    function getOrCreateContainer() {
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.setAttribute('aria-live', 'polite');
            container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Show a 60 FPS GPU-accelerated toast notification
     * @param {string} message - Content to display
     * @param {'success'|'error'|'warning'|'info'} [type='info'] - Style variant
     * @param {number} [duration=3800] - Lifespan in milliseconds
     */
    window.showToast = function (message, type, duration) {
        type = type || 'info';
        duration = duration || 3800;

        const container = getOrCreateContainer();
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');

        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };

        toast.innerHTML = `
            <div class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
            <div class="toast-progress"><div class="toast-progress-bar"></div></div>
        `;

        function dismiss() {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
            setTimeout(() => toast.remove(), 250);
        }

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) closeBtn.addEventListener('click', dismiss);

        container.appendChild(toast);

        // Hardware accelerated entrance
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        const bar = toast.querySelector('.toast-progress-bar');
        if (bar) {
            bar.style.transition = `transform ${duration}ms linear`;
            requestAnimationFrame(() => {
                bar.style.transform = 'scaleX(0)';
            });
        }

        let timer = setTimeout(dismiss, duration);
        toast.addEventListener('mouseenter', () => clearTimeout(timer));
        toast.addEventListener('mouseleave', () => {
            timer = setTimeout(dismiss, 1200);
        });
    };

    /**
     * Accessible confirm modal with anti-spam execution guard and focus isolation
     */
    window.showConfirmModal = function (title, message, onConfirm, confirmText, type) {
        confirmText = confirmText || 'Confirm';
        type = type || 'danger';

        const existing = document.getElementById('confirm-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'confirm-modal';
        modal.className = 'modal-overlay';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'modal-title');

        modal.innerHTML = `
            <div class="modal-card fade-in" style="max-width: 440px;">
                <div class="modal-header flex items-center" style="justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 15px;">
                    <h3 id="modal-title" style="margin: 0;">${title}</h3>
                    <button class="modal-close-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
                </div>
                <div class="modal-body mb-20" style="color: #475569; font-size: 0.95rem; line-height: 1.5;">
                    <p style="margin: 0;">${message}</p>
                </div>
                <div class="modal-footer flex gap-10" style="justify-content: flex-end;">
                    <button class="btn btn-outline btn-modal-cancel" style="min-width: 90px;">Cancel</button>
                    <button class="btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'} btn-modal-confirm" style="min-width: 110px;">${confirmText}</button>
                </div>
            </div>
        `;

        function close() {
            modal.classList.remove('modal-show');
            setTimeout(() => modal.remove(), 200);
        }

        modal.querySelector('.modal-close-btn')?.addEventListener('click', close);
        modal.querySelector('.btn-modal-cancel')?.addEventListener('click', close);

        const confirmBtn = modal.querySelector('.btn-modal-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', async () => {
                if (window.UIEngine && window.UIEngine.isClickSpam(confirmBtn)) return;
                if (window.UIEngine) window.UIEngine.lockElement(confirmBtn, 'Processing...');

                try {
                    await Promise.resolve(onConfirm());
                    close();
                } catch (err) {
                    console.error('[ConfirmModal Error]', err);
                    if (window.UIEngine) window.UIEngine.unlockElement(confirmBtn);
                }
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.classList.add('modal-show');
            confirmBtn?.focus();
        });
    };
})();
