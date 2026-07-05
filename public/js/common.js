function confirmDelete(type) {
  return confirm(`Are you sure you want to delete this ${type}?`);
}

function validateEmployeeForm(form) {
  const phone = form.phone.value.trim();
  const salary = Number(form.salary.value);

  if (phone && !/^\d{10}$/.test(phone)) {
    alert('Phone number must contain exactly 10 digits.');
    form.phone.focus();
    return false;
  }

  if (salary < 0) {
    alert('Salary cannot be negative.');
    form.salary.focus();
    return false;
  }

  return true;async function checkLogin() {
    const response = await fetch("/api/auth/check");

    const data = await response.json();

    if (!data.loggedIn) {
      window.location.href = "/login.html";
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login.html";
  }

  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  checkLogin();
}
