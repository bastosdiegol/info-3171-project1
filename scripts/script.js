// Dynamic Content Loading
document.addEventListener("DOMContentLoaded", function () {
  const contentArea = document.getElementById("content-area");

  // Function to dynamically load content
  function loadContent(url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        contentArea.innerHTML = data;
        // Re-apply event listeners after content is loaded
        bindDynamicContentEvents();
      })
      .catch((error) => {
        contentArea.innerHTML = "Error loading content.";
        console.error("Error fetching content:", error);
      });
  }

  // Function to bind event listeners to dynamic links
  function bindDynamicContentEvents() {
    const links = document.querySelectorAll(".nav-link, .load-content");

    // Remove any previous listeners by cloning nodes (this clears old listeners)
    links.forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });

    // Now bind new listeners without stacking
    document.querySelectorAll(".nav-link, .load-content").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const contentUrl = this.getAttribute("data-content");
        if (contentUrl) {
          loadContent(contentUrl);
        }
      });
    });
  }

  // Initial load of identity.html by default
  loadContent("./content/identity.html");

  // Initial binding of events on page load
  bindDynamicContentEvents();
});
