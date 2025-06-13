document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const msg = document.getElementById("registerMessage");

  // Password validation
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  if (password.length < 6 || !hasLetter || !hasDigit) {
    msg.textContent = "Password must be at least 6 characters long and contain at least one letter and one number.";
    return;
  }

  if (password !== confirmPassword) {
    msg.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const result = await response.json();

    if (response.ok) {
      msg.textContent = result.message;
      localStorage.setItem("token", result.token);
      localStorage.setItem("username", result.username);
      // Vytvoření aktuální a následující sezóny
      const token = result.token;
      const currentYear = (function() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        return (month >= 10) ? year + 1 : year;
      })();
      const nextYear = currentYear + 1;
      try {
        await fetch("http://127.0.0.1:5000/api/seasons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ year: currentYear })
        });
        await fetch("http://127.0.0.1:5000/api/seasons", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ year: nextYear })
        });
      } catch (e) {
        // případná chyba při vytváření sezóny se ignoruje
      }
      window.location.href = "register2_profile.html";
    } else {
      msg.textContent = result.error || result.message || "Registration failed.";
    }
  } catch (err) {
    document.getElementById("registerMessage").textContent = "Connection error.";
  }
});