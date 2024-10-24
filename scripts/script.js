document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  function showSection(id) {
    sections.forEach((section) => {
      section.classList.toggle("d-none", section.id !== id);
    });
  }

  // Show the first section by default
  showSection("identity");

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const sectionId = this.getAttribute("data-section");
      showSection(sectionId);
    });
  });
});
