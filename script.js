// ================== GLOBAL ===================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@2026";

// ================== UTILITY FUNCTIONS ===================
// Escape HTML to prevent injection
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// ================== USER FUNCTIONS ===================

// Submit Complaint
function submitComplaint() {
    const nameInput = document.getElementById("name");
    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("desc");

    if (!nameInput.value.trim() || !titleInput.value.trim()) {
        alert("Please fill all required fields");
        return;
    }

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const complaint = {
        id: Date.now(),
        name: nameInput.value.trim(),
        title: titleInput.value.trim(),
        desc: descInput.value.trim(),
        status: "Submitted",
        timestamp: new Date().toLocaleString()
    };

    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    // Clear inputs
    nameInput.value = "";
    titleInput.value = "";
    descInput.value = "";

    // Show feedback
    alert("Complaint Submitted Successfully!");
    showUserComplaints();
}

// Show user complaints
function showUserComplaints() {
    const div = document.getElementById("myComplaints");
    if (!div) return;

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints yet</p>";
        return;
    }

    let html = "";
    complaints.forEach(c => {
        html += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${escapeHTML(c.title)}</b><br>
                <span class="status ${c.status}">${c.status}</span><br>
                ${escapeHTML(c.desc) ? `<p>${escapeHTML(c.desc)}</p>` : ""}
                <small>Submitted on: ${c.timestamp}</small>
            </div>
        `;
    });

    div.innerHTML = html;
}

// ================== ADMIN LOGIN FUNCTIONS ===================

// Check login status on page load
function checkAdminLogin() {
    const loginBox = document.getElementById("loginBox");
    const dashboard = document.getElementById("adminDashboard");
    if (!loginBox || !dashboard) return;

    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        loginBox.style.display = "none";
        dashboard.style.display = "block";
        loadAdminComplaints();
    } else {
        loginBox.style.display = "block";
        dashboard.style.display = "none";
    }
}

// Admin login
function adminLogin() {
    const userInput = document.getElementById("adminUser");
    const passInput = document.getElementById("adminPass");

    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
        sessionStorage.setItem("adminLoggedIn", "true");
        checkAdminLogin();
    } else {
        alert("Invalid admin credentials");
    }
}

// Logout
function logout() {
    sessionStorage.removeItem("adminLoggedIn");
    location.reload();
}

// ================== ADMIN FUNCTIONS ===================

// Load all complaints in admin dashboard
function loadAdminComplaints() {
    const div = document.getElementById("allComplaints");
    if (!div) return;

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints submitted yet</p>";
        return;
    }

    let html = "";
    complaints.forEach(c => {
        html += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${escapeHTML(c.title)}</b><br>
                <span class="status ${c.status}">${c.status}</span><br>
                <b>User:</b> ${escapeHTML(c.name)}<br>
                <b>Description:</b> ${escapeHTML(c.desc)}<br>
                <small>Submitted on: ${c.timestamp}</small><br>
                ${c.status !== "Resolved" ? `<button onclick="resolveComplaint(${c.id})">Resolve</button>` : ""}
            </div>
        `;
    });

    div.innerHTML = html;
}

// Resolve a complaint
function resolveComplaint(id) {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        alert("Unauthorized access");
        return;
    }

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    const updatedComplaints = complaints.map(c => {
        if (c.id === id) c.status = "Resolved";
        return c;
    });

    localStorage.setItem("complaints", JSON.stringify(updatedComplaints));
    loadAdminComplaints();
    showUserComplaints();
}



