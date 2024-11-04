
document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is remembered
    if (localStorage.getItem("rememberMe") === "true") {
        document.getElementById("username").value = localStorage.getItem("username");
        document.getElementById("rememberMe").checked = true;
    }
});

function validateForm() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("rememberMe").checked;
    const errorMsg = document.getElementById("error-msg");

    if (!username || !password) {

        errorMsg.textContent = "Both username and password are required!";
        return false;

    } else if (password.length < 6) {

        errorMsg.textContent = "Password must be at least 6 characters long!";

        return false;
    } else {
        errorMsg.textContent = "";

        // Remember Me functionality
        if (rememberMe) {
            localStorage.setItem("username", username);
            localStorage.setItem("rememberMe", true);
        } else {
            localStorage.removeItem("username");
            localStorage.removeItem("rememberMe");
        }

        // Form is valid
        alert("Login successful!");
        return true;
    }
}
