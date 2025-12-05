// portfolio.js (Revised for Collapse and Image Swapper)

document.addEventListener("DOMContentLoaded", () => {
  const portfolioContainer = document.querySelector(".portfolio-container");
  let category = localStorage.getItem("selectedCategory") || null;

  // --- Image Swapper Logic ---
  function setupImageSwapper(projectElement, images) {
    if (!images || images.length <= 1) return; // No swapper needed for 0 or 1 image

    const swapperContainer = projectElement.querySelector(".image-swapper");

    // Add navigation buttons
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

  // --- Project Fetch & Display Logic ---
  window.fetchAndDisplayProjects = async function (category) {
    try {
      const url = category
        ? `http://localhost:5000/projects?category=${category}`
        : "http://localhost:5000/projects";

      const response = await fetch(url);
      const projects = await response.json();

      if (!Array.isArray(projects))
        throw new Error("Projects not returned as array");

      portfolioContainer.innerHTML = ""; // Clear container

      projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("portfolio-box");

        // 1. Generate Image Tags for Swapper
        let imageTags = "";
        if (project.images && project.images.length > 0) {
          project.images.forEach((src, index) => {
            // Mark the first image as active
            const isActive = index === 0 ? "active" : "";
            const fullSrc = `http://localhost:5000${src}`;
            imageTags += `<img src="${fullSrc}" alt="${project.title} - Image ${
              index + 1
            }" class="${isActive}" />`;
          });
        } else {
          // Fallback to placeholder if no images
          imageTags = `<img src="placeholder.png" alt="No image available" class="active" />`;
        }

        projectElement.innerHTML = `
                    <div class="project-header">
                        <h2>${project.title}</h2>
                        <span class="collapse-icon">&#9660;</span>
                    </div>
                    <div class="project-details collapsed">
                        
                        <p>${project.description}</p>
                        <hr>
                        <div class="image-swapper">
                            ${imageTags}
                        </div>
                        <a href="${project.link}" target="_blank">Github Link</a>
                    </div>
                `;
        portfolioContainer.appendChild(projectElement);

        // 2. Setup Collapse and Swapper Listeners
        const header = projectElement.querySelector(".project-header");
        const details = projectElement.querySelector(".project-details");
        const icon = projectElement.querySelector(".collapse-icon");

        header.addEventListener("click", () => {
          details.classList.toggle("collapsed");
          icon.innerHTML = details.classList.contains("collapsed")
            ? "&#9660;"
            : "&#9650;";
        });

        // Set up the swapper after the elements are in the DOM
        setupImageSwapper(projectElement, project.images);
      });
    } catch (error) {
      console.error("Error loading projects:", error);
      portfolioContainer.innerHTML =
        "<p>Failed to load projects. Please try again later.</p>";
    }
  };

  // Initial load and category listeners remain the same
  window.addEventListener("categorySelected", (event) => {
    window.fetchAndDisplayProjects(event.detail.category);
  });
  window.fetchAndDisplayProjects(category);
});
