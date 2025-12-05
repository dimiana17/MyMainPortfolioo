document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('projectForm');
    const imagesInput = document.getElementById('images');
    const portfolioContainer = document.querySelector('.portfolio-container');

    if (!projectForm || !imagesInput) {
        console.error('Project form or images input not found');
        return;
    }

    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const files = imagesInput.files;

        // 1. Limit files to 5 (This check is good)
        if (files.length > 5) {
            alert('You can only upload up to 5 images');
            return;
        }

        // 2. Create FormData from the form (This automatically includes all named fields, including 'images')
        const formData = new FormData(projectForm);

        // 3. !!! REMOVED !!! The explicit file appending loop is removed 
        //    because FormData(projectForm) already handled the files from the 
        //    <input name="images"> element.
        
        try {
            const response = await fetch('http://localhost:5000/projects', {
                method: 'POST',
                // IMPORTANT: Do NOT set Content-Type header manually.
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Project added successfully!');
                projectForm.reset();

                // Refresh project list if container exists
                if (portfolioContainer && typeof fetchAndDisplayProjects === 'function') {
                    fetchAndDisplayProjects(); 
                }
            } else {
                console.error('Server response:', data);
                // Check for the error message field to provide better feedback
                alert('Failed to add project: ' + (data.message || 'Unknown error. Check console.'));
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('Error submitting project');
        }
    });
});