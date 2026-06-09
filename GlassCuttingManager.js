const data = {
  "84x72":  ["69.6x72"],
  "96x72":  ["42.9x72","59.6x72","64.6x72","69.6x72","79.6x72","89.6x72","42.8x87.5","44.6x87.5","47.5x87.5","54.2x87.5","60.9x87.5","72.6x87.5","72.7x87.5","82.7x87.5","92.7x87.5","87.5x52.7","87.5x54.2","87.5x61.0","87.5x67.7","87.5x72.7","87.5x82.7"],
  "96x84":  ["44.6x97.5","44.6x107.5","47.5x97.5","47.5x107.5","52.7x97.5","52.7x107.5","54.2x97.5","54.2x107.5","60.9x97.5","60.9x107.5","72.2x97.5","72.2x107.5","72.6x97.5","72.6x107.5","72.7x97.5","72.7x107.5","82.7x97.5","82.7x107.5","92.7x97.5","92.7x107.5","97.5x42.8","97.5x52.7","97.5x61.0","97.5x67.7","97.5x72.7","97.5x72.6","107.5x42.8","107.5x52.7","107.5x61.0","107.5x67.7","107.5x72.7","107.5x97.5"],
  "120x84": ["87.50x42.70","87.50x44.60","87.50x47.50","87.50x52.70","87.50x52.80","87.50x54.20","87.50x60.90","87.50x67.80","87.50x72.70","87.50x72.80","87.50x82.70","87.50x92.80","97.50x42.60","97.50x42.70","97.50x44.60","97.50x47.50","97.50x52.70","97.50x52.80","97.50x54.20","97.50x60.90","97.50x67.80","97.50x72.70","97.50x72.80","97.50x82.70","97.50x92.80","107.50x42.60","107.50x42.70","107.50x44.60","107.50x47.50","107.50x52.70","107.50x52.80","107.50x54.20","107.50x60.90","107.50x67.80","107.50x72.70","107.50x72.80","107.50x82.70","107.50x92.80"],
  "120x96": ["87.50x42.80","87.50x44.60","87.50x47.50","87.50x52.70","87.50x54.20","87.50x60.90","87.50x61.00","87.50x67.70","87.50x72.60","87.50x72.70","87.50x82.70","87.50x92.70","97.50x42.70","97.50x42.80","97.50x44.60","97.50x47.50","97.50x52.70","97.50x54.20","97.50x60.80","97.50x60.90","97.50x61.00","97.50x67.70","97.50x72.60","97.50x72.70","97.50x82.70","97.50x92.70","107.50x42.70","107.50x42.80","107.50x44.60","107.50x47.50","107.50x52.70","107.50x54.20","107.50x60.80","107.50x60.90","107.50x61.00","107.50x67.70","107.50x72.60","107.50x72.70","107.50x82.70","107.50x92.70"]
};

const INCH_TO_CM = 2.54;

function startThaiClock() {
  const el = document.getElementById('thaiClock');
  if (!el) return;
  const update = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', {
      timeZone: 'Asia/Bangkok',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('th-TH', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    el.innerHTML = `📅 ${dateStr}<br>🕐 ${timeStr} น.`;
  };
  update();
  setInterval(update, 1000);
}

window.onload = () => { startThaiClock(); loadList(); loadSizes(); updateJobUI(); };

// Populate Thai datetime in the print header just before printing
window.onbeforeprint = () => {
  const el = document.getElementById('printDateTime');
  if (!el) return;
  const now = new Date();
  const dateStr = now.toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  el.textContent = `พิมพ์เมื่อ: ${dateStr}  เวลา ${timeStr} น.`;
};

/* ============================
   SIZE DROPDOWN
   ============================ */
function loadSizes() {
  const s = document.getElementById('sheet').value;
  const sel = document.getElementById('size');
  sel.innerHTML = '<option value="">-- เลือกขนาดมาตรฐาน --</option>';
  (data[s] || []).forEach(v => {
    const o = document.createElement('option');
    o.text = v; o.value = v; sel.add(o);
  });
  saveList();
}

function onSelectStdSize() {
  // Clear custom inputs when a standard size is chosen
  const v = document.getElementById('size').value;
  if (v) {
    document.getElementById('customW').value = '';
    document.getElementById('customH').value = '';
  }
}

