export async function copyImage(dataUrl) {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        const label = document.getElementById('copy-label');
        if (label) {
            label.textContent = 'Copied!';
            setTimeout(() => { label.textContent = 'Copy'; }, 2000);
        }
    } catch {
        // Clipboard API not available or denied
    }
}