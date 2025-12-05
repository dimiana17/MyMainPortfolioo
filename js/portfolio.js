// portfolio.js (Revised for JSON Fetch + Collapse + Image Swapper)

document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.querySelector(".portfolio-container");
  let category = localStorage.getItem("selectedCategory") || null;

  // --- Image Swapper Logic ---
  function setupImageSwapper(projectElement, images) {
    if (!images || images.length <= 1) return;

    const swapperContainer = projectElement.querySelector(".image-swapper");

    // FIX: Enclose HTML in backticks (Template Literal)
    swapperContainer.innerHTML += `
      <button class="prev-btn">Prev</button>
      <button class="next-btn">Next</button>
    `;

    // Note: The images are already built and appended in fetchAndDisplayProjects
    const imageElements = swapperContainer.querySelectorAll("img");
    let currentIndex = 0;

    const updateImage = (newIndex) => {
      imageElements[currentIndex].classList.remove("active");
      currentIndex = newIndex;
      imageElements[currentIndex].classList.add("active");
    };

    projectElement.querySelector(".next-btn").addEventListener("click", () => {
      const nextIndex = (currentIndex + 1) % images.length;
      updateImage(nextIndex);
    });

    projectElement.querySelector(".prev-btn").addEventListener("click", () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage(prevIndex);
    });
  }

  // --- Fetch Projects from JSON ---
  window.fetchAndDisplayProjects = async function (category) {
    try {
      // NOTE: Ensure the path /public/data/projects.json is correct for your server
      const response = await fetch("projects.json");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const allProjects = await response.json();

      if (!Array.isArray(allProjects)) throw new Error("JSON must return an array of projects.");

      const projects = category
        ? allProjects.filter((p) => p.category === category)
        : allProjects;

      portfolioContainer.innerHTML = "";

      if (projects.length === 0) {
        portfolioContainer.innerHTML = `<p></p>`;
        return;
      }

      projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("portfolio-box");

        // Build images
        let imageTags = "";
        if (project.images && project.images.length > 0) {
          console.log(project.images);
          project.images.forEach((src, i) => {
            const isActive = i === 0 ? "active" : "";
            // FIX: Enclose HTML in backticks
            imageTags += `<img src="${src}" class="${isActive}" alt="${project.title} image ${i + 1}">`;
          });
        } else {
          // FIX: Enclose HTML in backticks
          imageTags = `<img src="placeholder.png" class="active">`;
        }

        // Build card
        // FIX: Enclose the entire multi-line HTML block in backticks
        projectElement.innerHTML = `
          <div class="project-header">
            <h2>${project.title}</h2>
            <span class="collapse-icon">&#9660;</span>
          </div>

          <div class="project-details collapsed">
            <p>${project.description}</p>
            <hr>

            <div class="image-swapper">${imageTags}</div>

            <a href="${project.link}" target="_blank">View GitHub</a>
          </div>
        `;
        portfolioContainer.appendChild(projectElement);

        // Collapse Logic
        const header = projectElement.querySelector(".project-header");
        const details = projectElement.querySelector(".project-details");
        const icon = projectElement.querySelector(".collapse-icon");

        header.addEventListener("click", () => {
          details.classList.toggle("collapsed");
          icon.innerHTML = details.classList.contains("collapsed")
            ? "&#9660;" // Down arrow
            : "&#9650;"; // Up arrow
        });

        // Setup image swapper
        setupImageSwapper(projectElement, project.images);
      });
    } catch (err) {
      console.error("Error fetching or displaying projects:", err);
      portfolioContainer.innerHTML = "<p>Error loading projects. Check console for details.</p>";
    }
  };

  // Category selection event listener
  window.addEventListener("categorySelected", (event) => {
    // Save the new category to maintain state on page reload/navigation
    localStorage.setItem("selectedCategory", event.detail.category);
    window.fetchAndDisplayProjects(event.detail.category);
  });

  // Initial load
  window.fetchAndDisplayProjects(category);
});
