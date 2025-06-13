document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebarToggle");
  toggle.onclick = () => {
    sidebar.classList.toggle("open");
  };

  // Dynamické načtení jména uživatele (pokud je k dispozici v localStorage)
  const nameSpan = document.getElementById("sidebarProfileName");
  const username = localStorage.getItem("username");
  if (username) {
    nameSpan.textContent = username;
  }
  // Pokud budete mít profilové foto v localStorage nebo z API, nastavte zde
  // document.getElementById("sidebarProfilePic").src = ...
});
