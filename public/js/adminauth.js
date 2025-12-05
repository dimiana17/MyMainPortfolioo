// js/adminAuth.js

(function() {
    // !!! IMPORTANT: CHANGE THIS TO YOUR UNIQUE PASSWORD !!!
    const SECRET_KEY = "MyPrivateAdminKey2025"; 
    const IS_ADMIN_KEY = "isAdminAuthorized";

    const isAuthorized = localStorage.getItem(IS_ADMIN_KEY) === 'true';

    // If accessing admin.html directly and not authorized
    if (window.location.pathname.includes('admin.html') && !isAuthorized) {
        const userKey = prompt("Enter the admin secret key to access this dashboard:");

        if (userKey === SECRET_KEY) {
            localStorage.setItem(IS_ADMIN_KEY, 'true');
            alert("Access granted. Welcome, Admin.");
            // Reload to ensure all dashboard elements load correctly after authorization
            window.location.reload(); 
        } else {
            alert("Access Denied. Redirecting to the main page.");
            window.location.href = 'index.html'; 
        }
    }
})();