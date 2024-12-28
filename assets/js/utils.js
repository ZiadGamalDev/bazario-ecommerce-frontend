// const baseUrl = 'http://127.0.0.1:8000';
const baseUrl = 'https://ecommerce.ershaad.net';
const token = '1|mrVWnuPejI3DxDnAivijXlAHqizxXLcNFFus7ucqa374c833';
const adminToken = '1|1AF5oYQQMPbetlaWGjKMdEIIolraXDeyZt2Eeh0s70da0d9c';

function loadPartial(selector, filePath, callback) {
    const element = document.querySelector(selector);
    if (element) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                return response.text();
            })
            .then(html => {
                element.innerHTML = html;
                if (callback) callback();
            })
            .catch(error => console.error(error));
    }
}

