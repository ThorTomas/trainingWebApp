import React from "react";
import { Pagination } from "./Pagination";

export function TrainingsHeader({
  seasons,
  loadingSeasons,
  season,
  setSeason,
  days,
  pageSize,
  setPageSize,
  setSelectedCycles,
  setSearchColumn,
  setSearchValue,
  setSortBy,
  setSortDir,
  goToTodayAfterSeasonChange,
  setPage,
  todayStr,
  getCurrentSeason,
  firstMondayIndex,
  t,
  user,
  page,
  pageCount,
  currentSeason,
  setGoToTodayAfterSeasonChange,
}) {
  return (
    <div className="header">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          className="header-select"
          value={season}
          onChange={e => setSeason(Number(e.target.value))}
          disabled={loadingSeasons}
        >
          {seasons.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {/* Výběr počtu cyklů (řádků na stránku) */}
        <select
          className="header-select"
          value={pageSize}
          onChange={e => {
            const val = Number(e.target.value);
            setPageSize(val > 0 ? val : 1);
            localStorage.setItem("dashboardPageSize", val);

            // Pokud přepínáš na "all cycles", zruš filtr cyklů
            if (val === days.length) {
              setSelectedCycles([]);
            }

            if (val === 28 || val === 56) {
              setSelectedCycles([]);
              setSearchColumn(null);
              setSearchValue("");
              setSortBy("date");
              setSortDir("asc");
            }

            if (!goToTodayAfterSeasonChange) {
              setPage(1);
              // Najdi stránku s dnešním datem
              const todayIndex = days.findIndex(day => day.date === todayStr);
              let newPage = 1;
              if (val === 28 || val === 56) {
                if (todayIndex < firstMondayIndex) {
                  newPage = 1;
                } else {
                  newPage = 2 + Math.floor((todayIndex - firstMondayIndex) / val);
                }
              } else {
                newPage = 1 + Math.floor(todayIndex / val);
              }
              setPage(newPage);
            }
          }}
          style={{ minWidth: 120 }}
        >
          <option value={days.length}>{t("all_cycles")}</option>
          <option value={28}>{t("one_cycle")}</option>
          <option value={56}>{t("two_cycles")}</option>
        </select>
        <Pagination page={page} pageCount={pageCount} setPage={setPage} />
        <button
          type="button"
          className="header-btn"
          onClick={() => {
            if (season !== currentSeason) {
              setGoToTodayAfterSeasonChange(true); // ← přidáno
              setSeason(currentSeason);
              setTimeout(() => {
                // případně další logika
              }, 50);
            } else {
              const todayIndex = days.findIndex(day => day.date === todayStr);
              let newPage = 1;
              if (pageSize === 28 || pageSize === 56) {
                if (todayIndex < firstMondayIndex) {
                  newPage = 1;
                } else {
                  newPage = 2 + Math.floor((todayIndex - firstMondayIndex) / pageSize);
                }
              } else {
                newPage = 1 + Math.floor(todayIndex / pageSize);
              }
              setPage(newPage);
              setTimeout(() => {
                const el = document.getElementById("today-row");
                if (el) {
                  el.scrollIntoView({ block: "center", behavior: "smooth" });
                }
              }, 200);
            }
          }}
          style={{ minWidth: 36, minHeight: 36, borderRadius: 6, cursor: "pointer" }}
          title={t("go_to_today")}
        >
          {t("today")}
        </button>
      </div>
      <div className="header-avatar" title={user?.profile?.coach ? `${user.profile.coach.first_name} ${user.profile.coach.last_name}` : "No Coach Assigned"}>
        {user?.profile?.coach?.profilePhotoUrl ? (
          <img
            src={user.profile.coach.profilePhotoUrl}
            alt="Coach"
            className="header-photo"
          />
        ) : (
          <span className="header-plus">+</span>
        )}
      </div>
    </div>
  );
}