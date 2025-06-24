import React from "react";
import "../../../styles/Home.css";

export function EditTrainingPopup({
  editDayId,
  editTab,
  setEditTab,
  editVals,
  handleEditChange,
  handleAddPhase,
  handleDeletePhase,
  setEditDayId,
  handleSave,
  mainTypes,
  subTypesMap,
  fetchSubTypes,
  t,
  SLOT_COUNT,
}) {
  if (!editDayId) return null;

  return (
    <div className="popup-overlay" onClick={() => setEditDayId(null)}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <h3>{t("edit_training") || "Upravit trénink"}</h3>
            {/* Záložky pro fáze */}
            <div className="phase-tabs">
              {Object.keys(editVals)
                .sort((a, b) => Number(a) - Number(b))
                .map(slot => (
                  <button
                    key={slot}
                    className={`phase-tab${editTab === Number(slot) ? " tab-active" : ""}`}
                    onClick={() => setEditTab(Number(slot))}
                  >
                    {t("phase")} {slot}
                  </button>
                ))}
              {Object.keys(editVals).length < SLOT_COUNT && (
                <button
                  className="phase-tab add-phase"
                  onClick={handleAddPhase}
                  title={t("add_phase")}
                >
                  +
                </button>
              )}
            </div>
            {/* Formulář pro aktivní fázi */}
            {editVals[editTab] && (
              <>
                <div className="form-row">
                  <label>{t("name")}:<br />
                    <input
                      type="text"
                      value={editVals[editTab].name}
                      onChange={e => handleEditChange(editTab, "name", e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>{t("type")}:<br />
                    <select
                      value={editVals[editTab].main_ttype}
                      onChange={e => handleEditChange(editTab, "main_ttype", e.target.value)}
                    >
                      <option value="">---</option>
                      {mainTypes.map(mt => (
                        <option key={mt.code} value={mt.code}>
                          {mt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label>{t("subtype")}:<br />
                    <select
                      value={editVals[editTab].sub_ttype}
                      onChange={e => handleEditChange(editTab, "sub_ttype", e.target.value)}
                      disabled={!editVals[editTab].main_ttype}
                      onFocus={() =>
                        editVals[editTab].main_ttype &&
                        fetchSubTypes(editVals[editTab].main_ttype, () => {})
                      }
                    >
                      <option value="">---</option>
                      {(editVals[editTab].main_ttype ? subTypesMap[editVals[editTab].main_ttype] || [] : []).map(st => (
                        <option key={st.code} value={st.code}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="form-row">
                  <label>{t("detail")}:<br />
                    <input
                      type="text"
                      value={editVals[editTab].detail}
                      onChange={e => handleEditChange(editTab, "detail", e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>{t("distance")}:<br />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editVals[editTab].distance}
                      onChange={e => handleEditChange(editTab, "distance", e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>{t("duration")}:<br />
                    <input
                      type="text"
                      pattern="\d{2}:\d{2}:\d{2}"
                      placeholder="hh:mm:ss"
                      value={editVals[editTab].duration}
                      onChange={e => handleEditChange(editTab, "duration", e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!editVals[editTab].completed}
                      onChange={e => handleEditChange(editTab, "completed", e.target.checked)}
                    />
                    {t("completed")}
                  </label>
                </div>
                <div className="popup-actions">
                  {/* Tlačítko pro smazání fáze (pouze pro slot > 1) */}
                  {editTab > 1 && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeletePhase(editTab)}
                    >
                      {t("delete_phase")}
                    </button>
                  )}
                  <button className="btn" onClick={() => setEditDayId(null)}>
                    {t("cancel")}
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    {t("save")}
                  </button>
                </div>
              </>
            )}
      </div>
    </div>
  );
}