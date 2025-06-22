

// ---- Utility funkce pro převod času a data ----

// Převod minut na hh:mm:ss pro zobrazení
export function formatDuration(minutes) {
  if (!minutes) return "";
  const totalSeconds = Math.round(minutes * 60);
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return [hh, mm, ss].map(n => String(n).padStart(2, "0")).join(":");
}

// Převod z hh:mm:ss na minuty pro uložení
export function parseDurationToMinutes(durationStr) {
  if (!durationStr) return 0;
  const [hh = "0", mm = "0", ss = "0"] = durationStr.split(":");
  return parseInt(hh) * 60 + parseInt(mm) + parseInt(ss) / 60;
}

export function formatDurationFull(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}min ${s}s`;
}

// Vrátí zkratku dne v týdnu podle data
export function getDayName(dateStr, daysShort) {
  const d = new Date(dateStr);
  return daysShort[d.getDay()];
}

// Vrátí datum ve formátu "Po 19 06 2025"
export function formatDateWithDay(dateStr, daysShort) {
  const d = new Date(dateStr);
  const dayName = getDayName(dateStr, daysShort);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dayName} ${dd} ${mm} ${yyyy}`;
}


// ---- Utility funkce pro fáze tréninků ----

export function isPhaseEmpty(t) {
  // Zkontroluje, jestli jsou všechna pole prázdná (kromě id, training_day_id, slot)
  return (
    (!t.name || t.name === "") &&
    (!t.m || t.m === "") &&
    (!t.s || t.s === "") &&
    (!t.detail || t.detail === "") &&
    (!t.distance || Number(t.distance) === 0) &&
    (!t.duration || Number(t.duration) === 0)
  );
}

// Vytvoření prázdné fáze (výchozí hodnoty)
export function emptyPhase() {
  return {
    name: "",
    main_ttype: "",
    sub_ttype: "",
    detail: "",
    distance: "",
    duration: "",
    completed: false,
    id: null,
  };
}