/* ============================
   KEYBOARD: Enter = addRow
   ============================ */
function handleInputKey(e) {
  if (e.key === 'Enter') { e.preventDefault(); addRow(); }
}

/* ============================
   ADD ROW
   ============================ */
function addRow() {
  const s = document.getElementById('sheet').value;
  if (!s) { flashError('sheet', 'กรุณาเลือกกระจกแม่'); return; }

  const zSelect = document.getElementById('size').value;
  const cw = document.getElementById('customW').value;
  const ch = document.getElementById('customH').value;
  const q = parseInt(document.getElementById('qty').value) || 1;

  let finalSize = '';
  if (cw && ch) finalSize = `${parseFloat(cw)}x${parseFloat(ch)}`;
  else if (zSelect) finalSize = zSelect;
  else { flashError('customW', 'ระบุขนาดหรือเลือกขนาดมาตรฐาน'); return; }

  createRow(s, finalSize, q);
  saveList();
  updateJobUI();

  // Reset for next entry
  document.getElementById('customW').value = '';
  document.getElementById('customH').value = '';
  document.getElementById('size').value = '';
  document.getElementById('qty').value = 1;
  document.getElementById('customW').focus();
}

function flashError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e63946';
  el.style.background = 'rgba(230,57,70,0.08)';
  setTimeout(() => { el.style.borderColor = ''; el.style.background = ''; }, 1500);
  // Show inline hint
  showToast(msg);
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1b4332;color:#fff;padding:8px 18px;border-radius:6px;font-size:13px;font-weight:600;z-index:9999;opacity:0;transition:opacity 0.2s';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2000);
}

/* ============================
   CREATE TABLE ROW
   ============================ */
let rowCounter = 0;
function createRow(sheet, size, qty) {
  rowCounter++;
  const idx = rowCounter;
  const tr = document.createElement('tr');
  tr.dataset.sheet = sheet;
  tr.innerHTML = `
    <td style="color:var(--text-muted);font-size:11px">${idx}</td>
    <td><span class="badge">${sheet}"</span></td>
    <td style="font-weight:600;font-size:13px">${size} cm</td>
    <td style="text-align:center">
      <input class="qty-edit row-qty" type="number" value="${qty}" min="1"
        onchange="saveList()" onfocus="this.select()">
    </td>
    <td>
      <button class="btn-del" onclick="deleteRow(this)">ลบ</button>
    </td>`;
  // hidden cells for saveList compatibility
  const sheetCell = document.createElement('td');
  sheetCell.className = 'row-sheet';
  sheetCell.style.display = 'none';
  sheetCell.textContent = sheet;
  const sizeCell = document.createElement('td');
  sizeCell.className = 'row-size';
  sizeCell.style.display = 'none';
  sizeCell.textContent = size;
  tr.appendChild(sheetCell);
  tr.appendChild(sizeCell);
  document.getElementById('tb').appendChild(tr);
}

function deleteRow(btn) {
  btn.closest('tr').remove();
  updateJobUI();
  saveList();
}

/* ============================
   CLEAR ALL
   ============================ */
function clearAll() {
  if (!confirm('ต้องการล้างรายการทั้งหมดหรือไม่?')) return;
  document.getElementById('tb').innerHTML = '';
  document.getElementById('resultContainers').innerHTML = '';
  rowCounter = 0;
  updateJobUI();
  saveList();
}

/* ============================
   UI STATE (empty state / count)
   ============================ */
function updateJobUI() {
  const rows = document.querySelectorAll('#tb tr');
  const empty = document.getElementById('emptyState');
  const tableWrap = document.getElementById('tableWrap');
  const count = document.getElementById('jobCount');
  const total = Array.from(rows).reduce((s, r) => {
    const q = r.querySelector('.row-qty');
    return s + (q ? parseInt(q.value) || 0 : 0);
  }, 0);

  if (rows.length === 0) {
    empty.style.display = 'flex';
    tableWrap.style.display = 'none';
    count.textContent = '0 รายการ';
  } else {
    empty.style.display = 'none';
    tableWrap.style.display = 'block';
    count.textContent = `${rows.length} แบบ / ${total} ชิ้น`;
  }
}

/* ============================
   PERSIST
   ============================ */
