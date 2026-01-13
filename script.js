// ================== GLOBAL ===================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// ================== USER FUNCTIONS ===================

// Submit Complaint
function submitComplaint() {
    let nameInput = document.getElementById("name");
    let titleInput = document.getElementById("title");
    let descInput = document.getElementById("desc");

    if (!nameInput || !titleInput || !descInput) return;

    if (!nameInput.value || !titleInput.value) {
        alert("Please fill all required fields");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    let complaint = {
        id: Date.now(),
        name: nameInput.value,
        title: titleInput.value,
        desc: descInput.value,
        status: "Submitted"
    };

    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted Successfully!");

    nameInput.value = "";
    titleInput.value = "";
    descInput.value = "";

    showUserComplaints();
}

// Show user complaints
function showUserComplaints() {
    let div = document.getElementById("myComplaints");
    if (!div) return;

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    div.innerHTML = "";

    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints yet</p>";
        return;
    }

    complaints.forEach(c => {
        div.innerHTML += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${c.title}</b><br>
                Status: ${c.status}
            </div>
        `;
    });
}

// ================== ADMIN LOGIN ===================

// Check login status
function checkAdminLogin() {
    const loginBox = document.getElementById("loginBox");
    const dashboard = document.getElementById("adminDashboard");
    if (!loginBox || !dashboard) return;

    if (sessionStorage.getItem("adminLoggedIn") === "true") {
        loginBox.style.display = "none";
        dashboard.style.display = "block";
        loadAdminComplaints();
    }
}

// Login function
function adminLogin() {
    const userInput = document.getElementById("adminUser");
    const passInput = document.getElementById("adminPass");

    if (!userInput || !passInput) return;

    const user = userInput.value;
    const pass = passInput.value;

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
    const dashboard = document.getElementById("adminDashboard");
    if (!dashboard) return;

    let div = document.getElementById("allComplaints");
    if (!div) return;

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    div.innerHTML = "";

    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints submitted yet</p>";
        return;
    }

    complaints.forEach(c => {
        div.innerHTML += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${c.title}</b><br>
                User: ${c.name}<br>
                Description: ${c.desc}<br>
                Status: ${c.status}<br>
                ${c.status !== "Resolved" ? `<button onclick="resolveComplaint(${c.id})">Resolve</button>` : ""}
            </div>
        `;
    });
}

// Resolve complaint
function resolveComplaint(id) {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        alert("Unauthorized access");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    complaints = complaints.map(c => {
        if (c.id === id) c.status = "Resolved";
        return c;
    });

    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadAdminComplaints();
}
