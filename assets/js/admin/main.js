document.addEventListener("DOMContentLoaded", () => {
  loadPartial("aside", "../components/sidebar.html", () => {
    const sidebarLinks = document.querySelectorAll(".sidebar a");
    const currentPath = window.location.pathname.split("/").pop();

    sidebarLinks.forEach((link) => {
      const linkPath = link.getAttribute("href").split("/").pop();
      if (linkPath === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    const logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener("click", logout);
  });
});
