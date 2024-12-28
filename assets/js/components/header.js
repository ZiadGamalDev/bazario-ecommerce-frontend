// *reloader
window.addEventListener("load", () => {
    document.querySelector(".preloader").classList.add("preloader-deactivate");
  });
  
  // *Features
  document
    .querySelector(".pro-features .get-pro")
    .addEventListener("click", () => {
      document.querySelector(".pro-features").classList.toggle("active");
    });
  
  // *Header scroll
  document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("scroll", function () {
      var header = document.querySelector(".header");
      if (window.scrollY > 100) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
  });
  
  // *window scroll
  const toTop = document.querySelector(".backTop");
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 200) {
      toTop.classList.add("active");
    } else {
      toTop.classList.remove("active");
    }
  });