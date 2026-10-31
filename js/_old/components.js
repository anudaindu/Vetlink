/**
 * Reusable UI Components for VetLink
 */

export const Button = ({ text, variant = 'primary', icon, id, type = 'button', className = '' }) => {
    return `
        <button id="${id}" type="${type}" class="btn btn-${variant} ${className}">
            ${icon ? `<i data-lucide="${icon}"></i>` : ''}
            <span>${text}</span>
        </button>
    `;
};

export const Card = ({ title, content, footer, className = '' }) => {
    return `
        <div class="card ${className}">
            ${title ? `<h3 class="card-title">${title}</h3>` : ''}
            <div class="card-body">
                ${content}
            </div>
            ${footer ? `<div class="card-footer">${footer}</div>` : ''}
        </div>
    `;
};

export const Input = ({ label, id, name, type = 'text', placeholder = '', value = '', required = false, options = null }) => {
    const inputHtml = options 
        ? `
            <select id="${id}" name="${name}" class="form-select" ${required ? 'required' : ''}>
                <option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>
                ${options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
        `
        : `<input id="${id}" name="${name}" type="${type}" class="form-input" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>`;

    return `
        <div class="form-group">
            <label for="${id}">${label}${required ? ' *' : ''}</label>
            ${inputHtml}
        </div>
    `;
};

export const SectionHeader = (title, subtitle) => {
    return `
        <div class="section-header">
            <h2>${title}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
    `;
};
