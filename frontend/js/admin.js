const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const resultsTableBody = document.getElementById("resultsTableBody");
const statusText = document.getElementById("statusText");

if (!token || role !== "admin") {
  window.location.href = "index.html";
}

async function loadAdminData() {
  try {
    const [dashboardResponse, resultsResponse, violationsResponse] = await Promise.all([
      fetch("https://skillhire-nodejs-1.onrender.com/api/admin/dashboard", {
        headers: { Authorization: "Bearer " + token }
      }),
      fetch("https://skillhire-nodejs-1.onrender.com/api/admin/results", {
        headers: { Authorization: "Bearer " + token }
      }),
      fetch("https://skillhire-nodejs-1.onrender.com/api/admin/violations", {
        headers: { Authorization: "Bearer " + token }
      })
    ]);

    const dashboard = await dashboardResponse.json();
    const results = await resultsResponse.json();
    const violations = await violationsResponse.json();

    if (!dashboardResponse.ok || !resultsResponse.ok || !violationsResponse.ok) {
      throw new Error((dashboard.message || results.message || violations.message) || "Unable to load admin data");
    }

    document.getElementById("totalUsers").textContent = dashboard.totalUsers || 0;
    document.getElementById("totalResults").textContent = dashboard.totalResults || 0;
    document.getElementById("totalViolations").textContent = dashboard.totalViolations || 0;

    const violationMap = Array.isArray(violations)
      ? violations.reduce((acc, item) => {
          const id = item.userId && item.userId._id ? item.userId._id : item.userId;
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {})
      : {};

    if (!Array.isArray(results) || results.length === 0) {
      statusText.textContent = "No candidate results yet.";
      resultsTableBody.innerHTML = "<tr><td colspan='6'>No results available.</td></tr>";
      return;
    }

    statusText.textContent = `${results.length} result(s) available`;
    resultsTableBody.innerHTML = results
      .map((item) => {
        const user = item.userId || {};
        const userId = user._id || "";
        const score = item.totalScore ?? (item.aptitudeScore || 0) + (item.reasoningScore || 0);
        const percent = typeof item.percentage === "number" ? item.percentage.toFixed(2) : "0.00";
        const submittedAt = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
        const violationCount = violationMap[userId] || 0;

        return `
          <tr>
            <td>${user.username || "Unknown Candidate"}</td>
            <td>${user.email || "—"}</td>
            <td>${score}</td>
            <td>${percent}%</td>
            <td>${violationCount}</td>
            <td>${submittedAt}</td>
          </tr>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Admin dashboard error:", error);
    statusText.textContent = error.message;
    resultsTableBody.innerHTML = "<tr><td colspan='6'>Unable to load results.</td></tr>";
  }
}

function downloadCsv() {
  const rows = Array.from(resultsTableBody.querySelectorAll("tr"));

  if (!rows.length) {
    alert("No results available to export.");
    return;
  }

  const csvRows = [
    ["Candidate", "Email", "Score", "Percentage", "Violations", "Submitted"],
    ...rows.map((row) => Array.from(row.querySelectorAll("td")).map((cell) => cell.textContent.trim()))
  ];

  const csvContent = csvRows
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "candidate-results.csv";
  link.click();
  URL.revokeObjectURL(url);
}

loadAdminData();

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "index.html";
});

document.getElementById("exportBtn").addEventListener("click", downloadCsv);
