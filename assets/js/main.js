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

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "pages/components/header.html");
  loadPartial("nav", "pages/components/navbar.html");
  loadPartial("footer", "pages/components/footer.html");
  // loadPartial("sidebar","pages/components/sidebar.html")
});