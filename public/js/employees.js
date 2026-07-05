const employeeTableBody = document.getElementById("employeeTableBody");

const searchForm = document.getElementById("searchForm");

const searchInput = document.getElementById("searchInput");

const clearButton = document.getElementById("clearButton");

const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;

  message.className = `alert ${type}`;

  message.hidden = false;

  setTimeout(() => {
    message.hidden = true;
  }, 3000);
}

function formatSalary(salary) {
  const amount = Number(salary);

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-IN");
}

async function loadEmployees(search = "") {
  try {
    employeeTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    Loading employees...
                </td>
            </tr>
        `;

    const response = await fetch(
      `/api/employees?search=${encodeURIComponent(search)}`,
    );

    if (response.status === 401) {
      window.location.href = "/login.html";

      return;
    }

    const employees = await response.json();

    if (!response.ok) {
      throw new Error(employees.message);
    }

    employeeTableBody.innerHTML = "";

    if (employees.length === 0) {
      employeeTableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty">
                        No employees found.
                    </td>
                </tr>
            `;

      return;
    }

    employees.forEach((employee) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>
                    ${employee.employee_id}
                </td>

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.phone || "-"}
                </td>

                <td>
                    ${employee.department_name}
                </td>

                <td>
                    ${employee.designation}
                </td>

                <td>
                    ${formatSalary(employee.salary)}
                </td>

                <td>
                    ${formatDate(employee.joining_date)}
                </td>

                <td>
                    <div class="actions">

                        <a
                            class="button small"
                            href="edit-employee.html?id=${employee.id}"
                        >
                            Edit
                        </a>

                        <button
                            type="button"
                            class="danger small"
                            data-id="${employee.id}"
                        >
                            Delete
                        </button>

                    </div>
                </td>
            `;

      const deleteButton = row.querySelector(".danger");

      deleteButton.addEventListener("click", () => {
        deleteEmployee(employee.id);
      });

      employeeTableBody.appendChild(row);
    });
  } catch (error) {
    employeeTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty">
                    Unable to load employees.
                </td>
            </tr>
        `;

    showMessage(error.message, "error");
  }
}

async function deleteEmployee(id) {
  const confirmed = confirm("Are you sure you want to delete this employee?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message, "error");

      return;
    }

    showMessage(data.message, "success");

    loadEmployees(searchInput.value.trim());
  } catch (error) {
    showMessage("Unable to connect to server", "error");
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  loadEmployees(searchInput.value.trim());
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";

  loadEmployees();
});

loadEmployees();
