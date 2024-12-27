function loadPartial(selector, filePath) {
    const element = document.querySelector(selector);
    if (element) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
            })
            .catch(error => console.error(error));
    }
}