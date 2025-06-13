const API_BASE = "http://127.0.0.1:5000";

// Globální ochrana proti submitu formuláře na stránce
window.addEventListener("submit", function(e) {
  e.preventDefault();
}, true);

// Funkce pro zobrazení popupu pro sloty 2 a 3
function showSlotPopup(day, recordMap, types, token) {
  const popup = document.getElementById("slotPopup");
  const popupForm = document.getElementById("slotPopupForm");
  popupForm.innerHTML = "";
  for (let s = 2; s <= 3; s++) {
    const key = `${day.id}_${s}`;
    const rec = recordMap[key] || {};
    const formRow = document.createElement("div");
    formRow.style.display = "flex";
    formRow.style.gap = "0.5em";
    formRow.style.marginBottom = "0.5em";
    formRow.innerHTML = `<b>Slot ${s}:</b>`;

    const nInput = document.createElement("input");
    nInput.value = rec.name || "";
    nInput.placeholder = "Name";
    const tSelect = document.createElement("select");
    const defOpt = document.createElement("option");
    defOpt.textContent = "--";
    defOpt.value = "";
    tSelect.appendChild(defOpt);
    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.code;
      opt.textContent = t.code;
      opt.title = t.label;
      if (t.code === rec.training_type) opt.selected = true;
      tSelect.appendChild(opt);
    });
    function updateTSelectTitle() {
      const selected = types.find(t => t.code === tSelect.value);
      tSelect.title = selected ? selected.label : "";
    }
    updateTSelectTitle();
    tSelect.addEventListener("change", updateTSelectTitle);

    const dInput = document.createElement("input");
    dInput.type = "number";
    dInput.min = "0";
    dInput.step = "0.01";
    dInput.style.width = "5em";
    dInput.value = rec.distance || "";
    dInput.placeholder = "Distance";

    const durInput = document.createElement("input");
    durInput.type = "number";
    durInput.min = "0";
    durInput.step = "1";
    durInput.style.width = "4em";
    durInput.value = rec.duration || "";
    durInput.placeholder = "Duration";

    const detInput = document.createElement("input");
    detInput.value = rec.detail || "";
    detInput.placeholder = "Detail";

    const ch = document.createElement("input");
    ch.type = "checkbox";
    ch.checked = rec.completed || false;

    [nInput, tSelect, dInput, durInput, detInput, ch].forEach(el => {
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      el.addEventListener("change", async () => {
        const payload = {
          training_day_id: day.id,
          slot: s,
          name: nInput.value,
          training_type: tSelect.value,
          distance: parseFloat(dInput.value) || 0,
          duration: parseInt(durInput.value) || 0,
          detail: detInput.value,
          completed: ch.checked,
        };
        const method = rec.id ? "PUT" : "POST";
        const url = rec.id ? `${API_BASE}/api/training/${rec.id}` : `${API_BASE}/api/training`;
        const res = await fetch(url, {
          method,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const updated = await res.json();
        if (updated.training?.id) rec.id = updated.training.id;
      });
    });

    formRow.appendChild(nInput);
    formRow.appendChild(tSelect);
    formRow.appendChild(dInput);
    formRow.appendChild(durInput);
    formRow.appendChild(detInput);
    formRow.appendChild(ch);
    popupForm.appendChild(formRow);
  }
  popup.style.display = "flex";
  // Zavření popupu
  document.getElementById("slotPopupClose").onclick = () => {
    popup.style.display = "none";
  };
  // Zavření kliknutím mimo obsah
  popup.onclick = (e) => {
    if (e.target === popup) popup.style.display = "none";
  };
};

document.addEventListener("DOMContentLoaded", async () => {
  // DEBUG: testovací text do sidebarProfileUsername
  const sidebarUsername = document.getElementById("sidebarProfileUsername");
  if (sidebarUsername) sidebarUsername.textContent = "TESTUSERNAME";
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Not logged in!");
    window.location.href = "index.html";
    return;
  }

  await loadUserProfile(token);
  
  const yearSelect = document.getElementById("yearSelect");
  const currentSeason = getCurrentSeasonYear();

  // Načti dostupné sezóny z backendu
  let seasons = await fetchJson(`${API_BASE}/api/seasons`, token);
  // Zajisti, že existuje následující sezóna
  const nextSeasonYear = currentSeason + 1;
  if (!seasons.includes(nextSeasonYear)) {
    try {
      await fetch(`${API_BASE}/api/seasons`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ year: nextSeasonYear })
      });
      // Po vytvoření znovu načti seznam sezón
      seasons = await fetchJson(`${API_BASE}/api/seasons`, token);
    } catch (e) {
      // případná chyba se ignoruje
    }
  }
  yearSelect.innerHTML = "";
  let foundCurrent = false;
  seasons.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === currentSeason) {
      opt.selected = true;
      foundCurrent = true;
    }
    yearSelect.appendChild(opt);
  });
  // Žádná možnost Nová sezóna... – pouze existující sezóny
  yearSelect.addEventListener("change", async (e) => {
    await renderTrainingTable(token, parseInt(e.target.value));
  });

  // Vyber aktuální sezónu nebo první dostupnou
  await renderTrainingTable(token, foundCurrent ? currentSeason : seasons[0]);
});

