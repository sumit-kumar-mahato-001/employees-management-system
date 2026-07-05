const totalEmployees = document.getElementById("totalEmployees");

const totalDepartments = document.getElementById("totalDepartments");

async function loadDashboard() {
  try {
    const response = await fetch("/api/dashboard");

    if (response.status === 401) {
      window.location.href = "/login.html";

      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    totalEmployees.textContent = data.totalEmployees;

    totalDepartments.textContent = data.totalDepartments;
  } catch (error) {
    console.error("Dashboard Error:", error);

    totalEmployees.textContent = "0";

    totalDepartments.textContent = "0";
  }
}

loadDashboard();
