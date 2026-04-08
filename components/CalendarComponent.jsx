// CalendarComponent.jsx
// Fully functional calendar with colour-coded cycle phases.
// Expects React & ReactDOM to be available globally (loaded via CDN).
// Self-mounts into #calendar-root.

function CalendarComponent() {
  const { useState } = React;

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [phaseInfo, setPhaseInfo] = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  function getCycleData() {
    try {
      const d = JSON.parse(localStorage.getItem('userData') || '{}');
      return {
        lastPeriod:   d.lastPeriod   ? new Date(d.lastPeriod) : new Date(2026, 0, 1),
        cycleLength:  parseInt(d.cycleLength)  || 28,
        periodLength: parseInt(d.periodLength) || 5,
      };
    } catch (_) {
      return { lastPeriod: new Date(2026, 0, 1), cycleLength: 28, periodLength: 5 };
    }
  }

  // Returns 'period' | 'ovulation' | 'fertile' | null for a given calendar date
  function getDayType(year, month, day) {
    const { lastPeriod, cycleLength, periodLength } = getCycleData();
    const date = new Date(year, month, day);
    const msDiff = date - lastPeriod;
    const daysDiff = Math.floor(msDiff / 86400000);
    // Handle days before last period by projecting backwards
    const dayInCycle = ((daysDiff % cycleLength) + cycleLength) % cycleLength;
    const ovDay = Math.max(cycleLength - 14, periodLength + 1);

    if (dayInCycle < periodLength) return 'period';
    if (dayInCycle === ovDay) return 'ovulation';
    if (dayInCycle >= ovDay - 3 && dayInCycle <= ovDay + 1) return 'fertile';
    return null;
  }

  function getPhaseName(dayInCycle, cycleLength, periodLength) {
    const ovDay = Math.max(cycleLength - 14, periodLength + 1);
    if (dayInCycle < periodLength)                         return { name: 'Menstrual',  color: '#FF6B9D' };
    if (dayInCycle < ovDay - 3)                            return { name: 'Follicular', color: '#FFD93D' };
    if (dayInCycle >= ovDay - 3 && dayInCycle <= ovDay + 1) return { name: 'Fertile / Ovulation', color: '#4ECDC4' };
    return { name: 'Luteal', color: '#B19CD9' };
  }

  // ── derived values ────────────────────────────────────────────────────────
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDow      = new Date(year, month, 1).getDay();          // 0=Sun
  const adjustedStart = firstDow === 0 ? 6 : firstDow - 1;         // Mon-based
  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const daysInPrev    = new Date(year, month, 0).getDate();

  // Build flat cell array
  const cells = [];
  for (let i = adjustedStart - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, kind: 'other' });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, kind: getDayType(year, month, d) || 'current' });
  const need = cells.length <= 35 ? 35 - cells.length : 42 - cells.length;
  for (let d = 1; d <= need; d++)
    cells.push({ day: d, kind: 'other' });

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleDayClick(day) {
    setSelectedDay(day);
    const { lastPeriod, cycleLength, periodLength } = getCycleData();
    const clicked   = new Date(year, month, day);
    const msDiff    = clicked - lastPeriod;
    const daysDiff  = Math.floor(msDiff / 86400000);
    const dayInCycle = ((daysDiff % cycleLength) + cycleLength) % cycleLength;
    const phase = getPhaseName(dayInCycle, cycleLength, periodLength);
    setPhaseInfo({ cycleDay: dayInCycle + 1, ...phase });
  }

  function isToday(d) {
    return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  }

  // ── style helpers ─────────────────────────────────────────────────────────
  const TYPE_COLORS = {
    period:    { bg: '#FF6B9D', fg: '#fff' },
    ovulation: { bg: '#4ECDC4', fg: '#fff' },
    fertile:   { bg: '#FFD93D', fg: '#2D2D2D' },
  };

  function cellStyle(cell, isSelected) {
    const base = {
      aspectRatio: '1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '8px', fontSize: '13px',
      cursor: cell.kind !== 'other' ? 'pointer' : 'default',
      transition: 'all 0.15s ease',
      fontWeight: isSelected ? '700' : '400',
      color: cell.kind === 'other' ? '#ccc' : '#2D2D2D',
    };
    if (cell.kind === 'other') return base;
    if (isSelected) return { ...base, backgroundColor: '#CF7486', color: '#fff', fontWeight: '700' };
    if (TYPE_COLORS[cell.kind]) {
      return { ...base, backgroundColor: TYPE_COLORS[cell.kind].bg, color: TYPE_COLORS[cell.kind].fg };
    }
    if (isToday(cell.day)) return { ...base, outline: '2px solid #CF7486', outlineOffset: '1px', fontWeight: '600' };
    return base;
  }

  const todayOutline = (cell, isSelected) =>
    !isSelected && isToday(cell.day) && cell.kind !== 'other'
      ? { outline: '2px solid #CF7486', outlineOffset: '1px' }
      : {};

  // ── render ────────────────────────────────────────────────────────────────
  const navBtn = (label, onClick) => (
    <button onClick={onClick} style={{
      background: 'none', border: '1px solid #F8BBD0',
      borderRadius: '8px', padding: '3px 10px',
      cursor: 'pointer', fontSize: '18px', lineHeight: '1',
      color: '#CF7486', fontWeight: '600',
    }}>{label}</button>
  );

  return (
    <div>
      {/* Header with navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#2D2D2D', margin: 0 }}>
          {monthName} {year}
        </h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          {navBtn('‹', () => setCurrentDate(new Date(year, month - 1, 1)))}
          {navBtn('›', () => setCurrentDate(new Date(year, month + 1, 1)))}
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '8px' }}>
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '12px', color: '#999', fontWeight: '600' }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {cells.map((cell, i) => {
          const isSelected = cell.kind !== 'other' && cell.day === selectedDay
            && month === today.getMonth() && year === today.getFullYear()
            || (cell.kind !== 'other' && cell.day === selectedDay && phaseInfo);
          const style = {
            ...cellStyle(cell, isSelected),
            ...todayOutline(cell, isSelected),
          };
          return (
            <div key={i} style={style}
              onClick={() => cell.kind !== 'other' && handleDayClick(cell.day)}>
              {cell.day}
            </div>
          );
        })}
      </div>

      {/* Selected day info */}
      {phaseInfo && (
        <div style={{
          marginTop: '12px', padding: '10px 14px',
          background: '#FFF8F0', borderRadius: '10px', fontSize: '13px',
        }}>
          <strong>Cycle Day {phaseInfo.cycleDay}</strong>
          {' — '}
          <span style={{ color: phaseInfo.color, fontWeight: '600' }}>{phaseInfo.name}</span>
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '12px', color: '#555' }}>
        {[
          { color: '#FF6B9D', label: '🩸 Period' },
          { color: '#FFD93D', label: '💛 Fertile' },
          { color: '#4ECDC4', label: '🩵 Ovulation' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: color, display: 'inline-block', flexShrink: 0 }}></span>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Self-mount: Babel Standalone executes this after async XHR fetch + transpile,
// so the DOM is always ready. data-rm flag prevents double-mounting by the fallback.
(function() {
  const el = document.getElementById('calendar-root');
  if (el && window.ReactDOM && !el.dataset.rm) {
    el.dataset.rm = '1';
    ReactDOM.createRoot(el).render(React.createElement(CalendarComponent));
  }
})();
