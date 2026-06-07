import { escapeHtml } from './helpers/html_escape.js';

let docsLoaded = false;

export async function openHelp() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (!docsLoaded) {
        await loadDocs();
        docsLoaded = true;
    }
}

export function closeHelp() {
    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
}

export async function loadDocs() {
    const body = document.getElementById('modal-body');

    try {
        const res = await fetch('https://raw.githubusercontent.com/karlozrilic/screenshot-api/refs/heads/master/README.md');
        if (!res.ok) throw new Error(`Failed to load README (${res.status})`);
        const md = await res.text();

        body.innerHTML = `<div class="md-content">${marked.parse(md)}</div>`;
    } catch (err) {
        body.innerHTML = `
            <div class="error-box">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M6.5 4v3M6.5 9v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                Could not load README.md — ${escapeHtml(err.message)}
            </div>
        `;
    }
}

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeHelp();
});