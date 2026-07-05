async function checkLogin() {
  try {
    const response = await fetch("/api/auth/check");

    const data = await response.json();

    if (!data.loggedIn) {
      window.location.href = "/login.html";
    }
  } catch (error) {
    console.error("Login check error:", error);
  }
}

async function logout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Logout failed");
      return;
    }

    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
    alert("Unable to logout");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  checkLogin();
});
