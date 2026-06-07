import { escapeHtml } from './html_escape.js';

export function errorBox(message) {
    return `
        <div class="error-box">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.2"/>
                <path d="M6.5 4v3M6.5 9v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
            ${escapeHtml(message)}
        </div>
    `;
}