function saveList() {
  const rows = [];
  document.querySelectorAll('#tb tr').forEach(tr => {
    const sheet = tr.querySelector('.row-sheet');
    const size  = tr.querySelector('.row-size');
    const qty   = tr.querySelector('.row-qty');
    if (sheet && size && qty) rows.push({ sheet: sheet.textContent, size: size.textContent, qty: qty.value });
  });
  localStorage.setItem('glassJobList2', JSON.stringify(rows));
  localStorage.setItem('glassSheetSize', document.getElementById('sheet').value);
  localStorage.setItem('glassAllowRotation', document.getElementById('allowRotation').checked);
  localStorage.setItem('glassKerf', document.getElementById('kerf').value);
}

function loadList() {
  const saved    = localStorage.getItem('glassJobList2') || localStorage.getItem('glassJobList');
  const sheet    = localStorage.getItem('glassSheetSize');
  const rotation = localStorage.getItem('glassAllowRotation');
  const kerf     = localStorage.getItem('glassKerf');
  if (saved)    JSON.parse(saved).forEach(r => createRow(r.sheet, r.size, r.qty));
  if (sheet)    document.getElementById('sheet').value = sheet;
  if (rotation !== null) document.getElementById('allowRotation').checked = (rotation === 'true');
  if (kerf !== null)     document.getElementById('kerf').value = kerf;
  if (sheet) loadSizes();
}

/* ============================
   CANVAS RENDERING
   ============================ */
// Palette for distinguishing different sizes
const COLORS = [
  ['rgba(52,160,164,0.18)','#1a6b70'],
  ['rgba(82,183,136,0.18)','#2d6a4f'],
  ['rgba(255,183,77,0.22)','#b45309'],
  ['rgba(156,110,220,0.18)','#6d28d9'],
  ['rgba(248,113,113,0.18)','#b91c1c'],
  ['rgba(59,130,246,0.18)','#1d4ed8'],
  ['rgba(236,72,153,0.18)','#9d174d'],
];

function renderSheet(ctx, canvasW, canvasH, sw, sh, items, sheet_label, piece_count, colorMap) {
  const dpr = window.devicePixelRatio || 1;
  ctx.canvas.width  = Math.round(canvasW * dpr);
  ctx.canvas.height = Math.round(canvasH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pad = { top: 10, left: 10, right: 10, bottom: 10 };
  const drawW = canvasW - pad.left - pad.right;
  const drawH = canvasH - pad.top - pad.bottom;
  const scale = Math.min(drawW / sw, drawH / sh);
  const ox = pad.left + (drawW - sw * scale) / 2;
  const oy = pad.top  + (drawH - sh * scale) / 2;

  // Background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Sheet rect
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ox, oy, sw * scale, sh * scale);

  // Pieces
  items.forEach(it => {
    const [fillColor, strokeColor] = colorMap[it.label] || ['rgba(200,200,200,0.3)', '#999'];
    const px = ox + it.x * scale;
    const py = oy + it.y * scale;
    const pw = it.w * scale;
    const ph = it.h * scale;

    ctx.fillStyle = fillColor;
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(px, py, pw, ph);

    // Label (size)
    if (pw > 28 && ph > 16) {
      ctx.fillStyle = strokeColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cx = px + pw / 2;
      const cy = py + ph / 2;
      if (pw > 50 && ph > 26) {
        ctx.font = `bold ${Math.min(11, pw/8)}px Inter,sans-serif`;
        ctx.fillText(it.label, cx, cy - 5);
        ctx.font = `${Math.min(9, pw/10)}px Inter,sans-serif`;
        ctx.fillStyle = strokeColor + 'bb';
        ctx.fillText(`${it.w.toFixed(1)}×${it.h.toFixed(1)}`, cx, cy + 6);
      } else {
        ctx.font = `bold ${Math.min(9, pw/7)}px Inter,sans-serif`;
        ctx.fillText(`${it.w.toFixed(0)}×${it.h.toFixed(0)}`, cx, cy);
      }
    }
  });
}

/* ============================
   OPTIMIZE
   ============================ */
