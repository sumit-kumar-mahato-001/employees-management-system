const employeeForm = document.getElementById("employeeForm");

const department = document.getElementById("department");

const message = document.getElementById("message");

async function loadDepartments() {
  try {
    const response = await fetch("/api/departments");

    if (response.status === 401) {
      window.location.href = "/login.html";

      return;
    }

    const departments = await response.json();

    department.innerHTML = `
            <option value="">
                Select Department
            </option>
        `;

    departments.forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id;

      option.textContent = item.name;

      department.appendChild(option);
    });
  } catch (error) {
    showMessage("Unable to load departments", "error");
  }
}

function showMessage(text, type) {
  message.textContent = text;

  message.className = `alert ${type}`;

  message.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

employeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const employeeData = {
    employee_id: document.getElementById("employeeId").value.trim(),

    name: document.getElementById("employeeName").value.trim(),

    email: document.getElementById("email").value.trim(),

    phone: document.getElementById("phone").value.trim(),

    department_id: department.value,

    designation: document.getElementById("designation").value.trim(),

    salary: document.getElementById("salary").value,

    joining_date: document.getElementById("joiningDate").value,
  };

  try {
    const response = await fetch("/api/employees", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(employeeData),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message, "error");

      return;
    }

    showMessage(data.message, "success");

    employeeForm.reset();

    setTimeout(() => {
      window.location.href = "/employees.html";
    }, 1200);
  } catch (error) {
    showMessage("Unable to connect to server", "error");
  }
});

loadDepartments();
