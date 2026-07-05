const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message;
      message.hidden = false;
      return;
    }

    window.location.href = "/dashboard.html";
  } catch (error) {
    message.textContent = "Unable to connect to server";
    message.hidden = false;
  }
});
