async function capture() {
    const url = document.getElementById('url').value;
    if (!url) return;

    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').innerHTML = '';

    try {
        const data = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
        if (data.error) {
            throw data.error;
        }

        const { image } = await data.json();

        document.getElementById('result').innerHTML = `
            <div class="card">
                <img src="${image}" alt="Preview of ${url}" />
                <div class="label">${url}</div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        document.getElementById('result').innerHTML = `<p style="color:red">${error}</p>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}