// services.js
document.addEventListener("DOMContentLoaded", () => {
  const catBtns = document.querySelectorAll(".services-box .icon a");

  catBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      // Decode category to convert '%20' into space
      const category = decodeURIComponent(btn.dataset.category);
      console.log("Category selected:", category);
      if (!category) return;

      // Save selected category
      localStorage.setItem("selectedCategory", category);

      // Notify portfolio.js to filter projects
      window.dispatchEvent(
        new CustomEvent("categorySelected", { detail: { category } })
      );

      // --- Page Section Navigation ---
      const portfolioSection = document.querySelector("#portfolio");
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

      // Remove active from all sections
      sections.forEach(sec => sec.classList.remove("active"));

      // Activate portfolio section
      portfolioSection?.classList.add("active");

      // Fix navbar selected item
      navLinks.forEach(link => link.classList.remove("act"));
      navLinks.forEach(link => {
        if (link.getAttribute("href") === "#portfolio") {
          link.classList.add("act");
        }
      });

      // Smooth scroll (optional)
      portfolioSection?.scrollIntoView({ behavior: "smooth" });
    });
  });
});