async function renderTrainingTable(token, year) {
  const [days, records, types] = await Promise.all([
    fetchJson(`${API_BASE}/api/training/days?year=${year}`, token),
    fetchJson(`${API_BASE}/api/training?year=${year}`, token),
    fetchJson(`${API_BASE}/api/training/types`, token, false),
  ]);

  const recordMap = {};
  records.forEach(r => {
    const key = `${r.training_day_id}_${r.slot}`;
    recordMap[key] = r;
  });

  const tableBody = document.querySelector("#trainingTable tbody");
  tableBody.innerHTML = "";

  days.forEach(day => {
    // Vykresli pouze slot 1 a tlačítko ˅
    const slot = 1;
    const key = `${day.id}_${slot}`;
    const record = recordMap[key] || {};
    const row = document.createElement("tr");
    // Datum a rozbalovací tlačítko
    const tdDate = document.createElement("td");
    // Datum ve formátu 12. 6. 2025
    const dateObj = new Date(day.date);
    const dateStr = `${dateObj.getDate()}. ${dateObj.getMonth() + 1}. ${dateObj.getFullYear()}`;
    const dayName = dateObj.toLocaleDateString("cs-CZ", { weekday: "long" });
    tdDate.innerHTML = `<div>${dateStr}</div><div class='dayname'>${dayName}</div>`;
    row.appendChild(tdDate);

    // Rozbalovací tlačítko
    const tdExpand = document.createElement("td");
    const expandBtn = document.createElement("button");
    expandBtn.textContent = "˅";
    expandBtn.className = "expand-btn";
    expandBtn.style.fontSize = "1.2em";
    expandBtn.style.cursor = "pointer";
    tdExpand.appendChild(expandBtn);
    row.appendChild(tdExpand);

    // Popup logika pro sloty 2 a 3
    expandBtn.addEventListener("click", () => {
      showSlotPopup(day, recordMap, types, token);
    });

    // Ostatní buňky slotu 1
    const nameInput = document.createElement("input");
    nameInput.value = record.name || "";

    const typeSelect = document.createElement("select");
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "--";
    defaultOption.value = "";
    typeSelect.appendChild(defaultOption);
    types.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.code;
      opt.textContent = t.code;
      opt.title = t.label;
      if (t.code === record.training_type) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    function updateTypeSelectTitle() {
      const selected = types.find(t => t.code === typeSelect.value);
      typeSelect.title = selected ? selected.label : "";
    }
    updateTypeSelectTitle();
    typeSelect.addEventListener("change", updateTypeSelectTitle);

    const distanceInput = document.createElement("input");
    distanceInput.type = "number";
    distanceInput.min = "0";
    distanceInput.step = "0.01";
    distanceInput.style.width = "5em";
    distanceInput.value = record.distance || "";

    const durationInput = document.createElement("input");
    durationInput.type = "number";
    durationInput.min = "0";
    durationInput.step = "1";
    durationInput.style.width = "4em";
    durationInput.value = record.duration || "";

    const detailInput = document.createElement("input");
    detailInput.value = record.detail || "";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = record.completed || false;

    const tdName = document.createElement("td");
    tdName.appendChild(nameInput);
    const tdType = document.createElement("td");
    tdType.appendChild(typeSelect);
    const tdDistance = document.createElement("td");
    tdDistance.appendChild(distanceInput);
    const tdDuration = document.createElement("td");
    tdDuration.appendChild(durationInput);
    const tdDetail = document.createElement("td");
    tdDetail.appendChild(detailInput);
    const tdDone = document.createElement("td");
    tdDone.appendChild(check);

    [nameInput, typeSelect, distanceInput, durationInput, detailInput, check].forEach(el => {
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      el.addEventListener("change", async () => {
        const payload = {
          training_day_id: day.id,
          slot,
          name: nameInput.value,
          training_type: typeSelect.value,
          distance: parseFloat(distanceInput.value) || 0,
          duration: parseInt(durationInput.value) || 0,
          detail: detailInput.value,
          completed: check.checked,
        };

        const method = record.id ? "PUT" : "POST";
        const url = record.id ? `${API_BASE}/api/training/${record.id}` : `${API_BASE}/api/training`;

        const res = await fetch(url, {
          method,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const updated = await res.json();
        if (updated.training?.id) record.id = updated.training.id;
      });
    });

    row.appendChild(tdName);
    row.appendChild(tdType);
    row.appendChild(tdDistance);
    row.appendChild(tdDuration);
    row.appendChild(tdDetail);
    row.appendChild(tdDone);

    tableBody.appendChild(row);

    // (původní rozbalovací logika pro sloty 2 a 3 byla nahrazena popupem)
  });
}

async function loadUserProfile(token) {
  const res = await fetch(`${API_BASE}/api/user/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const profile = await res.json();
  if (res.ok) {
    document.getElementById("userLabel").textContent =
      `User: ${profile.first_name} ${profile.last_name}`;
    // Nastav jméno a příjmení i do sidebaru
    const sidebarName = document.getElementById("sidebarProfileName");
    if (sidebarName) {
      sidebarName.textContent = `${profile.first_name} ${profile.last_name}`;
    }
    const sidebarUsername = document.getElementById("sidebarProfileUsername");
    if (sidebarUsername) {
      sidebarUsername.textContent = profile.username;
    }
  } else {
    document.getElementById("userLabel").textContent = "User: ?";
  }
}

function getCurrentSeasonYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based: 0 = leden, 10 = listopad

  return (month >= 10) ? year + 1 : year; // listopad/prosinec → další rok
}

async function fetchJson(url, token, auth = true) {
  const res = await fetch(url, {
    headers: auth ? { "Authorization": `Bearer ${token}` } : {}
  });
  return res.ok ? res.json() : [];
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}