function optimizeAll() {
  const rows = document.querySelectorAll('#tb tr');
  if (!rows.length) { showToast('กรุณาเพิ่มรายการก่อน'); return; }
  const sheetSize = document.getElementById('sheet').value;
  if (!sheetSize) { showToast('กรุณาเลือกขนาดกระจกแม่'); return; }

  const kerf = parseFloat(document.getElementById('kerf').value) || 0;
  const allowRotation = document.getElementById('allowRotation').checked;
  const sw_cm = parseFloat(sheetSize.split('x')[0]) * INCH_TO_CM;
  const sh_cm = parseFloat(sheetSize.split('x')[1]) * INCH_TO_CM;

  let allItems = [], requestedTotal = 0;
  rows.forEach(row => {
    const size = row.querySelector('.row-size').textContent;
    const q    = parseInt(row.querySelector('.row-qty').value) || 1;
    const [wStr, hStr] = size.split('x');
    const w = parseFloat(wStr), h = parseFloat(hStr);
    requestedTotal += q;
    for (let i = 0; i < q; i++) allItems.push({ w, h, area: w * h, label: size });
  });

  const sortMethods = [
    (a, b) => b.area - a.area,
    (a, b) => Math.max(b.w, b.h) - Math.max(a.w, a.h),
  ];
  const splitMethods = ['SAS', 'LAS', 'SLS', 'LLS'];

  let bestSheets = null, bestCount = -1;
  sortMethods.forEach(fn => {
    const sorted = [...allItems].sort(fn);
    splitMethods.forEach(sm => {
      const sheets = packSimulation(sorted, sw_cm, sh_cm, kerf, allowRotation, sm);
      const cnt = sheets.reduce((s, sh) => s + sh.items.length, 0);
      if (!bestSheets || sheets.length < bestSheets.length ||
          (sheets.length === bestSheets.length && cnt > bestCount)) {
        bestSheets = sheets; bestCount = cnt;
      }
    });
  });

  renderResults(bestSheets, requestedTotal, sheetSize, sw_cm, sh_cm);
  saveList();
  updateJobUI();
}

/* ============================
   PACK SIMULATION
   ============================ */
function packSimulation(items, sw, sh, kerf, allowRotation, splitMethod) {
  const sheets = [];
  let remaining = [...items];

  while (remaining.length > 0) {
    const sheet = { items: [], summary: {}, freeRects: [{ x: 0, y: 0, w: sw, h: sh }] };
    const packed = new Set();

    while (true) {
      let bestIdx = -1, bestRIdx = -1, bestScore = Infinity, bestRot = false;
      for (let i = 0; i < remaining.length; i++) {
        if (packed.has(i)) continue;
        const it = remaining[i];
        sheet.freeRects.forEach((r, ri) => {
          if (it.w <= r.w && it.h <= r.h) {
            const s = Math.min(r.w - it.w, r.h - it.h);
            if (s < bestScore) { bestScore = s; bestIdx = i; bestRIdx = ri; bestRot = false; }
          }
          if (allowRotation && it.h <= r.w && it.w <= r.h) {
            const s = Math.min(r.w - it.h, r.h - it.w);
            if (s < bestScore) { bestScore = s; bestIdx = i; bestRIdx = ri; bestRot = true; }
          }
        });
      }
      if (bestIdx === -1) break;

      const it = remaining[bestIdx];
      const rect = sheet.freeRects.splice(bestRIdx, 1)[0];
      const w = bestRot ? it.h : it.w;
      const h = bestRot ? it.w : it.h;
      sheet.items.push({ x: rect.x, y: rect.y, w, h, label: it.label });
      sheet.summary[it.label] = (sheet.summary[it.label] || 0) + 1;
      packed.add(bestIdx);

      const dw = rect.w - w - kerf, dh = rect.h - h - kerf;
      let horiz = true;
      switch (splitMethod) {
        case 'SAS': horiz = dw <= dh; break;
        case 'LAS': horiz = dw >= dh; break;
        case 'SLS': horiz = w <= h;   break;
        case 'LLS': horiz = w >= h;   break;
      }
      if (horiz) {
        if (dw > 0) sheet.freeRects.push({ x: rect.x + w + kerf, y: rect.y, w: dw, h });
        if (dh > 0) sheet.freeRects.push({ x: rect.x, y: rect.y + h + kerf, w: rect.w, h: dh });
      } else {
        if (dw > 0) sheet.freeRects.push({ x: rect.x + w + kerf, y: rect.y, w: dw, h: rect.h });
        if (dh > 0) sheet.freeRects.push({ x: rect.x, y: rect.y + h + kerf, w, h: dh });
      }
    }

    sheet.usableScraps = sheet.freeRects
      .filter(r => r.w > 10 && r.h > 10)
      .sort((a, b) => (b.w * b.h) - (a.w * a.h));
    remaining = remaining.filter((_, i) => !packed.has(i));
    sheets.push(sheet);
  }
  return sheets;
}

