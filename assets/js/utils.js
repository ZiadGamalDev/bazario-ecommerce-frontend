// const baseUrl = 'http://127.0.0.1:8000';

const baseUrl = 'https://ecommerce.ershaad.net';
const token = 'customer-static-token';
const adminToken = 'admin-static-token';

function loadPartial(selector, filePath, callback) {
<<<<<<< HEAD
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

=======
  const element = document.querySelector(selector);
  if (element) {
    fetch(filePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        return response.text();
      })
      .then((html) => {
        element.innerHTML = html;
        if (callback) callback();
      })
      .catch((error) => console.error(error));
  }
}
>>>>>>> d5de0ecdc0df3b69bae4ff3f8c4880b7a4228796
