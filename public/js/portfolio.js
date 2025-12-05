// portfolio.js (Revised for JSON Fetch + Collapse + Image Swapper)

document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.querySelector(".portfolio-container");
  let category = localStorage.getItem("selectedCategory") || null;

  // --- Image Swapper Logic ---
  function setupImageSwapper(projectElement, images) {
    if (!images || images.length <= 1) return;

    const swapperContainer = projectElement.querySelector(".image-swapper");

    swapperContainer.innerHTML += `
      <button class="prev-btn">Prev</button>
      <button class="next-btn">Next</button>
    `;

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
      const response = await fetch("/data/projects.json");
      console.log(response);
      console.log(category);
      const allProjects = await response.json();

      if (!Array.isArray(allProjects)) throw new Error("JSON must return array");

      const projects = category
        ? allProjects.filter((p) => p.category === category)
        : allProjects;

      portfolioContainer.innerHTML = "";

      projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("portfolio-box");

        // Build images
        let imageTags = "";
        if (project.images && project.images.length > 0) {
          project.images.forEach((src, i) => {
            const isActive = i === 0 ? "active" : "";
            imageTags += `
              <img src="${src}" class="${isActive}" alt="${project.title} image ${i + 1}">
            `;
          });
        } else {
          imageTags = `<img src="placeholder.png" class="active">`;
        }

        // Build card
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
            ? "&#9660;"
            : "&#9650;";
        });

        // Setup image swapper
        setupImageSwapper(projectElement, project.images);
      });
    } catch (err) {
      console.error(err);
      portfolioContainer.innerHTML = "<p>Error loading projects.</p>";
    }
  };

  // Category selection event
  window.addEventListener("categorySelected", (event) => {
    window.fetchAndDisplayProjects(event.detail.category);
  });

  // Initial load
  window.fetchAndDisplayProjects(category);
});