/* ============================
   RENDER RESULTS
   ============================ */
function renderResults(sheets, requestedTotal, sheetSize, sw_cm, sh_cm) {
  const container = document.getElementById('resultContainers');
  const packedCount = sheets.reduce((s, sh) => s + sh.items.length, 0);
  const efficiency = sheets.reduce((s, sh) => {
    return s + sh.items.reduce((ss, it) => ss + it.w * it.h, 0);
  }, 0) / (sheets.length * sw_cm * sh_cm) * 100;

  // Build color map (one color per unique label)
  const allLabels = [...new Set(sheets.flatMap(sh => sh.items.map(it => it.label)))];
  const colorMap = {};
  allLabels.forEach((lbl, i) => { colorMap[lbl] = COLORS[i % COLORS.length]; });

  container.innerHTML = '';

  // Summary
  const sumDiv = document.createElement('div');
  sumDiv.className = 'card summary-card';
  sumDiv.innerHTML = `
    <div>
      <div class="summary-stat-label">แผ่นแม่ที่ต้องใช้</div>
      <div class="summary-stat-val">${sheets.length} <span class="summary-stat-unit">แผ่น</span></div>
    </div>
    <div>
      <div class="summary-stat-label">ชิ้นงานทั้งหมด</div>
      <div class="summary-stat-val">${packedCount} <span class="summary-stat-unit">/ ${requestedTotal} ชิ้น</span></div>
    </div>
    <div>
      <div class="summary-stat-label">ประสิทธิภาพการตัด</div>
      <div class="summary-stat-val">${efficiency.toFixed(1)}<span class="summary-stat-unit">%</span></div>
    </div>`;
  container.appendChild(sumDiv);

  // Each sheet
  sheets.forEach((sheet, idx) => {
    const div = document.createElement('div');
    div.className = 'card';

    const breakdown = Object.entries(sheet.summary)
      .map(([sz, cnt]) => {
        const [fill, stroke] = colorMap[sz] || ['#eee','#999'];
        return `<span class="badge" style="background:${fill};color:${stroke};border:1px solid ${stroke}44">${sz} × ${cnt}</span>`;
      }).join(' ');

    const scrapsHTML = sheet.usableScraps.length > 0 ? `
      <div class="remnants">
        ♻️ เศษที่ใช้ต่อได้:
        ${sheet.usableScraps.map(s => `<span class="remnant-badge">${s.w.toFixed(1)} × ${s.h.toFixed(1)}</span>`).join('')}
      </div>` : '';

    const pieceArea = sheet.items.reduce((s, it) => s + it.w * it.h, 0);
    const sheetEff = (pieceArea / (sw_cm * sh_cm) * 100).toFixed(1);

    div.innerHTML = `
      <div class="sheet-result-header">
        <div>
          <div class="sheet-title">แผ่นที่ #${idx + 1}</div>
          <div class="sheet-subtitle">${sheetSize}" — ${sw_cm.toFixed(1)} × ${sh_cm.toFixed(1)} cm &nbsp;|&nbsp; ${sheet.items.length} ชิ้น &nbsp;|&nbsp; ใช้พื้นที่ ${sheetEff}%</div>
        </div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">${breakdown}</div>
      </div>
      <div class="canvas-wrap"></div>
      ${scrapsHTML}`;

    container.appendChild(div);

    // Draw canvas
    const wrap = div.querySelector('.canvas-wrap');
    const canv = document.createElement('canvas');
    const baseW = wrap.clientWidth || 800;
    const baseH = Math.round((sh_cm / sw_cm) * baseW) + 20;
    wrap.appendChild(canv);
    renderSheet(canv.getContext('2d'), baseW, baseH, sw_cm, sh_cm, sheet.items,
      `${sheetSize}"`, sheet.items.length, colorMap);
  });

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
