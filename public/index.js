async function capture() {
    const url = document.getElementById('url').value;
    if (!url) return;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';

    const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
    const { image } = await res.json();

    document.getElementById('loading').style.display = 'none';
    document.getElementById('result').innerHTML = `
        <div class="card">
            <img src="${image}" alt="Preview of ${url}" />
            <div class="label">${url}</div>
        </div>
    `;
}