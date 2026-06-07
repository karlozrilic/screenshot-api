import { escapeHtml } from './helpers/html_escape.js';
import { errorBox } from './helpers/error_box.js';

export async function capture() {
    const urlInput = document.getElementById('url');
    const result = document.getElementById('result');
    const url = urlInput.value.trim();

    if (!url) {
        result.innerHTML = errorBox('Please enter a URL.');
        urlInput.focus();
        return;
    }

    try {
        new URL(url);
    } catch {
        result.innerHTML = errorBox('Invalid URL — make sure it starts with https:// or http://');
        urlInput.focus();
        return;
    }

    const btn = document.getElementById('capture-btn');
    const status = document.getElementById('status');

    btn.disabled = true;
    status.style.display = 'block';
    result.innerHTML = '';

    try {
        const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || 'Something went wrong');
        }

        const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

        result.innerHTML = `
            <div class="card">
                <img src="${data.image}" alt="Preview of ${escapeHtml(url)}" />
                <div class="card-footer">
                    <span class="card-url" title="${escapeHtml(url)}">${escapeHtml(displayUrl)}</span>
                    <div class="card-actions">
                        <a class="action-btn" href="${escapeHtml(data.image)}" download="screenshot.png">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 1v6M2.5 5l3 3 3-3M1 10h9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Save
                        </a>
                        <button class="action-btn" onclick="copyImage('${data.image}')">
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
                                <path d="M3.5 3V2.5A1.5 1.5 0 015 1h3.5A1.5 1.5 0 0110 2.5V6A1.5 1.5 0 018.5 7.5H8" stroke="currentColor" stroke-width="1.2"/>
                            </svg>
                            <span id="copy-label">Copy</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        result.innerHTML = `
            <div class="error-box">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" stroke-width="1.2"/>
                    <path d="M6.5 4v3M6.5 9v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
                ${escapeHtml(error.message)}
            </div>
        `;
    } finally {
        btn.disabled = false;
        status.style.display = 'none';
    }
}
