const editEmployeeForm = document.getElementById("editEmployeeForm");

const employeeIdInput = document.getElementById("employeeId");

const employeeNameInput = document.getElementById("employeeName");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const departmentInput = document.getElementById("department");

const designationInput = document.getElementById("designation");

const salaryInput = document.getElementById("salary");

const joiningDateInput = document.getElementById("joiningDate");

const message = document.getElementById("message");

const parameters = new URLSearchParams(window.location.search);

const employeeDatabaseId = parameters.get("id");

function showMessage(text, type) {
  message.textContent = text;

  message.className = `alert ${type}`;

  message.hidden = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function formatInputDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  return String(dateValue).split("T")[0];
}

async function loadDepartments() {
  const response = await fetch("/api/departments");

  if (response.status === 401) {
    window.location.href = "/login.html";

    return;
  }

  const departments = await response.json();

  if (!response.ok) {
    throw new Error(departments.message);
  }

  departmentInput.innerHTML = `
        <option value="">
            Select Department
        </option>
    `;

  departments.forEach((department) => {
    const option = document.createElement("option");

    option.value = department.id;

    option.textContent = department.name;

    departmentInput.appendChild(option);
  });
}

async function loadEmployee() {
  if (!employeeDatabaseId) {
    showMessage("Employee ID is missing", "error");

    return;
  }

  try {
    await loadDepartments();

    const response = await fetch(`/api/employees/${employeeDatabaseId}`);

    if (response.status === 401) {
      window.location.href = "/login.html";

      return;
    }

    const employee = await response.json();

    if (!response.ok) {
      showMessage(employee.message, "error");

      return;
    }

    employeeIdInput.value = employee.employee_id;

    employeeNameInput.value = employee.name;

    emailInput.value = employee.email;

    phoneInput.value = employee.phone || "";

    departmentInput.value = employee.department_id;

    designationInput.value = employee.designation;

    salaryInput.value = employee.salary;

    joiningDateInput.value = formatInputDate(employee.joining_date);
  } catch (error) {
    console.error(error);

    showMessage("Unable to load employee information", "error");
  }
}

editEmployeeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!employeeDatabaseId) {
    showMessage("Employee ID is missing", "error");

    return;
  }

  const employeeData = {
    employee_id: employeeIdInput.value.trim(),

    name: employeeNameInput.value.trim(),

    email: emailInput.value.trim(),

    phone: phoneInput.value.trim(),

    department_id: departmentInput.value,

    designation: designationInput.value.trim(),

    salary: salaryInput.value,

    joining_date: joiningDateInput.value,
  };

  try {
    const response = await fetch(`/api/employees/${employeeDatabaseId}`, {
      method: "PUT",

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

    setTimeout(() => {
      window.location.href = "/employees.html";
    }, 1200);
  } catch (error) {
    console.error(error);

    showMessage("Unable to connect to server", "error");
  }
});

loadEmployee();
