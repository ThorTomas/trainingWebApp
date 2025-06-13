import React from 'react';

function SlotPopup({ open, onClose, day, recordMap, types, token, onUpdate }) {
  if (!open || !day) return null;

  const handleChange = async (slot, field, value) => {
    const key = `${day.id}_${slot}`;
    const rec = recordMap[key] || {};
    const payload = {
      training_day_id: day.id,
      slot,
      name: field === 'name' ? value : rec.name || '',
      training_type: field === 'training_type' ? value : rec.training_type || '',
      distance: field === 'distance' ? parseFloat(value) || 0 : rec.distance || 0,
      duration: field === 'duration' ? parseInt(value) || 0 : rec.duration || 0,
      detail: field === 'detail' ? value : rec.detail || '',
      completed: field === 'completed' ? value : rec.completed || false,
    };
    const method = rec.id ? 'PUT' : 'POST';
    const url = rec.id ? `http://127.0.0.1:5000/api/training/${rec.id}` : `http://127.0.0.1:5000/api/training`;
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const updated = await res.json();
    if (updated.training?.id) rec.id = updated.training.id;
    onUpdate();
  };

  return (
    <div className="slot-popup" style={{ display: 'flex' }} onClick={e => { if (e.target.className === 'slot-popup') onClose(); }}>
      <div className="slot-popup-content">
        <span className="slot-popup-close" onClick={onClose}>&times;</span>
        <h3>Edit slots 2 & 3</h3>
        <div>
          {[2, 3].map(s => {
            const key = `${day.id}_${s}`;
            const rec = recordMap[key] || {};
            return (
              <div key={s} style={{ display: 'flex', gap: '0.5em', marginBottom: '0.5em' }}>
                <b>Slot {s}:</b>
                <input
                  value={rec.name || ''}
                  placeholder="Name"
                  onChange={e => handleChange(s, 'name', e.target.value)}
                />
                <select
                  value={rec.training_type || ''}
                  onChange={e => handleChange(s, 'training_type', e.target.value)}
                  title={types.find(t => t.code === rec.training_type)?.label || ''}
                >
                  <option value="">--</option>
                  {types.map(t => (
                    <option key={t.code} value={t.code} title={t.label}>{t.code}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  style={{ width: '5em' }}
                  value={rec.distance || ''}
                  placeholder="Distance"
                  onChange={e => handleChange(s, 'distance', e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  style={{ width: '4em' }}
                  value={rec.duration || ''}
                  placeholder="Duration"
                  onChange={e => handleChange(s, 'duration', e.target.value)}
                />
                <input
                  value={rec.detail || ''}
                  placeholder="Detail"
                  onChange={e => handleChange(s, 'detail', e.target.value)}
                />
                <input
                  type="checkbox"
                  checked={rec.completed || false}
                  onChange={e => handleChange(s, 'completed', e.target.checked)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SlotPopup;
