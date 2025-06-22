import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:5000";

function getCurrentSeason() {
  const today = new Date();
  let currentSeasonYear = today.getFullYear();
  if (today.getMonth() + 1 >= 11) {
    currentSeasonYear = today.getFullYear() + 1;
  }
  return currentSeasonYear;
}

function getTodayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useDashboardData() {
  const [user, setUser] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [season, setSeason] = useState(""); // aktuálně vybraná sezóna
  const [days, setDays] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [mainTypes, setMainTypes] = useState([]);
  const todayStr = getTodayStr();

  // Načtení uživatele a sezóny při prvním načtení
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    // Načtení profilu uživatele
    fetch(`${API_BASE}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(profile => setUser(profile));

    // Načtení sezón (a jejich vytvoření, pokud chybí)
    async function loadSeasons() {
      setLoadingSeasons(true);
      const res = await fetch(`${API_BASE}/api/seasons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = await res.json();

      const currentSeasonYear = getCurrentSeason();
      const nextSeasonYear = currentSeasonYear + 1;

      async function createSeason(year) {
        await fetch(`${API_BASE}/api/seasons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ year })
        });
      }

      // Vytvoření aktuální sezóny a následující sezóny (pokud neexistují)
      if (!data.includes(currentSeasonYear)) {
        await createSeason(currentSeasonYear);
      }
      if (!data.includes(nextSeasonYear)) {
        await createSeason(nextSeasonYear);
      }

      // Znovunačtení seznamu sezón (po případném vytvoření)
      const res2 = await fetch(`${API_BASE}/api/seasons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      data = await res2.json();
      setSeasons(data);
      setLoadingSeasons(false);

      // Nastav aktuální sezónu
      if (data.includes(currentSeasonYear)) setSeason(currentSeasonYear);
      else setSeason(data[data.length - 1]);
    }

    loadSeasons();
  }, []);

  // Načtení dnů, tréninků a typů při změně sezóny
  useEffect(() => {
    if (!season) return;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    // Načti dny sezóny
    fetch(`${API_BASE}/api/training/days?year=${season}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setDays);
    // Načti tréninky
    fetch(`${API_BASE}/api/training?year=${season}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setTrainings);
    // Načti hlavní typy tréninku
    fetch(`${API_BASE}/api/training/types`)
      .then(res => res.json())
      .then(setMainTypes);
  }, [season]);

  return {
    user, setUser,
    seasons, setSeasons,
    loadingSeasons, setLoadingSeasons,
    season, setSeason,
    days, setDays,
    trainings, setTrainings,
    mainTypes, setMainTypes,
    getCurrentSeason,
    todayStr,
  };
}