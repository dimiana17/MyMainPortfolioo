document.addEventListener("DOMContentLoaded", () => {
    // Inside document.addEventListener("DOMContentLoaded", ...) in js/script.js

const secretAdminTrigger = document.getElementById('secretAdminTrigger');
const adminLoginLink = document.getElementById('adminLoginLink');

if (secretAdminTrigger && adminLoginLink) {
    secretAdminTrigger.addEventListener('click', (e) => {
        e.preventDefault(); 
        adminLoginLink.click();
    });
    secretAdminTrigger.style.cursor = 'pointer';
}
    // 💥 FIX: Exclude the 'Admin Access' link from the list of section-switching navigation links.
    // The Admin link has the ID #adminLoginLink, so we exclude it here.
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(#adminLoginLink)');
    
    // This selection must only include the 5 content sections (Home, Services, Resume, Portfolio, Contact)
    const sections = document.querySelectorAll('section');
    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;

    // Restore last active section
    const savedIndex = localStorage.getItem("activeSection");
    if (savedIndex !== null) setActivePage(parseInt(savedIndex));
    else setActivePage(0);

    // Restore dark mode
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        modeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Navbar click handling for SECTION SWITCHING links
    navLinks.forEach((link, idx) => {
        link.addEventListener('click', (e) => { // Added 'e' for event object
            
            // Prevent the default browser jump, allowing JS to control the view
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault(); 
            }
            
            setActivePage(idx);
            
            if (link.getAttribute('href') === '#portfolio') {
                localStorage.removeItem('selectedCategory');
                window.dispatchEvent(new Event('portfolioSectionClicked'));
            }
        });
    });

    // Resume buttons (No changes needed)
    const resumeBtns = document.querySelectorAll('.resume-btn');
    resumeBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            const details = document.querySelectorAll('.resume-detail');
            resumeBtns.forEach(b => b.classList.remove('active'));
            details.forEach(d => d.classList.remove('active'));
            btn.classList.add('active');
            details[idx].classList.add('active');
        });
    });

    // Dark mode toggle (No changes needed)
    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            modeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("darkMode", "enabled");
        } else {
            modeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // Function to set active page
    function setActivePage(index = 0) {
        // Line 70 (The error line in your report) is likely one of the following:
        // navLinks[index].classList.add('act'); 
        // OR
        // sections[index].classList.add('active');

        // This is safe now because 'navLinks' only contains 5 elements (index 0-4)
        navLinks.forEach(link => link.classList.remove('act'));
        if (navLinks[index]) {
             navLinks[index].classList.add('act');
        }
       
        // This is safe now because 'sections' also only contains 5 elements (index 0-4)
        sections.forEach(section => section.classList.remove('active'));
        if (sections[index]) {
            sections[index].classList.add('active');
        }
        
        localStorage.setItem("activeSection", index);
    }
});