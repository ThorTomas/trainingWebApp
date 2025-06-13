document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const identifier = document.getElementById("identifier").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });

    const result = await response.json();
    const msg = document.getElementById("loginMessage");

    if (response.ok) {
      msg.textContent = result.message;
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
      // zde můžeš redirect nebo uložit token do localStorage
    } else {
      msg.textContent = result.error || result.message;
    }
  } catch (err) {
    document.getElementById("loginMessage").textContent = "Chyba připojení k serveru.";
  }
});