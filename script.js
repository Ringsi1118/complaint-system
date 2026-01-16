// ================== GLOBAL ===================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@2026";

// ================== LOAD & UPDATE OLD COMPLAINTS ===================
let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
let updated = false;

complaints.forEach(c => {
    if (!c.timestamp) {
        c.timestamp = new Date().toLocaleString();
        updated = true;
    }
});

if (updated) localStorage.setItem("complaints", JSON.stringify(complaints));

// ================== UTILITY ===================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// ================== USER FUNCTIONS ===================
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

    nameInput.value = "";
    titleInput.value = "";
    descInput.value = "";

    alert("Complaint Submitted Successfully!");
    showUserComplaints();
}

function showUserComplaints() {
    const div = document.getElementById("myComplaints");
    if (!div) return;

    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints yet</p>";
        return;
    }

    complaints.sort((a, b) => b.id - a.id);

    let html = "";
    complaints.forEach(c => {
        html += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${escapeHTML(c.title)}</b><br>
                <span class="status ${c.status}">${c.status}</span><br>
                <small>Submitted on: ${c.timestamp || "Unknown"}</small>
            </div>
        `;
    });

    div.innerHTML = html;
}

// ================== ADMIN LOGIN ===================
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

function logout() {
    sessionStorage.removeItem("adminLoggedIn");
    location.reload();
}

// ================== ADMIN FUNCTIONS ===================
function loadAdminComplaints() {
    const div = document.getElementById("allComplaints");
    if (!div) return;

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // Filter/search
    const search = document.getElementById("search")?.value.toLowerCase() || "";
    const filter = document.getElementById("filter")?.value || "all";

    complaints = complaints.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search) || c.title.toLowerCase().includes(search);
        const matchesFilter = filter === "all" || c.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (complaints.length === 0) {
        div.innerHTML = "<p>No complaints found</p>";
        return;
    }

    complaints.sort((a, b) => b.id - a.id);

    let html = "";
    complaints.forEach(c => {
        html += `
            <div class="complaint ${c.status === "Resolved" ? "resolved" : ""}">
                <b>${escapeHTML(c.title)}</b><br>
                <span class="status ${c.status}">${c.status}</span><br>
                <b>User:</b> ${escapeHTML(c.name)}<br>
                <b>Description:</b> ${escapeHTML(c.desc)}</b><br>
                <small>Submitted on: ${c.timestamp || "Unknown"}</small><br>
                ${c.status !== "Resolved" ? `<button style="background:#4caf50" onclick="resolveComplaint(${c.id})">Resolve</button>` : ""}
                <button style="background:#e53935" onclick="deleteComplaint(${c.id})">Delete</button>
            </div>
        `;
    });

    div.innerHTML = html;
}

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
    showUserComplaints();
}

function deleteComplaint(id) {
    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        alert("Unauthorized access");
        return;
    }

    let complaints = JSON.parse(localStorage.getItem("complaints")) || [];
    complaints = complaints.filter(c => c.id !== id);
    localStorage.setItem("complaints", JSON.stringify(complaints));
    loadAdminComplaints();
    showUserComplaints();
}

// ================== INITIAL LOAD ===================
showUserComplaints();
checkAdminLogin();
