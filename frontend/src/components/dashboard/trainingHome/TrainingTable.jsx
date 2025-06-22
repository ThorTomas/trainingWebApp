import React from "react";
import { Pencil } from "lucide-react";
import { isPhaseEmpty } from "./utilsTrainingHome";

export function TrainingTable({
  days,
  todayStr,
  trainingMap,
  mainTypes,
  subTypesMap,
  fetchSubTypes,
  editingCell,
  cellEditValue,
  startEditCell,
  saveCellEdit,
  sortBy,
  sortDir,
  handleSort,
  searchColumn,
  setSearchColumn,
  searchValue,
  setSearchValue,
  setCellEditValue,
  t,
  daysShort,
  formatDateWithDay,
  formatDuration,
  formatDurationFull,
  sortedDays,
  openEditPopup,
  page,
  pageCount,
  pageDays,
  trainings,
  pageSize,
}) {
  // Získání všech tréninků pro zobrazené dny
  const visibleDayIds = days.map(day => day.id);
  const visibleTrainings = trainings.filter(t => visibleDayIds.includes(t.training_day_id));

  // Součty jen pro zobrazené dny
  const sumActivities = visibleTrainings.filter(t => !isPhaseEmpty(t)).length;
  const sumRunActivities = visibleTrainings.filter(t => t.m === "Run" && !isPhaseEmpty(t)).length;
  const sumKm = visibleTrainings.filter(t => t.distance).reduce((acc, t) => acc + Number(t.distance), 0);
  const sumRunKm = visibleTrainings.filter(t => t.m === "Run" && t.distance).reduce((acc, t) => acc + Number(t.distance), 0);
  const sumRunMinutes = visibleTrainings.filter(t => t.m === "Run" && t.duration).reduce((acc, t) => acc + Number(t.duration), 0);
  const sumMinutes = visibleTrainings.filter(t => t.duration).reduce((acc, t) => acc + Number(t.duration), 0);

  return (
    <table className="season-table">
      <thead>
        <tr className="summary-row">
          <th colSpan={5} style={{ textAlign: "left" }}>
            <span style={{ fontWeight: "bold" }}>{t("totals_activities")}:</span> {sumActivities} {t("activities")} | {formatDurationFull(sumMinutes)}
          </th>
          <th colSpan={4} style={{ textAlign: "right" }}>
            <span style={{ fontWeight: "bold" }}>{t("runs")}:</span> {sumRunActivities} – {sumRunKm.toFixed(0)} km – {formatDurationFull(sumRunMinutes)}
          </th>
        </tr>
        <tr>
          <th 
            className="phase-count-col" 
            onClick={() => handleSort("phase")} 
            style={ (pageSize === 28 || pageSize === 56) 
              ? { cursor: "default", pointerEvents: "none" }
              : { cursor: "pointer" }
            }
          >
            {t("phase_count")}{sortBy === "phase" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
          </th>
          <th 
            className="date-cell" 
            onClick={() => handleSort("date")} 
            style={ (pageSize === 28 || pageSize === 56) 
              ? { cursor: "default", pointerEvents: "none" }
              : { cursor: "pointer" }
            }
          >
            {t("date")}{sortBy === "date" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
          </th>
          <th
            onClick={() => setSearchColumn("name")}
            style={
              (pageSize === 28 || pageSize === 56) 
                ? { cursor: "default", pointerEvents: "none" } 
                : { cursor: "pointer" }
            }
          >
            {searchColumn === "name" ? (
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onBlur={() => setSearchColumn(null)}
                autoFocus
                placeholder={t("search_name")}
                style={{ width: "80%" }}
                disabled={pageSize === 28 || pageSize === 56}
              />
            ) : (
              t("name")
            )}
          </th>
          <th style={{ cursor: "default" }}>{t("type")}</th>
          <th style={{ cursor: "default" }}>{t("subtype")}</th>
          <th
            onClick={() => setSearchColumn("detail")}
            style={
              (pageSize === 28 || pageSize === 56) 
                ? { cursor: "default", pointerEvents: "none" } 
                : { cursor: "pointer" }
            }
          >
            {searchColumn === "detail" ? (
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                onBlur={() => setSearchColumn(null)}
                autoFocus
                placeholder={t("search_name")}
                style={{ width: "80%" }}
                disabled={pageSize === 28 || pageSize === 56}
              />
            ) : (
              t("detail")
            )}
          </th>
          <th 
            onClick={() => handleSort("distance")} 
            style={ (pageSize === 28 || pageSize === 56) 
              ? { cursor: "default", pointerEvents: "none" }
              : { cursor: "pointer" }
            }
          >
            {t("distance")}{sortBy === "distance" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
          </th>
          <th
            onClick={() => handleSort("duration")} 
            style={ (pageSize === 28 || pageSize === 56) 
              ? { cursor: "default", pointerEvents: "none" }
              : { cursor: "pointer" }
            }
          >
            {t("duration")}{sortBy === "duration" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
          </th>
          <th>{t("completed")}</th>
        </tr>
      </thead>
      <tbody>
        {days.map(day => {
          const slots = trainingMap[day.id] || {};
          const tr = slots[1]; // pouze slot 1 je viditelný v tabulce
          const phasesCount = Object.keys(slots).length;
          return (
            <tr
              key={day.id}
              className={day.date === todayStr ? "today-row" : ""}
              id={day.date === todayStr ? "today-row" : undefined}
            >
              <td className="phase-count-col">
                {tr && isPhaseEmpty(tr) ? 0 : phasesCount}
              </td>
              <td
                className={`date-cell${day.date === todayStr ? " today-date" : ""}`}
                onClick={() => openEditPopup(day)}
              >
                {formatDateWithDay(day.date, daysShort)}
                <Pencil
                  size={14}
                  className="pencil-icon"
                  aria-label={t("edit_training")}
                />
              </td>
              {tr
                ? isPhaseEmpty(tr)
                  ? (
                    <>
                      <td colSpan={1}>
                        {editingCell?.dayId === day.id && editingCell.field === "name" ? (
                          <input
                            type="text"
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "name")}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="rest-day"
                            onClick={() => startEditCell(day.id, "name", tr?.name)}
                          >
                            {t("rest_day")}
                          </span>
                        )}
                      </td>
                      <td colSpan={6}></td>
                    </>
                  )
                  : (
                    <>
                      {/* Name */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "name" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "name" ? (
                          <input
                            type="text"
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "name")}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "name", tr?.name)}
                          >
                            {tr?.name || <span className="dash">—</span>}
                          </span>
                        )}
                      </td>
                      {/* Typ */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "main_ttype" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "main_ttype" ? (
                          <select
                            value={cellEditValue}
                            onChange={e => {
                              setCellEditValue(e.target.value);
                              fetchSubTypes(e.target.value, () => {});
                            }}
                            onBlur={() => saveCellEdit(day.id, "main_ttype")}
                            autoFocus
                          >
                            <option value="">---</option>
                            {mainTypes.map(mt => (
                              <option key={mt.code} value={mt.code}>{mt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "main_ttype", tr?.m)}
                          >
                            {tr?.m || <span className="dash">—</span>}
                          </span>
                        )}
                      </td>
                      {/* Subtyp */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "sub_ttype" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "sub_ttype" ? (
                          <select
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "sub_ttype")}
                            autoFocus
                          >
                            <option value="">---</option>
                            {(tr?.m ? subTypesMap[tr.m] || [] : []).map(st => (
                              <option key={st.code} value={st.code}>{st.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "sub_ttype", tr?.s)}
                          >
                            {tr?.s || <span className="dash">—</span>}
                          </span>
                        )}
                      </td>
                      {/* Detail */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "detail" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "detail" ? (
                          <input
                            type="text"
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "detail")}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "detail", tr?.detail)}
                          >
                            {tr?.detail || <span className="dash">—</span>}
                          </span>
                        )}
                      </td>
                      {/* Distance */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "distance" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "distance" ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "distance")}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "distance", tr?.distance)}
                          >
                            {tr && tr.distance != null
                              ? Number(tr.distance).toFixed(2) + " km"
                              : <span className="dash">—</span>
                            }
                          </span>
                        )}
                      </td>
                      {/* Duration */}
                      <td className={editingCell?.dayId === day.id && editingCell.field === "duration" ? "editing" : ""}>
                        {editingCell?.dayId === day.id && editingCell.field === "duration" ? (
                          <input
                            type="text"
                            pattern="\d{2}:\d{2}:\d{2}"
                            placeholder="hh:mm:ss"
                            value={cellEditValue}
                            onChange={e => setCellEditValue(e.target.value)}
                            onBlur={() => saveCellEdit(day.id, "duration")}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="editable"
                            onClick={() => startEditCell(day.id, "duration", tr?.duration ? formatDuration(tr.duration) : "")}
                          >
                            {tr && tr.duration
                              ? formatDuration(tr.duration)
                              : "00:00:00"
                            }
                          </span>
                        )}
                      </td>
                      {/* Completed */}
                      <td>
                        {tr
                          ? tr.completed
                            ? <span className="completed-yes">✓</span>
                            : <span className="completed-no">✗</span>
                          : <span className="dash">—</span>
                        }
                      </td>
                    </>
                  )
                // Prázdný záznam (žádné fáze)
                : (
                  <>
                    {/* Name */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "name" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "name" ? (
                        <input
                          type="text"
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "name")}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "name", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Typ */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "main_ttype" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "main_ttype" ? (
                        <select
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "main_ttype")}
                          autoFocus
                        >
                          <option value="">---</option>
                          {mainTypes.map(mt => (
                            <option key={mt.code} value={mt.code}>{mt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "main_ttype", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Subtyp */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "sub_ttype" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "sub_ttype" ? (
                        <select
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "sub_ttype")}
                          autoFocus
                        >
                          <option value="">---</option>
                        </select>
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "sub_ttype", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Detail */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "detail" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "detail" ? (
                        <input
                          type="text"
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "detail")}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "detail", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Distance */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "distance" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "distance" ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "distance")}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "distance", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Duration */}
                    <td className={editingCell?.dayId === day.id && editingCell.field === "duration" ? "editing" : ""}>
                      {editingCell?.dayId === day.id && editingCell.field === "duration" ? (
                        <input
                          type="text"
                          pattern="\d{2}:\d{2}:\d{2}"
                          placeholder="hh:mm:ss"
                          value={cellEditValue}
                          onChange={e => setCellEditValue(e.target.value)}
                          onBlur={() => saveCellEdit(day.id, "duration")}
                          autoFocus
                        />
                      ) : (
                        <span
                          className="editable"
                          onClick={() => startEditCell(day.id, "duration", "")}
                        >
                          <span className="dash">—</span>
                        </span>
                      )}
                    </td>
                    {/* Completed */}
                    <td>
                      <span className="dash">—</span>
                    </td>
                  </>
                )
              }
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}