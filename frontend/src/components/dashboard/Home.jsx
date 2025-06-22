import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TrainingTable } from "./trainingHome/TrainingTable";
import { EditTrainingPopup } from "./trainingHome/EditTrainingPopup";
import  TrainingsHeader  from "./trainingHome/TrainingsHeader";
import {
  formatDuration,
  parseDurationToMinutes,
  formatDurationFull,
  getDayName,
  formatDateWithDay,
  isPhaseEmpty,
  emptyPhase
} from "./trainingHome/utilsTrainingHome";
import { Pagination } from "./trainingHome/Pagination";

// API adresa backendu
const API_BASE = "http://127.0.0.1:5000";
const SLOT_COUNT = 5; // maximální počet fází na den



function Home() {
  // Kontext z Dashboardu (sezóny, uživatel, atd.)
  const {
    seasons, loadingSeasons, season, setSeason,
    days, trainings, setTrainings, mainTypes, user, getCurrentSeason, 
    todayStr
  } = useOutletContext();
  const { t, i18n } = useTranslation();
  const daysShort = t("days_short", { returnObjects: true });

  // Stav pro aktuální sezónu, dny, tréninky, typy, popup atd.
  const [subTypesMap, setSubTypesMap] = useState({}); // mapování hlavní typ -> subtypy
  const [editDayId, setEditDayId] = useState(null); // id dne, který edituji v popupu
  const [editTab, setEditTab] = useState(1); // aktivní fáze v popupu
  const [editVals, setEditVals] = useState({ 1: emptyPhase() }); // hodnoty pro editaci fází
  // Inline editace pro slot 1: distance, duration, main_ttype, sub_ttype, detail
  const [editingCell, setEditingCell] = useState(null); // { dayId, field }
  const [cellEditValue, setCellEditValue] = useState(""); // aktuální hodnota v inputu
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("asc");
  const [searchColumn, setSearchColumn] = useState(null); // "name" nebo "detail"
  const [searchValue, setSearchValue] = useState("");
  const [selectedCycles, setSelectedCycles] = useState([]); // pole čísel cyklů
  const [goToTodayAfterSeasonChange, setGoToTodayAfterSeasonChange] = useState(false);

  const [page, setPage] = useState(() => {
    const last = localStorage.getItem("dashboardLastPage");
    if (last) {
      try {
        const { page: lastPage, pageSize: lastPageSize, season: lastSeason } = JSON.parse(last);
        // Pokud je uložená stránka pro stejný pageSize a season, použij ji
        const savedPageSize = Number(localStorage.getItem("dashboardPageSize"));
        const savedSeason = Number(localStorage.getItem("dashboardSeason"));
        if (
          lastPage &&
          lastPageSize === (savedPageSize > 0 ? savedPageSize : days?.length) &&
          (!season || lastSeason === savedSeason)
        ) {
          return lastPage;
        }
      } catch {}
    }
    return 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const saved = Number(localStorage.getItem("dashboardPageSize"));
    return saved > 0 ? saved : days.length;
  });

  // Po načtení sezón nastav aktuální sezónu
  useEffect(() => {
    if (seasons && seasons.length > 0) {
      const current = getCurrentSeason();
      if (seasons.includes(current)) setSeason(current);
      else setSeason(seasons[seasons.length - 1]);
    }
  }, [seasons, getCurrentSeason]);

  // Vytvoření mapy: { [training_day_id]: { slot: trainingRecord } }
  const trainingMap = {};
  trainings.forEach(t => {
    if (!trainingMap[t.training_day_id]) trainingMap[t.training_day_id] = {};
    trainingMap[t.training_day_id][t.slot] = t;
  });

  // Načti subtypy pro hlavní typ (pokud už nejsou v cache)
  const fetchSubTypes = (mainType, cb) => {
    if (subTypesMap[mainType]) {
      cb(subTypesMap[mainType]);
      return;
    }
    fetch(`${API_BASE}/api/training/types?main_type=${mainType}`)
      .then(res => res.json())
      .then(data => {
        setSubTypesMap(prev => ({ ...prev, [mainType]: data }));
        cb(data);
      });
  };

  // Otevře popup pro editaci dne, připraví editVals pro existující fáze (minimálně 1)
  const openEditPopup = (day) => {
    const slots = trainingMap[day.id] || {};
    const vals = {};
    Object.keys(slots).forEach(slotStr => {
      const slot = Number(slotStr);
      const t = slots[slot];
      vals[slot] = {
        name: t?.name || "",
        main_ttype: t?.m || "",
        sub_ttype: t?.s || "",
        detail: t?.detail || "",
        distance: t?.distance ? t.distance.toFixed(2) : "",
        duration: t?.duration ? formatDuration(t.duration) : "",
        completed: t?.completed || false,
        id: t?.id || null,
      };
    });
    if (!vals[1]) vals[1] = emptyPhase(); // vždy musí být fáze 1
    setEditDayId(day.id);
    setEditTab(1);
    setEditVals(vals);
    if (vals[1].main_ttype) fetchSubTypes(vals[1].main_ttype, () => {});
  };

  // Změna hodnoty v popupu pro konkrétní slot (fázi)
  const handleEditChange = (slot, field, value) => {
    setEditVals(prev => ({
      ...prev,
      [slot]: { ...prev[slot], [field]: value }
    }));
    // Pokud se mění hlavní typ, resetuj subtyp a načti nové subtypy
    if (field === "main_ttype") {
      setEditVals(prev => ({
        ...prev,
        [slot]: { ...prev[slot], main_ttype: value, sub_ttype: "" }
      }));
      fetchSubTypes(value, () => {});
    }
  };

  // Přidání nové fáze (slotu) – najde první volný slot > 1
  const handleAddPhase = () => {
    for (let slot = 2; slot <= SLOT_COUNT; slot++) {
      if (!editVals[slot]) {
        setEditVals(prev => ({
          ...prev,
          [slot]: emptyPhase()
        }));
        setEditTab(slot);
        return;
      }
    }
  };

  // Smazání fáze (slotu) – pokud má id, smaže i v DB, jinak jen z popupu
  const handleDeletePhase = (slot) => {
    const phase = editVals[slot];
    if (phase && phase.id) {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      fetch(`${API_BASE}/api/training/${phase.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setEditVals(prev => {
          const newVals = { ...prev };
          delete newVals[slot];
          if (editTab === slot) setEditTab(1);
          return newVals;
        });
        // Po smazání z DB načti znovu tréninky
        fetch(`${API_BASE}/api/training?year=${season}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(setTrainings);
      });
    } else {
      setEditVals(prev => {
        const newVals = { ...prev };
        delete newVals[slot];
        if (editTab === slot) setEditTab(1);
        return newVals;
      });
    }
  };

  // Uložení/aktualizace všech fází (odeslání na backend)
  const handleSave = () => {
    const dayId = editDayId;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const promises = [];
    Object.entries(editVals).forEach(([slotStr, data]) => {
      const slot = Number(slotStr);
      // Pokud není fáze vyplněná, neukládej ji
      if (!data.name && !data.main_ttype && !data.sub_ttype && !data.detail && !data.distance && !data.duration) return;
      const payload = {
        training_day_id: dayId,
        slot,
        name: data.name,
        main_ttype: data.main_ttype,
        sub_ttype: data.sub_ttype,
        detail: data.detail,
        distance: data.distance ? parseFloat(data.distance) : 0,
        duration: parseDurationToMinutes(data.duration),
        completed: data.completed,
      };
      if (data.id) {
        // update existující fáze
        promises.push(
          fetch(`${API_BASE}/api/training/${data.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          })
        );
      } else {
        // vytvoření nové fáze
        promises.push(
          fetch(`${API_BASE}/api/training`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          })
        );
      }
    });
    // Po uložení zavři popup a načti znovu tréninky
    Promise.all(promises).then(() => {
      setEditDayId(null);
      fetch(`${API_BASE}/api/training?year=${season}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setTrainings);
    });
  };

  // Zahájí editaci buňky
  const startEditCell = (dayId, field, value) => {
    setEditingCell({ dayId, field });
    setCellEditValue(value ?? "");
    // Pro subtyp načti subtypy pokud nejsou
    if (field === "sub_ttype" || field === "main_ttype") {
      const slots = trainingMap[dayId] || {};
      const t = slots[1];
      const mainType = field === "main_ttype" ? value : t?.m;
      if (mainType) fetchSubTypes(mainType, () => {});
    }
  };

  // Uloží změnu buňky
  const saveCellEdit = (dayId, field) => {
    const slots = trainingMap[dayId] || {};
    const t = slots[1];
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // SMAZÁNÍ FÁZE POMOCÍ "-"
    if (field === "name" && cellEditValue.trim() === "-" && t && t.id) {
      fetch(`${API_BASE}/api/training/${t.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setEditingCell(null);
        fetch(`${API_BASE}/api/training?year=${season}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(setTrainings);
      });
      return;
    }

    // Připrav payload pro nový nebo existující záznam
    let payload = {
      training_day_id: dayId,
      slot: 1,
      name: t?.name || "",
      main_ttype: t?.m || "",
      sub_ttype: t?.s || "",
      detail: t?.detail || "",
      distance: t?.distance || 0,
      duration: t?.duration || 0,
      completed: t?.completed || false,
    };

    // Nastav změněnou hodnotu
    if (field === "duration") {
      payload.duration = parseDurationToMinutes(cellEditValue);
    } else if (field === "distance") {
      payload.distance = parseFloat(cellEditValue) || 0;
    } else if (field === "main_ttype") {
      payload.main_ttype = cellEditValue;
      payload.sub_ttype = ""; // při změně hlavního typu vynuluj subtyp
    } else {
      payload[field] = cellEditValue;
    }

    // Pokud záznam existuje, UPDATE, jinak CREATE
    const fetchPromise = t
      ? fetch(`${API_BASE}/api/training/${t.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        })
      : fetch(`${API_BASE}/api/training`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

    fetchPromise.then(() => {
      setEditingCell(null);
      fetch(`${API_BASE}/api/training?year=${season}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setTrainings);
    });
  };

  // Řazení podle sloupce
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  // Funkce pro získání relevance hledání
  function getRelevance(str, query) {
    if (!str) return -1;
    const lowerStr = str.toLowerCase();
    const lowerQuery = query.toLowerCase();
    if (lowerStr === lowerQuery) return 2; // přesná shoda
    if (lowerStr.includes(lowerQuery)) return 1; // částečná shoda
    return -1; // žádná shoda
  }

  const firstMondayIndex = React.useMemo(() => {
    const idx = days.findIndex(day => new Date(day.date).getDay() === 1);
    return idx === -1 ? 0 : idx;
  }, [days]);

  // Filtrování dnů podle hledaného sloupce a hodnoty
  const filteredDays = React.useMemo(() => {
    let filtered = days;
    // Pokud je stránkování po cyklech, ignoruj všechny filtry
    if (pageSize === 28 || pageSize === 56) {
      return firstMondayIndex > 0 ? days.slice(0) : days;
    }
    // Jinak aplikuj filtry
    // Pokud je vybrán filtr na cykly (selectedCycles není prázdné)
    if (selectedCycles.length > 0) {
      filtered = firstMondayIndex > 0 ? days.slice(firstMondayIndex) : days;
      filtered = filtered.filter(day => selectedCycles.includes(day.cycle));
    }
    if (searchColumn && searchValue) {
      filtered = filtered.filter(day => {
        const slots = trainingMap[day.id] || {};
        const tr = slots[1];
        if (!tr) return false;
        const val = tr[searchColumn] || "";
        return val.toLowerCase().includes(searchValue.toLowerCase());
      });
    }
    return filtered;
  }, [days, selectedCycles, searchColumn, searchValue, trainingMap, firstMondayIndex]);

  useEffect(() => {
    // Nastav pageSize pouze při změně sezóny, ne při každé změně days
    // Tedy: pokud se mění season, nastav pageSize, jinak ne
    // Pokud je aktivní goToTodayAfterSeasonChange, NENASTAVUJ pageSize!
    if (!goToTodayAfterSeasonChange) {
      const saved = Number(localStorage.getItem("dashboardPageSize"));
      setPageSize(saved > 0 ? saved : days.length);
      setSelectedCycles([]);
    }
    // eslint-disable-next-line
  }, [season]);

  useEffect(() => {
    localStorage.setItem("dashboardLastPage", JSON.stringify({ page, pageSize, season }));
  }, [page, pageSize, season]);

  useEffect(() => {
    localStorage.setItem("dashboardSeason", season);
  }, [season]);

  // Výpočet počtu stránek
  const pageCount = React.useMemo(() => {
    if (pageSize === 28 || pageSize === 56) {
      // První stránka je nultý cyklus, další stránky jsou po cyklech
      const rest = days.length - firstMondayIndex;
      const extraPages = Math.ceil(rest / pageSize);
      // +1 pro nultý cyklus, pokud existuje alespoň jeden den před pondělím
      return (firstMondayIndex > 0 ? 1 : 0) + extraPages;
    }
    return Math.ceil(filteredDays.length / pageSize);
  }, [days.length, firstMondayIndex, pageSize, filteredDays.length]);

  // Seřazení dnů podle zvoleného sloupce a relevance hledání
  const sortedDays = React.useMemo(() => {
    if (pageSize === 28 || pageSize === 56) {
      return [...filteredDays].sort((a, b) => a.date.localeCompare(b.date));
    }
    // Jinak původní řazení
    return [...filteredDays].sort((a, b) => {
      if (searchColumn && searchValue) {
        const slotsA = trainingMap[a.id] || {};
        const slotsB = trainingMap[b.id] || {};
        const trA = slotsA[1];
        const trB = slotsB[1];
        const relA = getRelevance(trA?.[searchColumn], searchValue);
        const relB = getRelevance(trB?.[searchColumn], searchValue);
        return relB - relA;
      }
      const slotsA = trainingMap[a.id] || {};
      const slotsB = trainingMap[b.id] || {};
      const trA = slotsA[1];
      const trB = slotsB[1];

      let valA, valB;
      switch (sortBy) {
        case "date":
          valA = a.date;
          valB = b.date;
          break;
        case "phase":
          valA = Object.keys(slotsA).length;
          valB = Object.keys(slotsB).length;
          break;
        case "distance":
          valA = trA && trA.distance ? Number(trA.distance) : 0;
          valB = trB && trB.distance ? Number(trB.distance) : 0;
          break;
        case "type":
          valA = trA && trA.m ? trA.m : "";
          valB = trB && trB.m ? trB.m : "";
          break;
        case "duration":
          valA = trA && trA.duration ? Number(trA.duration) : 0;
          valB = trB && trB.duration ? Number(trB.duration) : 0;
          break;
        default:
          valA = a.date;
          valB = b.date;
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredDays, sortBy, sortDir, searchColumn, searchValue, trainingMap, pageSize]);

  // Při stránkování po cyklech (28 nebo 56) vracím dny podle cyklů
  const pagedDays = React.useMemo(() => {
    if (pageSize === 28 || pageSize === 56) {
      if (page === 1) {
        return sortedDays.slice(0, firstMondayIndex);
      } else {
        const start = firstMondayIndex + (pageSize * (page - 2));
        return sortedDays.slice(start, start + pageSize);
      }
    } else {
      const start = (page - 1) * pageSize;
      return sortedDays.slice(start, start + pageSize);
    }
  }, [sortedDays, page, pageSize, firstMondayIndex]);

  const todayIndex = days.findIndex(day => day.date === todayStr);
  let newPage = 1;
  if (pageSize === 28 || pageSize === 56) {
    if (todayIndex >= firstMondayIndex) {
      newPage = 1 + Math.floor((todayIndex - firstMondayIndex) / pageSize);
    } else {
      newPage = 1; // pokud je dnes před prvním pondělím, je to vždy první stránka (nultý cyklus)
    }
  } else {
    newPage = 1 + Math.floor(todayIndex / pageSize);
  }

  return (
    <div className="dashboard-box">
      {/* Hlavička s výběrem sezóny a trenérem */}
      <TrainingsHeader
        seasons={seasons}
        loadingSeasons={loadingSeasons}
        season={season}
        setSeason={setSeason}
        days={days}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setSelectedCycles={setSelectedCycles}
        setSearchColumn={setSearchColumn}
        setSearchValue={setSearchValue}
        setSortBy={setSortBy}
        setSortDir={setSortDir}
        goToTodayAfterSeasonChange={goToTodayAfterSeasonChange}
        setGoToTodayAfterSeasonChange={setGoToTodayAfterSeasonChange}
        setPage={setPage}
        todayStr={todayStr}
        getCurrentSeason={getCurrentSeason}
        firstMondayIndex={firstMondayIndex}
        t={t}
        user={user}
        page={page}
        pageCount={pageCount}
        currentSeason={getCurrentSeason()}
      />
      {/* Tabulka tréninků */}
      <div className="dashboard-content">
        <TrainingTable
          days={pagedDays}
          todayStr={todayStr}
          trainingMap={trainingMap}
          mainTypes={mainTypes}
          subTypesMap={subTypesMap}
          fetchSubTypes={fetchSubTypes}
          editingCell={editingCell}
          cellEditValue={cellEditValue}
          startEditCell={startEditCell}
          saveCellEdit={saveCellEdit}
          sortBy={sortBy}
          sortDir={sortDir}
          handleSort={handleSort}
          searchColumn={searchColumn}
          setSearchColumn={setSearchColumn}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setCellEditValue={setCellEditValue}
          setEditingCell={setEditingCell}
          t={t}
          daysShort={daysShort}
          formatDateWithDay={formatDateWithDay}
          formatDuration={formatDuration}
          formatDurationFull={formatDurationFull}
          sortedDays={sortedDays}
          openEditPopup={openEditPopup}
          page={page}
          pageCount={pageCount}
          pagedDays={pagedDays}
          trainings={trainings}
          pageSize={pageSize}
        />
      </div>

      {/* Popup okno pro editaci všech fází */}
      <EditTrainingPopup
        editDayId={editDayId}
        editTab={editTab}
        setEditTab={setEditTab}
        editVals={editVals}
        handleEditChange={handleEditChange}
        handleAddPhase={handleAddPhase}
        handleDeletePhase={handleDeletePhase}
        setEditDayId={setEditDayId}
        handleSave={handleSave}
        mainTypes={mainTypes}
        subTypesMap={subTypesMap}
        fetchSubTypes={fetchSubTypes}
        t={t}
        SLOT_COUNT={SLOT_COUNT}
      />
    </div>
  );
}

export default Home;