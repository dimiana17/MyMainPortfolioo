// services.js
document.addEventListener("DOMContentLoaded", () => {
  const catBtns = document.querySelectorAll('.services-box .icon a');

  catBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // prevent default link behavior if href exists

      const category = this.dataset.category;
      if (!category) return;

      // Store selected category
      localStorage.setItem("selectedCategory", category);

      // Dispatch custom event to update portfolio
      window.dispatchEvent(new CustomEvent('categorySelected', { detail: { category } }));

      // Activate portfolio section
      const portfolioSection = document.querySelector('#portfolio');
      const sections = document.querySelectorAll('section');
      const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

      // Remove 'active' class from all sections
      sections.forEach(section => section.classList.remove('active'));
      // Add 'active' to portfolio
      if (portfolioSection) portfolioSection.classList.add('active');

      // Update navbar
      navLinks.forEach(link => link.classList.remove('act'));
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#portfolio') link.classList.add('act');
      });
    });
  });
});
