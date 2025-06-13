document.getElementById("profileForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not logged in!");
    return;
  }

  const data = {
    first_name: document.getElementById("firstName").value,
    last_name: document.getElementById("lastName").value,
    birthdate: document.getElementById("birthdate").value
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/api/user/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      window.location.href = "dashboard.html";
    } else {
      alert("Error: " + result.error || result.message);
    }
  } catch (err) {
    alert("Connection error.");
    console.error(err);
  }
});