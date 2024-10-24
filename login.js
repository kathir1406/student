// Simple client-side validation or effects can be added here
// For example, showing/hiding the error message or password field toggle

// Example: Hide the error message if the form is resubmitted

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", function() {
        errorMessage.textContent = '';  // Clear the error message on form submission
    });
});
