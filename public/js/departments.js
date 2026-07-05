const departmentForm = document.getElementById("departmentForm");

const departmentTableBody = document.getElementById("departmentTableBody");

const departmentName = document.getElementById("departmentName");

const departmentId = document.getElementById("departmentId");

const oldDepartmentId = document.getElementById("oldDepartmentId");

const departmentIdBox = document.getElementById("departmentIdBox");

const formTitle = document.getElementById("formTitle");

const submitButton = document.getElementById("submitButton");

const cancelButton = document.getElementById("cancelButton");

const message = document.getElementById("message");

function showMessage(text, type) {
  message.textContent = text;

  message.className = `alert ${type}`;

  message.hidden = false;

  setTimeout(() => {
    message.hidden = true;
  }, 3000);
}

async function loadDepartments() {
  const response = await fetch("/api/departments");

  if (response.status === 401) {
    window.location.href = "/login.html";

    return;
  }

  const departments = await response.json();

  departmentTableBody.innerHTML = "";

  departments.forEach((department) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${department.id}</td>

            <td>${department.name}</td>

            <td>${department.employee_count}</td>

            <td>
                <div class="actions">

                    <button
                        class="small"
                        onclick="editDepartment(
                            ${department.id},
                            '${department.name.replace(/'/g, "\\'")}'
                        )"
                    >
                        Edit
                    </button>

                    <button
                        class="danger small"
                        onclick="deleteDepartment(
                            ${department.id}
                        )"
                    >
                        Delete
                    </button>

                </div>
            </td>
        `;

    departmentTableBody.appendChild(row);
  });
}

departmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const editing = Boolean(oldDepartmentId.value);

  let response;

  if (editing) {
    response = await fetch(`/api/departments/${oldDepartmentId.value}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: departmentId.value,
        name: departmentName.value,
      }),
    });
  } else {
    response = await fetch("/api/departments", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: departmentName.value,
      }),
    });
  }

  const data = await response.json();

  if (!response.ok) {
    showMessage(data.message, "error");

    return;
  }

  showMessage(data.message, "success");

  resetForm();

  loadDepartments();
});

function editDepartment(id, name) {
  oldDepartmentId.value = id;

  departmentId.value = id;

  departmentName.value = name;

  departmentIdBox.hidden = false;

  cancelButton.hidden = false;

  formTitle.textContent = "Edit Department";

  submitButton.textContent = "Update Department";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function deleteDepartment(id) {
  const confirmed = confirm("Delete this department?");

  if (!confirmed) {
    return;
  }

  const response = await fetch(`/api/departments/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  showMessage(data.message, response.ok ? "success" : "error");

  if (response.ok) {
    loadDepartments();
  }
}

function resetForm() {
  departmentForm.reset();

  oldDepartmentId.value = "";

  departmentIdBox.hidden = true;

  cancelButton.hidden = true;

  formTitle.textContent = "Add Department";

  submitButton.textContent = "Add Department";
}

cancelButton.addEventListener("click", resetForm);

loadDepartments();
