
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission
    let form = this;

    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { "Accept": "application/json" }
    }).then(response => {
        if (response.ok) {
            alert("Message sent successfully!");
            form.reset();
        } else {
            alert("Error sending message. Try again.");
        }
    }).catch(error => alert("Something went wrong."));
});
