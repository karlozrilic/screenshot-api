async function capture() {
    const url = document.getElementById('url').value;
    if (!url) return;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';

    try {
        const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || 'Something went wrong');
        }

        document.getElementById('result').innerHTML = `
            <div class="card">
                <img src="${data.image}" alt="Preview of ${url}" />
                <div class="label">${url}</div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = `<p style="color:red">${error.message}</p>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}