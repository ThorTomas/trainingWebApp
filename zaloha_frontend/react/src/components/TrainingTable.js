import React, { useEffect, useState } from 'react';

function getCurrentSeasonYear() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return (month >= 10) ? year + 1 : year;
}

function TrainingTable({ token }) {
  const [seasons, setSeasons] = useState([]);
  const [year, setYear] = useState(getCurrentSeasonYear());
  const [days, setDays] = useState([]);
  const [records, setRecords] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch(`http://127.0.0.1:5000/api/seasons`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSeasons(data);
        if (!data.includes(year)) setYear(data[0]);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !year) return;
    Promise.all([
      fetch(`http://127.0.0.1:5000/api/training/days?year=${year}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch(`http://127.0.0.1:5000/api/training?year=${year}`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch(`http://127.0.0.1:5000/api/training/types`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([days, records, types]) => {
      setDays(days);
      setRecords(records);
      setTypes(types);
    });
  }, [token, year]);

  return (
    <>
      <section className="controls">
        <label htmlFor="yearSelect">Year:</label>
        <select id="yearSelect" value={year} onChange={e => setYear(Number(e.target.value))}>
          {seasons.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </section>
      <main>
        <table id="trainingTable">
          <thead>
            <tr>
              <th>Date<br /><span style={{ fontSize: '0.7em', color: '#888' }}>(Day)</span></th>
              <th></th>
              <th>Training Name</th>
              <th>Type</th>
              <th>Distance (km)</th>
              <th>Duration (min)</th>
              <th>Parameters</th>
              <th>✓</th>
            </tr>
          </thead>
          <tbody>
            {days.map(day => {
              const slot = 1;
              const key = `${day.id}_${slot}`;
              const record = records.find(r => r.training_day_id === day.id && r.slot === slot) || {};
              const dateObj = new Date(day.date);
              const dateStr = `${dateObj.getDate()}. ${dateObj.getMonth() + 1}. ${dateObj.getFullYear()}`;
              const dayName = dateObj.toLocaleDateString("cs-CZ", { weekday: "long" });
              return (
                <tr key={day.id}>
                  <td>
                    <div>{dateStr}</div>
                    <div className='dayname'>{dayName}</div>
                  </td>
                  <td>
                    <button
                      className="expand-btn"
                      style={{ fontSize: '1.2em', cursor: 'pointer' }}
                      onClick={() => setSlotPopup({ open: true, day })}
                    >˅</button>
                  </td>
                  <td><input value={record.name || ''} onChange={e => handleChange(day, slot, 'name', e.target.value)} /></td>
                  <td>
                    <select
                      value={record.training_type || ''}
                      onChange={e => handleChange(day, slot, 'training_type', e.target.value)}
                      title={types.find(t => t.code === record.training_type)?.label || ''}
                    >
                      <option value="">--</option>
                      {types.map(t => (
                        <option key={t.code} value={t.code} title={t.label}>{t.code}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="number" min="0" step="0.01" style={{ width: '5em' }} value={record.distance || ''} onChange={e => handleChange(day, slot, 'distance', e.target.value)} /></td>
                  <td><input type="number" min="0" step="1" style={{ width: '4em' }} value={record.duration || ''} onChange={e => handleChange(day, slot, 'duration', e.target.value)} /></td>
                  <td><input value={record.detail || ''} onChange={e => handleChange(day, slot, 'detail', e.target.value)} /></td>
                  <td><input type="checkbox" checked={record.completed || false} onChange={e => handleChange(day, slot, 'completed', e.target.checked)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <SlotPopup
          open={!!slotPopup.open}
          onClose={() => setSlotPopup({ open: false, day: null })}
          day={slotPopup.day}
          recordMap={recordMap}
          types={types}
          token={token}
          onUpdate={refreshData}
        />
      </main>
    </>
  );
}

export default TrainingTable;
