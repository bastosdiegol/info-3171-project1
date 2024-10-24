// Dynamic Content Loading
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".nav-link");
  const contentArea = document.getElementById("content-area");

  function loadContent(url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        contentArea.innerHTML = data;
      })
      .catch((error) => {
        contentArea.innerHTML = "Error loading content.";
        console.error("Error fetching content:", error);
      });
  }

  // Load identity.html by default
  loadContent("../content/identity.html");

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const contentUrl = this.getAttribute("data-content");
      loadContent(contentUrl);
    });
  });
});
