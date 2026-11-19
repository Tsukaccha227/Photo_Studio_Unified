/**
 * Photo Studio Unified - Optimized All-in-One PWA Engine
 * Integrates: Photo_Room (Frame / Crop / Collage), Photo_frame, Photo_Calendar_Studio, RisoPrint_Studio
 */
(() => {
  'use strict';

  // =========================================================================
  // 1. Constants & Presets
  // =========================================================================
  const TARGET_24MP = 24000000;
  const PROXY_MAX_SIDE = 1200;
  const RISO_PREVIEW_WIDTH = 720;

  const COLLAGE_LAYOUTS = {
    2: [
      { id: '2-h', name: '左右2列', cells: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1 }] },
      { id: '2-v', name: '上下2段', cells: [{ x: 0, y: 0, w: 1, h: 0.5 }, { x: 0, y: 0.5, w: 1, h: 0.5 }] },
      { id: '2-h-wide', name: '左大・右小', cells: [{ x: 0, y: 0, w: 0.65, h: 1 }, { x: 0.65, y: 0, w: 0.35, h: 1 }] },
      { id: '2-v-wide', name: '上大・下小', cells: [{ x: 0, y: 0, w: 1, h: 0.65 }, { x: 0, y: 0.65, w: 1, h: 0.35 }] }
    ],
    3: [
      { id: '3-cols', name: '縦3列', cells: [{ x: 0, y: 0, w: 1/3, h: 1 }, { x: 1/3, y: 0, w: 1/3, h: 1 }, { x: 2/3, y: 0, w: 1/3, h: 1 }] },
      { id: '3-rows', name: '横3段', cells: [{ x: 0, y: 0, w: 1, h: 1/3 }, { x: 0, y: 1/3, w: 1, h: 1/3 }, { x: 0, y: 2/3, w: 1, h: 1/3 }] },
      { id: '3-l1r2', name: '左1・右2', cells: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }] },
      { id: '3-r1l2', name: '右1・左2', cells: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 1 }] },
      { id: '3-t1b2', name: '上1・下2', cells: [{ x: 0, y: 0, w: 1, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }] },
      { id: '3-b1t2', name: '下1・上2', cells: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 1, h: 0.5 }] }
    ],
    4: [
      { id: '4-grid', name: '2×2', cells: [{ x: 0, y: 0, w: 0.5, h: 0.5 }, { x: 0.5, y: 0, w: 0.5, h: 0.5 }, { x: 0, y: 0.5, w: 0.5, h: 0.5 }, { x: 0.5, y: 0.5, w: 0.5, h: 0.5 }] },
      { id: '4-cols', name: '縦4列', cells: [{ x: 0, y: 0, w: 0.25, h: 1 }, { x: 0.25, y: 0, w: 0.25, h: 1 }, { x: 0.5, y: 0, w: 0.25, h: 1 }, { x: 0.75, y: 0, w: 0.25, h: 1 }] },
      { id: '4-rows', name: '横4段', cells: [{ x: 0, y: 0, w: 1, h: 0.25 }, { x: 0, y: 0.25, w: 1, h: 0.25 }, { x: 0, y: 0.5, w: 1, h: 0.25 }, { x: 0, y: 0.75, w: 1, h: 0.25 }] },
      { id: '4-l1r3', name: '左1・右3', cells: [{ x: 0, y: 0, w: 0.5, h: 1 }, { x: 0.5, y: 0, w: 0.5, h: 1/3 }, { x: 0.5, y: 1/3, w: 0.5, h: 1/3 }, { x: 0.5, y: 2/3, w: 0.5, h: 1/3 }] },
      { id: '4-r1l3', name: '右1・左3', cells: [{ x: 0, y: 0, w: 0.5, h: 1/3 }, { x: 0, y: 1/3, w: 0.5, h: 1/3 }, { x: 0, y: 2/3, w: 0.5, h: 1/3 }, { x: 0.5, y: 0, w: 0.5, h: 1 }] },
      { id: '4-t1b3', name: '上1・下3', cells: [{ x: 0, y: 0, w: 1, h: 0.5 }, { x: 0, y: 0.5, w: 1/3, h: 0.5 }, { x: 1/3, y: 0.5, w: 1/3, h: 0.5 }, { x: 2/3, y: 0.5, w: 1/3, h: 0.5 }] }
    ]
  };

  const RISO_INKS = [
    { id: 'black',    name: 'BLACK',   hex: '#141414', r: 20,  g: 20,  b: 20,  hatched: false },
    { id: 'blue',     name: 'BLUE',    hex: '#0078bf', r: 0,   g: 120, b: 191, hatched: false },
    { id: 'pink',     name: 'PINK',    hex: '#ff48b0', r: 255, g: 72,  b: 176, hatched: false },
    { id: 'green',    name: 'GREEN',   hex: '#00a95c', r: 0,   g: 169, b: 92,  hatched: false },
    { id: 'orange',   name: 'ORANGE',  hex: '#ff6c2f', r: 255, g: 108, b: 47,  hatched: false },
    { id: 'red',      name: 'RED',     hex: '#ff665e', r: 255, g: 102, b: 94,  hatched: false },
    { id: 'yellow',   name: 'YELLOW',  hex: '#ffe800', r: 255, g: 232, b: 0,   hatched: false },
    { id: 'burgundy', name: 'CRIMSON', hex: '#914e56', r: 145, g: 78,  b: 86,  hatched: true  },
    { id: 'indigo',   name: 'INDIGO',  hex: '#3d5588', r: 61,  g: 85,  b: 136, hatched: true  },
    { id: 'violet',   name: 'VIOLET',  hex: '#765ba7', r: 118, g: 91,  b: 167, hatched: true  },
    { id: 'teal',     name: 'TEAL',    hex: '#236868', r: 35,  g: 104, b: 104, hatched: true  },
    { id: 'slate',    name: 'SLATE',   hex: '#5e6973', r: 94,  g: 105, b: 115, hatched: true  }
  ];

  const RISO_PAPERS = [
    { id: 'cream', name: 'CREAM',     hex: '#ece6d8', r: 236, g: 230, b: 216, darkFiber: false },
    { id: 'white', name: 'WHITE',     hex: '#fafafa', r: 250, g: 250, b: 250, darkFiber: false },
    { id: 'kraft', name: 'KRAFT',     hex: '#b69567', r: 182, g: 149, b: 103, darkFiber: true  },
    { id: 'news',  name: 'NEWSPRINT', hex: '#d8d2c5', r: 216, g: 210, b: 197, darkFiber: true  }
  ];

  const RISO_STYLES = ['ROSETTE', 'HALFTONE', 'GRAIN', 'HATCH'];
  const RISO_EXPORT_MPS = [3, 6, 10, 12, 20, 24];

  const RISO_DEFAULT_PRESETS = [
    { title: 'Red + Black',          inks: ['red', 'black'],           paper: 'white', style: 'ROSETTE',  margin: 14, shift: 3 },
    { title: 'Yellow + Blue',        inks: ['yellow', 'blue'],         paper: 'cream', style: 'GRAIN',    margin: 14, shift: 4 },
    { title: 'Black + Pink',         inks: ['black', 'pink'],          paper: 'kraft', style: 'ROSETTE',  margin: 14, shift: 3 },
    { title: 'Yellow + Pink + Blue', inks: ['yellow', 'pink', 'blue'], paper: 'cream', style: 'ROSETTE',  margin: 14, shift: 4 },
    { title: 'Pink + Blue Rosette',  inks: ['pink', 'blue'],           paper: 'cream', style: 'ROSETTE',  margin: 14, shift: 4 },
    { title: 'Yellow + Red + Blue',  inks: ['yellow', 'red', 'blue'],  paper: 'cream', style: 'HALFTONE', margin: 14, shift: 4 },
    { title: 'Orange + Black Kraft', inks: ['orange', 'black'],        paper: 'kraft', style: 'ROSETTE',  margin: 0,  shift: 3 },
    { title: 'Orange + Green Shift', inks: ['orange', 'green'],        paper: 'cream', style: 'GRAIN',    margin: 15, shift: 16 }
  ];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // =========================================================================
  // 2. Unified Application State
  // =========================================================================
  const state = {
    mode: 'frame', // 'frame' | 'crop' | 'collage' | 'calendar' | 'riso'
    photos: [],
    currentIndex: 0,
    isExporting: false,

    frame: {
      fillMode: 'solid', // 'solid' | 'extracted' | 'blur'
      solidColor: '#FFFFFF',
      extractedIndex: 0,
      autoPerPhoto: true,
      borderPercent: 8,
      canvasRatio: 'original',
      photoRatio: 'original',
      sizingRule: 'equal-margin',
      blurAmount: 35,
      blurBrightness: 100,
      cornerRadius: 0,
      shadowStrength: 0
    },

    crop: {
      baseRatio: '4:5',
      orientation: 'portrait'
    },

    collage: {
      baseRatio: '4:5',
      orientation: 'portrait',
      divisions: 2,
      layoutId: '2-h',
      outerBorderPercent: 3.0,
      innerGapPercent: 1.5,
      borderColor: '#FFFFFF',
      activeCellIdx: 0,
      slots: [
        { photoIndex: 0, panX: 0, panY: 0, zoom: 1 },
        { photoIndex: 1, panX: 0, panY: 0, zoom: 1 },
        { photoIndex: 2, panX: 0, panY: 0, zoom: 1 },
        { photoIndex: 3, panX: 0, panY: 0, zoom: 1 }
      ],
      lastRenderedBoxes: [],
      swapDrag: { active: false, fromIdx: -1, overIdx: -1, pointerX: 0, pointerY: 0 }
    },

    cal: {
      showTime: true,
      stampTarget: 'photo',
      calPos: 'bottom-left',
      calScale: 1.0,
      calMarginX: 6.5,
      calMarginY: 6.0,
      logoScale: 1.0,
      logoMarginY: 4.2,
      canvasRatio: 'original',
      photoRatio: 'original',
      cropOffsetX: 0,
      cropOffsetY: 0,
      frameMode: 'none',
      frameThickness: 6.0,
      frameColor: '#FFFFFF',
      blurAmount: 40,
      blurBrightness: 85,
      innerBorder: false,
      photoShadow: true,
      textColor: '#FFFFFF',
      logoColor: '#FFFFFF',
      ringColor: '#DBE734',
      weekendMode: 'mono',
      sunColor: '#FF5252',
      satColor: '#448AFF',
      showLogo: true,
      logoCanvas: null,
      defaultLogoCanvas: null,
      defaultLogoLabel: '内蔵Tcロゴ'
    },

    riso: {
      inks: ['yellow', 'orange', 'blue'],
      activeTabIndex: 0,
      paperIndex: 0,
      styleIndex: 0,
      dotSize: 5.5,
      texture: 48,
      contrast: 115,
      brightness: 0,
      shift: 4,
      margin: 0,
      radius: 18,
      exportMP: 24,
      exportFormat: 'jpeg',
      presets: [...RISO_DEFAULT_PRESETS]
    }
  };

  try {
    const saved = localStorage.getItem('photo_studio_riso_presets');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) state.riso.presets = [...parsed, ...RISO_DEFAULT_PRESETS];
    }
  } catch (_) {}

  // =========================================================================
  // 3. DOM References & Helpers
  // =========================================================================
  const $ = (id) => document.getElementById(id);

  const dom = {
    fileInput: $('fileInput'),
    customLogoInput: $('customLogoInput'),
    toast: $('toast'),
    stageCanvasArea: $('stageCanvasArea'),
    previewCanvas: $('previewCanvas'),
    emptyState: $('emptyState'),
    infoBadge: $('infoBadge'),
    infoResolution: $('infoResolution'),
    infoIndex: $('infoIndex'),
    dragHintBadge: $('dragHintBadge'),
    dragHintText: $('dragHintText'),
    stageOverlayActions: $('stageOverlayActions'),
    filmstripBar: $('filmstripBar'),
    filmstripList: $('filmstripList'),
    exifStrip: $('exifStrip'),
    exportBtn: $('exportBtn'),
    exportBtnText: $('exportBtnText'),
    installAppBtn: $('installAppBtn'),
    exportModal: $('exportModal'),
    exportProgressArea: $('exportProgressArea'),
    exportProgressText: $('exportProgressText'),
    exportProgressCount: $('exportProgressCount'),
    exportProgressBar: $('exportProgressBar'),
    exportActionsArea: $('exportActionsArea'),
    exportSummaryText: $('exportSummaryText'),
    risoExportOpts: $('risoExportOpts'),
    risoMpGrid: $('risoMpGrid'),
    zipExportBtn: $('zipExportBtn'),
    risoPresetModal: $('risoPresetModal'),
    risoPresetGrid: $('risoPresetGrid'),
    settingsModal: $('settingsModal')
  };

  let toastTimer = null;
  function showToast(msg, duration = 1600) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    clearTimeout(toastTimer);
    if (duration > 0) {
      toastTimer = setTimeout(() => dom.toast.classList.remove('show'), duration);
    }
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function getCurrentPhoto() {
    return state.photos[state.currentIndex] || null;
  }

  function resolveRatioStr(baseStr, orientation) {
    const [a, b] = baseStr.split(':').map(Number);
    if (!a || !b || a === b) return '1:1';
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return orientation === 'landscape' ? `${hi}:${lo}` : `${lo}:${hi}`;
  }

  function parseAspectRatio(ratioStr, fallbackW, fallbackH) {
    if (!ratioStr || ratioStr === 'original') return fallbackW / Math.max(1, fallbackH);
    const [w, h] = ratioStr.split(':').map(Number);
    return (w && h) ? (w / h) : (fallbackW / Math.max(1, fallbackH));
  }

  function calcDimensionsForMP(mp, aspect) {
    const total = mp * 1000000;
    const w = Math.round(Math.sqrt(total * aspect));
    const h = Math.round(total / Math.max(1, w));
    return { w, h };
  }

  function formatDateForInput(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }

  // =========================================================================
  // 4. Media Engine: Proxy, Palette (k-means++), Exif/XMP, Tc Logo Extractor
  // =========================================================================
  function createPreviewProxy(img) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (Math.max(w, h) <= PROXY_MAX_SIDE) return img;
    const scale = PROXY_MAX_SIDE / Math.max(w, h);
    const c = document.createElement('canvas');
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function extractFiveColors(img) {
    const sampleSize = 64;
    const c = document.createElement('canvas');
    c.width = sampleSize;
    c.height = sampleSize;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

    const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
    const pixels = [];
    for (let i = 0; i < data.length; i += 16) {
      if (data[i + 3] < 128) continue;
      pixels.push([data[i], data[i + 1], data[i + 2]]);
    }
    if (pixels.length < 5) {
      return ['#FFFFFF', '#E2E8F0', '#94A3B8', '#475569', '#1E293B'];
    }

    const k = 5;
    const centroids = [pixels[Math.floor(pixels.length / 2)]];
    while (centroids.length < k) {
      let farthest = pixels[0];
      let maxDist = -1;
      for (const p of pixels) {
        let minD = Infinity;
        for (const cen of centroids) {
          const d = (p[0] - cen[0]) ** 2 + (p[1] - cen[1]) ** 2 + (p[2] - cen[2]) ** 2;
          if (d < minD) minD = d;
        }
        if (minD > maxDist) {
          maxDist = minD;
          farthest = p;
        }
      }
      centroids.push([...farthest]);
    }

    let clusters = Array.from({ length: k }, () => []);
    for (let iter = 0; iter < 8; iter++) {
      clusters = Array.from({ length: k }, () => []);
      for (const p of pixels) {
        let bestIdx = 0;
        let bestD = Infinity;
        for (let i = 0; i < k; i++) {
          const cen = centroids[i];
          const d = (p[0] - cen[0]) ** 2 + (p[1] - cen[1]) ** 2 + (p[2] - cen[2]) ** 2;
          if (d < bestD) { bestD = d; bestIdx = i; }
        }
        clusters[bestIdx].push(p);
      }
      for (let i = 0; i < k; i++) {
        const cl = clusters[i];
        if (!cl.length) continue;
        let r = 0, g = 0, b = 0;
        for (const p of cl) { r += p[0]; g += p[1]; b += p[2]; }
        centroids[i] = [Math.round(r / cl.length), Math.round(g / cl.length), Math.round(b / cl.length)];
      }
    }

    return centroids
      .map((rgb, idx) => ({ rgb, count: clusters[idx].length }))
      .sort((a, b) => b.count - a.count)
      .map(item => rgbToHex(item.rgb[0], item.rgb[1], item.rgb[2]));
  }

  function parseFlexibleDate(val) {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) return val;
    if (typeof val === 'string') {
      const m = val.trim().match(/^(\d{4})[:\-](\d{2})[:\-](\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);
      if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6] || 0));
      const d = new Date(val.trim());
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  }

  async function scanBinaryForDate(file) {
    try {
      const buf = await file.slice(0, 524288).arrayBuffer();
      const bytes = new Uint8Array(buf);
      let text = '';
      for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        text += (b >= 32 && b <= 126) ? String.fromCharCode(b) : ' ';
      }
      const xmp = text.match(/(?:photoshop:DateCreated|xmp:CreateDate|exif:DateTimeOriginal)\s*=\s*"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[^"]*)"/i);
      if (xmp && xmp[1]) {
        const d = parseFlexibleDate(xmp[1]);
        if (d) return d;
      }
      const matches = [...text.matchAll(/\b(20\d{2}|19\d{2}):(0[1-9]|1[0-2]):(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)\b/g)];
      if (matches.length) {
        const dates = matches.map(m => parseFlexibleDate(m[0])).filter(Boolean);
        if (dates.length) {
          dates.sort((a, b) => a.getTime() - b.getTime());
          return dates[0];
        }
      }
    } catch (_) {}
    return null;
  }

  async function extractPhotoDate(file) {
    if (!file) return { date: new Date(), source: '現在時刻' };
    if (window.exifr) {
      try {
        const data = await window.exifr.parse(file, { tiff: true, exif: true, xmp: true, icc: false });
        if (data) {
          for (const c of [data.DateTimeOriginal, data.CreateDate, data.DateCreated, data.ModifyDate]) {
            const d = parseFlexibleDate(c);
            if (d) return { date: d, source: 'Exif/XMP' };
          }
        }
      } catch (_) {}
    }
    const binDate = await scanBinaryForDate(file);
    if (binDate) return { date: binDate, source: 'Exifバイナリ' };

    const nm = file.name.match(/(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[_-\s]?([01]\d|2[0-3])([0-5]\d)/);
    if (nm) {
      return {
        date: new Date(Number(nm[1]), Number(nm[2]) - 1, Number(nm[3]), Number(nm[4]), Number(nm[5])),
        source: 'ファイル名'
      };
    }
    return { date: file.lastModified ? new Date(file.lastModified) : new Date(), source: '更新日時' };
  }

  // Authentic Tc Logo Loader (rogo.af -> 構図.jpg -> built-in vector fallback)
  function extractPngFromAffinityBinary(arrayBuffer) {
    const bytes = new Uint8Array(arrayBuffer);
    const pngSig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const iendSig = [0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82];
    let start = -1;
    for (let i = 0; i < bytes.length - 8; i++) {
      let ok = true;
      for (let j = 0; j < 8; j++) if (bytes[i + j] !== pngSig[j]) { ok = false; break; }
      if (ok) { start = i; break; }
    }
    if (start === -1) return null;
    let end = -1;
    for (let i = start + 8; i < bytes.length - 8; i++) {
      let ok = true;
      for (let j = 0; j < 8; j++) if (bytes[i + j] !== iendSig[j]) { ok = false; break; }
      if (ok) { end = i + 8; break; }
    }
    if (end === -1) return null;
    return new Blob([bytes.subarray(start, end)], { type: 'image/png' });
  }

  function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  function convertToLogoMask(img) {
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = Math.max(d[i], d[i + 1], d[i + 2]);
      const darkness = 255 - lum;
      const dAlpha = darkness < 20 ? 0 : Math.min(255, Math.round((darkness - 20) * (255 / 220)));
      const origAlpha = d[i + 3];
      d[i] = 255; d[i + 1] = 255; d[i + 2] = 255;
      d[i + 3] = Math.round(dAlpha * origAlpha / 255);
    }
    ctx.putImageData(imgData, 0, 0);
    return c;
  }

  function trimTransparentEdges(sourceCanvas) {
    const c = document.createElement('canvas');
    c.width = sourceCanvas.width;
    c.height = sourceCanvas.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(sourceCanvas, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    let top = height, left = width, right = 0, bottom = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 15) {
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }
    if (right <= left || bottom <= top) return c;
    const tw = right - left + 1;
    const th = bottom - top + 1;
    const out = document.createElement('canvas');
    out.width = tw;
    out.height = th;
    out.getContext('2d').drawImage(c, left, top, tw, th, 0, 0, tw, th);
    return out;
  }

  function extractLogoFromKouzuJpg(img) {
    const sx = Math.round(img.width * (1435 / 3000));
    const sy = Math.round(img.height * (78 / 2000));
    const sw = Math.round(img.width * (130 / 3000));
    const sh = Math.round(img.height * (92 / 2000));
    const c = document.createElement('canvas');
    c.width = sw;
    c.height = sh;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const imgData = ctx.getImageData(0, 0, sw, sh);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const lum = Math.max(d[i], d[i + 1], d[i + 2]);
      const alpha = lum < 20 ? 0 : Math.min(255, Math.round((lum - 20) * (255 / 220)));
      d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = alpha;
    }
    ctx.putImageData(imgData, 0, 0);
    return trimTransparentEdges(c);
  }

  function createFallbackTcCanvas() {
    const c = document.createElement('canvas');
    c.width = 240;
    c.height = 170;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(46, 46);
    ctx.bezierCurveTo(28, 56, 26, 30, 48, 20);
    ctx.bezierCurveTo(74, 8, 120, 26, 158, 30);
    ctx.bezierCurveTo(182, 32, 202, 26, 214, 18);
    ctx.bezierCurveTo(198, 36, 174, 42, 146, 38);
    ctx.bezierCurveTo(110, 32, 76, 18, 52, 28);
    ctx.bezierCurveTo(38, 34, 38, 46, 46, 46);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(132, 28);
    ctx.bezierCurveTo(116, 68, 98, 118, 74, 144);
    ctx.bezierCurveTo(56, 162, 28, 162, 22, 144);
    ctx.bezierCurveTo(18, 130, 30, 118, 42, 122);
    ctx.bezierCurveTo(50, 125, 50, 136, 42, 138);
    ctx.bezierCurveTo(36, 140, 34, 132, 38, 128);
    ctx.bezierCurveTo(30, 128, 28, 140, 34, 148);
    ctx.bezierCurveTo(44, 156, 64, 146, 80, 118);
    ctx.bezierCurveTo(98, 86, 110, 52, 120, 26);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 4.2;
    ctx.beginPath();
    ctx.moveTo(72, 102);
    ctx.bezierCurveTo(112, 80, 162, 60, 206, 36);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(194, 96);
    ctx.bezierCurveTo(202, 84, 192, 74, 176, 76);
    ctx.bezierCurveTo(154, 79, 136, 104, 140, 130);
    ctx.bezierCurveTo(143, 150, 164, 158, 186, 148);
    ctx.bezierCurveTo(202, 140, 214, 126, 222, 112);
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(176, 76);
    ctx.bezierCurveTo(146, 78, 124, 106, 128, 134);
    ctx.bezierCurveTo(132, 156, 158, 164, 186, 150);
    ctx.bezierCurveTo(164, 156, 146, 146, 142, 128);
    ctx.bezierCurveTo(138, 104, 156, 80, 176, 76);
    ctx.fill();

    return trimTransparentEdges(c);
  }

  async function loadAuthenticLogo() {
    try {
      const res = await fetch('./rogo.af', { cache: 'no-cache' });
      if (res.ok) {
        const pngBlob = extractPngFromAffinityBinary(await res.arrayBuffer());
        if (pngBlob) {
          const img = await blobToImage(pngBlob);
          state.cal.defaultLogoCanvas = trimTransparentEdges(convertToLogoMask(img));
          state.cal.defaultLogoLabel = 'rogo.af 抽出';
          state.cal.logoCanvas = state.cal.defaultLogoCanvas;
          $('cal-logoSourceBadge').textContent = state.cal.defaultLogoLabel;
          return;
        }
      }
    } catch (_) {}

    try {
      const res = await fetch('./構図.jpg', { cache: 'no-cache' });
      if (res.ok) {
        const img = await blobToImage(await res.blob());
        state.cal.defaultLogoCanvas = extractLogoFromKouzuJpg(img);
        state.cal.defaultLogoLabel = '構図.jpg 抽出';
        state.cal.logoCanvas = state.cal.defaultLogoCanvas;
        $('cal-logoSourceBadge').textContent = state.cal.defaultLogoLabel;
        return;
      }
    } catch (_) {}

    state.cal.defaultLogoCanvas = createFallbackTcCanvas();
    state.cal.defaultLogoLabel = '内蔵Tcロゴ';
    state.cal.logoCanvas = state.cal.defaultLogoCanvas;
    $('cal-logoSourceBadge').textContent = state.cal.defaultLogoLabel;
  }

  // =========================================================================
  // 5. Renderers for All 5 Studio Modes
  // =========================================================================
  function drawRoundedRectPath(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
  }

  // --- Mode 1: FRAME Renderer ---
  function renderFrame(targetCanvas, photoObj, maxPreviewDim = null, showGrid = false) {
    const isPreview = Boolean(maxPreviewDim);
    const src = (isPreview && photoObj.proxy) ? photoObj.proxy : photoObj.img;
    const origW = photoObj.width;
    const origH = photoObj.height;
    const f = state.frame;
    const ratio = f.borderPercent / 100;

    // 1. Native cropped dimensions for inner photo
    const origAspect = origW / Math.max(1, origH);
    const innerAspect = parseAspectRatio(f.photoRatio, origW, origH);
    const baseInnerW = Math.round(origAspect > innerAspect ? origH * innerAspect : origW);
    const baseInnerH = Math.round(origAspect > innerAspect ? origH : origW / innerAspect);

    // 2. Full-resolution output dimensions & inner photo placement
    let fullTotalW, fullTotalH, fullInnerW, fullInnerH;
    if (f.canvasRatio === 'original') {
      const outPadX = f.sizingRule === 'equal-margin'
        ? Math.round(Math.min(baseInnerW, baseInnerH) * ratio)
        : Math.round(baseInnerW * ratio);
      const outPadY = f.sizingRule === 'equal-margin'
        ? outPadX
        : Math.round(baseInnerH * ratio);
      fullTotalW = baseInnerW + outPadX * 2;
      fullTotalH = baseInnerH + outPadY * 2;
      fullInnerW = baseInnerW;
      fullInnerH = baseInnerH;
    } else {
      const outerAspect = parseAspectRatio(f.canvasRatio, baseInnerW, baseInnerH);
      const unitShort = Math.min(outerAspect, 1);
      const unitPad = unitShort * ratio;
      const unitAvailW = Math.max(0.05, outerAspect - unitPad * 2);
      const unitAvailH = Math.max(0.05, 1 - unitPad * 2);
      let unitPhotoW = unitAvailW;
      let unitPhotoH = unitPhotoW / innerAspect;
      if (unitPhotoH > unitAvailH) {
        unitPhotoH = unitAvailH;
        unitPhotoW = unitPhotoH * innerAspect;
      }

      const rawH = baseInnerH / Math.max(0.01, unitPhotoH);
      const rawW = outerAspect * rawH;
      if (rawW * rawH > TARGET_24MP) {
        const capped = calcDimensionsForMP(24, outerAspect);
        fullTotalW = capped.w;
        fullTotalH = capped.h;
      } else {
        fullTotalW = Math.round(rawW);
        fullTotalH = Math.round(rawH);
      }

      const fullShort = Math.min(fullTotalW, fullTotalH);
      const fullMinPad = fullShort * ratio;
      const fullAvailW = Math.max(10, fullTotalW - fullMinPad * 2);
      const fullAvailH = Math.max(10, fullTotalH - fullMinPad * 2);
      let fitW = fullAvailW;
      let fitH = fitW / innerAspect;
      if (fitH > fullAvailH) {
        fitH = fullAvailH;
        fitW = fitH * innerAspect;
      }
      fullInnerW = Math.round(fitW);
      fullInnerH = Math.round(fitH);
    }

    // 3. Preview vs Export scaling
    let scale = 1;
    if (isPreview) {
      const maxSide = Math.max(fullTotalW, fullTotalH);
      if (maxSide > maxPreviewDim) scale = maxPreviewDim / maxSide;
    }

    const totalW = Math.max(10, Math.round(fullTotalW * scale));
    const totalH = Math.max(10, Math.round(fullTotalH * scale));
    const innerW = Math.max(4, Math.round(fullInnerW * scale));
    const innerH = Math.max(4, Math.round(fullInnerH * scale));
    const padX = Math.round((totalW - innerW) / 2);
    const padY = Math.round((totalH - innerH) / 2);
    const minInnerSide = Math.min(innerW, innerH);

    if (targetCanvas.width !== totalW) targetCanvas.width = totalW;
    if (targetCanvas.height !== totalH) targetCanvas.height = totalH;

    const ctx = targetCanvas.getContext('2d');
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isPreview ? 'medium' : 'high';

    // 4. Outer Frame Background
    if (f.fillMode === 'blur') {
      const blurPx = Math.max(2, Math.round((f.blurAmount / 1000) * Math.max(totalW, totalH)));
      const exp = blurPx * 3;
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 0, totalW, totalH);
      ctx.save();
      ctx.filter = `blur(${blurPx}px) brightness(${f.blurBrightness}%) saturate(115%)`;
      drawCalCroppedPhoto(ctx, src, {
        x: -exp, y: -exp,
        w: totalW + exp * 2, h: totalH + exp * 2
      }, totalW / Math.max(1, totalH), 0, 0);
      ctx.restore();
    } else {
      let fillColor = f.solidColor;
      if (f.fillMode === 'extracted') {
        const ref = f.autoPerPhoto ? photoObj : (getCurrentPhoto() || photoObj);
        fillColor = ref.palette[f.extractedIndex] || '#FFFFFF';
      }
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    // 5. Shadow & Inner Cropped Photo
    const radiusPx = Math.round((f.cornerRadius / 100) * (minInnerSide / 2));

    if (f.shadowStrength > 0 && (padX > 0 || padY > 0)) {
      ctx.save();
      const sBlur = Math.round((f.shadowStrength / 100) * (minInnerSide * 0.08));
      ctx.shadowColor = `rgba(0, 0, 0, ${(f.shadowStrength / 100) * 0.55})`;
      ctx.shadowBlur = sBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = Math.round(sBlur * 0.35);
      drawRoundedRectPath(ctx, padX, padY, innerW, innerH, radiusPx);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.restore();
    }

    const fc = photoObj.frameCrop || { offsetX: 0, offsetY: 0 };
    ctx.save();
    if (radiusPx > 0) {
      drawRoundedRectPath(ctx, padX, padY, innerW, innerH, radiusPx);
      ctx.clip();
    }
    drawCalCroppedPhoto(ctx, src, { x: padX, y: padY, w: innerW, h: innerH }, innerAspect, fc.offsetX, fc.offsetY);

    if (showGrid && f.photoRatio !== 'original') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX + innerW / 3, padY); ctx.lineTo(padX + innerW / 3, padY + innerH);
      ctx.moveTo(padX + (innerW * 2) / 3, padY); ctx.lineTo(padX + (innerW * 2) / 3, padY + innerH);
      ctx.moveTo(padX, padY + innerH / 3); ctx.lineTo(padX + innerW, padY + innerH / 3);
      ctx.moveTo(padX, padY + (innerH * 2) / 3); ctx.lineTo(padX + innerW, padY + (innerH * 2) / 3);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();

    return { totalW: fullTotalW, totalH: fullTotalH };
  }

  // --- Mode 2: CROP Renderer ---
  function renderCrop(targetCanvas, photoObj, maxPreviewDim = null, showGrid = false) {
    const isPreview = Boolean(maxPreviewDim);
    const src = (isPreview && photoObj.proxy) ? photoObj.proxy : photoObj.img;
    const srcFullW = src.width || photoObj.width;
    const srcFullH = src.height || photoObj.height;

    const ratioStr = resolveRatioStr(state.crop.baseRatio, state.crop.orientation);
    const targetAspect = parseAspectRatio(ratioStr, photoObj.width, photoObj.height);
    const edit = photoObj.crop;

    let fullW, fullH;
    if (photoObj.width / photoObj.height > targetAspect) {
      fullH = photoObj.height;
      fullW = photoObj.height * targetAspect;
    } else {
      fullW = photoObj.width;
      fullH = photoObj.width / targetAspect;
    }
    const outW = Math.round(fullW);
    const outH = Math.round(fullH);

    let baseW, baseH;
    if (srcFullW / srcFullH > targetAspect) {
      baseH = srcFullH;
      baseW = srcFullH * targetAspect;
    } else {
      baseW = srcFullW;
      baseH = srcFullW / targetAspect;
    }

    const srcW = baseW / edit.zoom;
    const srcH = baseH / edit.zoom;
    const maxOx = (srcFullW - srcW) / 2;
    const maxOy = (srcFullH - srcH) / 2;
    const srcX = maxOx - edit.panX * maxOx;
    const srcY = maxOy - edit.panY * maxOy;

    let scale = 1;
    if (isPreview && Math.max(outW, outH) > maxPreviewDim) {
      scale = maxPreviewDim / Math.max(outW, outH);
    }
    const cw = Math.round(outW * scale);
    const ch = Math.round(outH * scale);
    if (targetCanvas.width !== cw) targetCanvas.width = cw;
    if (targetCanvas.height !== ch) targetCanvas.height = ch;

    const ctx = targetCanvas.getContext('2d');
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isPreview ? 'medium' : 'high';
    ctx.drawImage(src, srcX, srcY, srcW, srcH, 0, 0, cw, ch);

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cw / 3, 0); ctx.lineTo(cw / 3, ch);
      ctx.moveTo((cw * 2) / 3, 0); ctx.lineTo((cw * 2) / 3, ch);
      ctx.moveTo(0, ch / 3); ctx.lineTo(cw, ch / 3);
      ctx.moveTo(0, (ch * 2) / 3); ctx.lineTo(cw, (ch * 2) / 3);
      ctx.stroke();
    }
    ctx.restore();

    return { totalW: outW, totalH: outH, ratioStr };
  }

  // --- Mode 3: COLLAGE Renderer (24MP Output) ---
  function getActiveCollageLayout() {
    const list = COLLAGE_LAYOUTS[state.collage.divisions] || COLLAGE_LAYOUTS[2];
    return list.find(l => l.id === state.collage.layoutId) || list[0];
  }

  function drawPhotoInCell(ctx, photoObj, slot, bx, by, bw, bh, isPreview) {
    if (!photoObj) return;
    const src = (isPreview && photoObj.proxy) ? photoObj.proxy : photoObj.img;
    const sw0 = src.width || photoObj.width;
    const sh0 = src.height || photoObj.height;
    const boxAspect = bw / Math.max(1, bh);

    let baseW, baseH;
    if (sw0 / sh0 > boxAspect) {
      baseH = sh0; baseW = sh0 * boxAspect;
    } else {
      baseW = sw0; baseH = sw0 / boxAspect;
    }

    const srcW = baseW / slot.zoom;
    const srcH = baseH / slot.zoom;
    const maxOx = (sw0 - srcW) / 2;
    const maxOy = (sh0 - srcH) / 2;
    const srcX = maxOx - slot.panX * maxOx;
    const srcY = maxOy - slot.panY * maxOy;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isPreview ? 'medium' : 'high';
    ctx.beginPath();
    ctx.rect(bx, by, bw, bh);
    ctx.clip();
    ctx.drawImage(src, srcX, srcY, srcW, srcH, bx, by, bw, bh);
    ctx.restore();
  }

  function renderCollage(targetCanvas, isPreview = true) {
    const col = state.collage;
    const ratioStr = resolveRatioStr(col.baseRatio, col.orientation);
    const aspect = parseAspectRatio(ratioStr, 4, 5);
    const full = calcDimensionsForMP(24, aspect);

    let totalW, totalH;
    if (isPreview) {
      const longSide = 960;
      totalW = aspect >= 1 ? longSide : Math.round(longSide * aspect);
      totalH = aspect >= 1 ? Math.round(longSide / aspect) : longSide;
    } else {
      totalW = full.w;
      totalH = full.h;
    }

    if (targetCanvas.width !== totalW) targetCanvas.width = totalW;
    if (targetCanvas.height !== totalH) targetCanvas.height = totalH;

    const ctx = targetCanvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = col.borderColor;
    ctx.fillRect(0, 0, totalW, totalH);

    const minSide = Math.min(totalW, totalH);
    const outerPad = Math.round(minSide * (col.outerBorderPercent / 100));
    const innerGap = Math.round(minSide * (col.innerGapPercent / 100));
    const usableW = Math.max(10, totalW - outerPad * 2);
    const usableH = Math.max(10, totalH - outerPad * 2);

    const layout = getActiveCollageLayout();
    const eps = 0.01;
    const boxes = [];
    const swap = col.swapDrag;

    layout.cells.forEach((cell, idx) => {
      const slot = col.slots[idx] || { photoIndex: 0, panX: 0, panY: 0, zoom: 1 };
      const photoObj = state.photos[slot.photoIndex % state.photos.length] || state.photos[0];

      const lIn = cell.x > eps ? innerGap / 2 : 0;
      const rIn = (cell.x + cell.w) < (1 - eps) ? innerGap / 2 : 0;
      const tIn = cell.y > eps ? innerGap / 2 : 0;
      const bIn = (cell.y + cell.h) < (1 - eps) ? innerGap / 2 : 0;

      const bx = Math.round(outerPad + cell.x * usableW + lIn);
      const by = Math.round(outerPad + cell.y * usableH + tIn);
      const bw = Math.max(2, Math.round(cell.w * usableW - lIn - rIn));
      const bh = Math.max(2, Math.round(cell.h * usableH - tIn - bIn));

      boxes.push({ idx, x: bx, y: by, w: bw, h: bh, slot, photoObj });

      ctx.save();
      if (isPreview && swap.active && swap.fromIdx === idx) ctx.globalAlpha = 0.35;
      drawPhotoInCell(ctx, photoObj, slot, bx, by, bw, bh, isPreview);
      ctx.restore();

      if (isPreview) {
        const isTarget = swap.active && swap.overIdx === idx && swap.overIdx !== swap.fromIdx;
        const isSel = idx === col.activeCellIdx;

        if (isTarget) {
          ctx.save();
          const sw = Math.max(4, Math.round(minSide * 0.008));
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = sw;
          ctx.setLineDash([10, 6]);
          ctx.strokeRect(bx + sw / 2, by + sw / 2, bw - sw, bh - sw);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.fillRect(bx, by, bw, bh);
          ctx.restore();
        } else if (isSel) {
          ctx.save();
          const sw = Math.max(3, Math.round(minSide * 0.006));
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = sw;
          ctx.strokeRect(bx + sw / 2, by + sw / 2, bw - sw, bh - sw);

          const badge = Math.max(20, Math.round(minSide * 0.036));
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(bx, by, badge, badge);
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(badge * 0.6)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(idx + 1), bx + badge / 2, by + badge / 2);
          ctx.restore();
        }
      }
    });

    if (isPreview && swap.active && boxes[swap.fromIdx]) {
      const srcBox = boxes[swap.fromIdx];
      const fw = Math.round(srcBox.w * 0.82);
      const fh = Math.round(srcBox.h * 0.82);
      const fx = Math.round(swap.pointerX - fw / 2);
      const fy = Math.round(swap.pointerY - fh / 2);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#000';
      ctx.fillRect(fx, fy, fw, fh);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.92;
      drawPhotoInCell(ctx, srcBox.photoObj, srcBox.slot, fx, fy, fw, fh, true);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.strokeRect(fx, fy, fw, fh);
      ctx.restore();
    }

    if (isPreview) col.lastRenderedBoxes = boxes;
    ctx.restore();
    return { totalW: full.w, totalH: full.h, ratioStr };
  }

  // --- Mode 4: CALENDAR Renderer (24MP Output + Tc Logo) ---
  function generateCalendarGrid(date) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const targetDay = date.getDate();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevDays = new Date(y, m, 0).getDate();
    const cells = [];
    for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false, target: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true, target: d === targetDay });
    let nextD = 1;
    while (cells.length % 7 !== 0) cells.push({ day: nextD++, cur: false, target: false });
    return cells;
  }

  function drawCalCroppedPhoto(ctx, src, dest, targetAspect, oxPct, oyPct) {
    const sw0 = src.width;
    const sh0 = src.height;
    const imgAspect = sw0 / sh0;
    const sw = imgAspect > targetAspect ? sh0 * targetAspect : sw0;
    const sh = imgAspect > targetAspect ? sh0 : sw0 / targetAspect;
    const maxOx = (sw0 - sw) / 2;
    const maxOy = (sh0 - sh) / 2;
    const sx = maxOx + (oxPct / 100) * maxOx;
    const sy = maxOy + (oyPct / 100) * maxOy;
    ctx.drawImage(src, sx, sy, sw, sh, dest.x, dest.y, dest.w, dest.h);
  }

  function renderCalendar(targetCanvas, photoObj, isPreview = true) {
    const c = state.cal;
    const src = (isPreview && photoObj.proxy) ? photoObj.proxy : photoObj.img;
    const aspect = parseAspectRatio(c.canvasRatio, photoObj.width, photoObj.height);
    const full = calcDimensionsForMP(24, aspect);

    let canvasW, canvasH;
    if (isPreview) {
      const longSide = 1200;
      canvasW = aspect >= 1 ? longSide : Math.round(longSide * aspect);
      canvasH = aspect >= 1 ? Math.round(longSide / aspect) : longSide;
    } else {
      canvasW = full.w;
      canvasH = full.h;
    }

    if (targetCanvas.width !== canvasW) targetCanvas.width = canvasW;
    if (targetCanvas.height !== canvasH) targetCanvas.height = canvasH;

    const ctx = targetCanvas.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isPreview ? 'medium' : 'high';

    const shortSide = Math.min(canvasW, canvasH);
    let photoRect = { x: 0, y: 0, w: canvasW, h: canvasH };

    if (c.frameMode === 'none') {
      drawCalCroppedPhoto(ctx, src, photoRect, canvasW / canvasH, c.cropOffsetX, c.cropOffsetY);
    } else {
      if (c.frameMode === 'solid') {
        ctx.fillStyle = c.frameColor;
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else if (c.frameMode === 'blur') {
        const blurScale = Math.max(canvasW, canvasH) / 1600;
        ctx.save();
        ctx.filter = `blur(${c.blurAmount * blurScale}px) brightness(${c.blurBrightness}%)`;
        const ex = 0.12;
        drawCalCroppedPhoto(ctx, src, {
          x: -canvasW * ex, y: -canvasH * ex,
          w: canvasW * (1 + ex * 2), h: canvasH * (1 + ex * 2)
        }, canvasW / canvasH, c.cropOffsetX, c.cropOffsetY);
        ctx.restore();
      }

      const pad = shortSide * (c.frameThickness / 100);
      const availW = Math.max(10, canvasW - pad * 2);
      const availH = Math.max(10, canvasH - pad * 2);
      const pAspect = parseAspectRatio(c.photoRatio, photoObj.width, photoObj.height);

      let pw = availW;
      let ph = pw / pAspect;
      if (ph > availH) { ph = availH; pw = ph * pAspect; }
      photoRect = { x: (canvasW - pw) / 2, y: (canvasH - ph) / 2, w: pw, h: ph };

      if (c.photoShadow && c.frameThickness > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.38)';
        ctx.shadowBlur = shortSide * 0.022;
        ctx.shadowOffsetY = shortSide * 0.006;
        ctx.fillStyle = '#000';
        ctx.fillRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);
        ctx.restore();
      }

      drawCalCroppedPhoto(ctx, src, photoRect, pAspect, c.cropOffsetX, c.cropOffsetY);

      if (c.frameMode === 'blur' && c.innerBorder) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = Math.max(2, shortSide * 0.0025);
        ctx.strokeRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);
        ctx.restore();
      }
    }

    const targetRect = (c.stampTarget === 'photo' && c.frameMode !== 'none')
      ? photoRect
      : { x: 0, y: 0, w: canvasW, h: canvasH };

    // Top Logo Section
    if (c.showLogo) {
      const baseUnit = Math.min(targetRect.w, targetRect.h);
      const scale = c.logoScale;
      const centerX = targetRect.x + targetRect.w / 2;
      const topY = targetRect.y + targetRect.h * (c.logoMarginY / 100);
      const tcH = Math.max(16, Math.round(baseUnit * 0.045 * scale));
      const srcLogo = c.logoCanvas;

      ctx.save();
      if (srcLogo && srcLogo.width > 0 && srcLogo.height > 0) {
        const tcW = Math.round(tcH * (srcLogo.width / srcLogo.height));
        const off = document.createElement('canvas');
        off.width = tcW;
        off.height = tcH;
        const octx = off.getContext('2d');
        octx.drawImage(srcLogo, 0, 0, tcW, tcH);
        octx.globalCompositeOperation = 'source-in';
        octx.fillStyle = c.logoColor;
        octx.fillRect(0, 0, tcW, tcH);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(off, centerX - tcW / 2, topY, tcW, tcH);
      }

      const subSize = baseUnit * 0.0135 * scale;
      ctx.font = `${subSize}px "Nova Flat", sans-serif`;
      ctx.fillStyle = c.logoColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('@Tsukaccha', centerX, topY + tcH + baseUnit * 0.004 * scale);

      const lineY = topY + tcH * 0.54;
      const gap = baseUnit * 0.049 * scale;
      const lineLen = targetRect.w * 0.143 * scale;
      ctx.strokeStyle = c.logoColor;
      ctx.lineWidth = Math.max(1.2, baseUnit * 0.0013 * scale);
      ctx.beginPath();
      ctx.moveTo(centerX - gap - lineLen, lineY);
      ctx.lineTo(centerX - gap, lineY);
      ctx.moveTo(centerX + gap, lineY);
      ctx.lineTo(centerX + gap + lineLen, lineY);
      ctx.stroke();
      ctx.restore();
    }

    // Calendar Overlay
    {
      const date = photoObj.selectedDate || new Date();
      const baseUnit = Math.min(targetRect.w, targetRect.h);
      const scale = c.calScale;
      const calW = baseUnit * 0.372 * scale;
      const colStep = calW / 6;
      const gridData = generateCalendarGrid(date);
      const rows = gridData.length / 7;

      const monthSize = calW * 0.142;
      const timeSize = calW * 0.062;
      const stripeTopGap = calW * 0.055;
      const stripeH = calW * 0.033;
      const gridTopGap = calW * 0.095;
      const rowStep = calW * 0.122;
      const dateSize = calW * 0.052;

      const totalCalH = monthSize + stripeTopGap + stripeH + gridTopGap + (rows - 1) * rowStep + dateSize;
      const mx = targetRect.w * (c.calMarginX / 100);
      const my = targetRect.h * (c.calMarginY / 100);

      const startX = c.calPos === 'bottom-left' ? targetRect.x + mx : targetRect.x + targetRect.w - mx - calW;
      const startY = targetRect.y + targetRect.h - my - totalCalH;
      const headerY = startY + monthSize * 0.85;
      const colHalf = dateSize * 0.62;
      const leftX = startX - colHalf;
      const rightX = startX + calW + colHalf;

      ctx.save();
      ctx.fillStyle = c.textColor;
      ctx.font = `${monthSize}px "Nova Flat", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(MONTH_NAMES[date.getMonth()], leftX, headerY);

      if (c.showTime) {
        const h24 = date.getHours();
        const ampm = h24 >= 12 ? 'PM' : 'AM';
        const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
        ctx.font = `${timeSize}px "Nova Flat", sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(`${ampm} ${h12}:${pad2(date.getMinutes())}`, rightX, headerY);
      }

      // Slanted Stripes
      const stripeY = headerY + stripeTopGap;
      const totalW = rightX - leftX;
      const count = 18;
      const slant = stripeH * 0.58;
      const stepX = (totalW - slant) / count;
      const barW = stepX * 0.50;
      ctx.fillStyle = c.textColor;
      for (let i = 0; i < count; i++) {
        const bx = leftX + i * stepX;
        ctx.beginPath();
        ctx.moveTo(bx + slant, stripeY);
        ctx.lineTo(bx + slant + barW, stripeY);
        ctx.lineTo(bx + barW, stripeY + stripeH);
        ctx.lineTo(bx, stripeY + stripeH);
        ctx.closePath();
        ctx.fill();
      }

      // Days Grid
      const firstRowY = stripeY + stripeH + gridTopGap;
      ctx.font = `${dateSize}px "Nova Flat", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const digitOff = dateSize * 0.33;

      gridData.forEach((cell, idx) => {
        const colIdx = idx % 7;
        const rowIdx = Math.floor(idx / 7);
        const cx = startX + colIdx * colStep;
        const cy = firstRowY + rowIdx * rowStep;

        let color = c.textColor;
        if (c.weekendMode === 'color') {
          if (colIdx === 0) color = c.sunColor;
          else if (colIdx === 6) color = c.satColor;
        }

        ctx.save();
        ctx.fillStyle = color;
        if (!cell.cur) ctx.globalAlpha = 0.38;
        const numStr = pad2(cell.day);
        ctx.fillText(numStr[0], cx - digitOff, cy);
        ctx.fillText(numStr[1], cx + digitOff, cy);
        ctx.restore();

        if (cell.target) {
          ctx.save();
          ctx.strokeStyle = c.ringColor;
          ctx.lineWidth = Math.max(2, calW * 0.0085);
          ctx.beginPath();
          ctx.arc(cx, cy - dateSize * 0.03, dateSize * 0.88, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });
      ctx.restore();
    }

    ctx.restore();
    return { totalW: full.w, totalH: full.h };
  }

  // --- Mode 5: RISO Renderer (Optimized Math + Fast Integer Hash + Chunked 24MP) ---
  function fastHash01(x, y) {
    let n = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function getCurrentRisoConfig() {
    const r = state.riso;
    return {
      inks: [...r.inks],
      paperId: RISO_PAPERS[r.paperIndex].id,
      styleMode: RISO_STYLES[r.styleIndex],
      dotSize: r.dotSize,
      texture: r.texture,
      contrast: r.contrast,
      brightness: r.brightness,
      shift: r.shift,
      margin: r.margin,
      radius: r.radius
    };
  }

  function processRisoRows(
    startY, endY, w, padX, padY, innerW, innerH, cornerRad,
    scaleFactor, freq, styleMode, contrast, brightOff, textureAmt,
    shiftPx, paper, inkObjs, srcData, out
  ) {
    const invScale = 1 / scaleFactor;
    const inkCount = inkObjs.length;
    const angles = [0.26, 1.30, 0.78];
    const cosA = angles.map(a => Math.cos(a));
    const sinA = angles.map(a => Math.sin(a));
    const shiftXArr = [0, shiftPx, -shiftPx * 0.7];
    const shiftYArr = [0, shiftPx * 0.6, shiftPx];
    const radSq = cornerRad * cornerRad;
    const rwMinusRad = innerW - cornerRad;
    const rhMinusRad = innerH - cornerRad;
    const isRosette = styleMode === 'ROSETTE';
    const isHalftone = styleMode === 'HALFTONE';
    const isGrain = styleMode === 'GRAIN';
    const freqHatch = freq * 1.25;

    for (let y = startY; y < endY; y++) {
      const refY = (y * invScale) | 0;
      const cosYWeave = Math.cos(y * 1.4 * invScale);
      const rowOutBase = y * w * 4;

      for (let x = 0; x < w; x++) {
        const outIdx = rowOutBase + (x << 2);
        const refX = (x * invScale) | 0;

        const weave = (Math.sin(x * 1.4 * invScale) + cosYWeave) * 0.5;
        const fineGrain = (fastHash01(refX, refY) - 0.5) * 2;
        const fiberDelta = (weave * 7 + fineGrain * 18) * textureAmt;

        let pr = paper.r + fiberDelta;
        let pg = paper.g + fiberDelta;
        let pb = paper.b + fiberDelta;

        if (paper.darkFiber && fineGrain > 0.65) {
          const dk = 18 * textureAmt;
          pr -= dk; pg -= dk; pb -= dk;
        }

        for (let k = 0; k < inkCount; k++) {
          const sx = Math.round(x - padX - shiftXArr[k]);
          const sy = Math.round(y - padY - shiftYArr[k]);

          if (sx < 0 || sy < 0 || sx >= innerW || sy >= innerH) continue;
          if (cornerRad > 0) {
            if (sx < cornerRad && sy < cornerRad && (sx - cornerRad) ** 2 + (sy - cornerRad) ** 2 > radSq) continue;
            if (sx > rwMinusRad && sy < cornerRad && (sx - rwMinusRad) ** 2 + (sy - cornerRad) ** 2 > radSq) continue;
            if (sx < cornerRad && sy > rhMinusRad && (sx - cornerRad) ** 2 + (sy - rhMinusRad) ** 2 > radSq) continue;
            if (sx > rwMinusRad && sy > rhMinusRad && (sx - rwMinusRad) ** 2 + (sy - rhMinusRad) ** 2 > radSq) continue;
          }

          const pIdx = (sy * innerW + sx) << 2;
          let r = srcData[pIdx] * 0.0039215686 + brightOff;
          let g = srcData[pIdx + 1] * 0.0039215686 + brightOff;
          let b = srcData[pIdx + 2] * 0.0039215686 + brightOff;
          if (r < 0) r = 0; else if (r > 1) r = 1;
          if (g < 0) g = 0; else if (g > 1) g = 1;
          if (b < 0) b = 0; else if (b > 1) b = 1;

          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          let cLuma = (luma - 0.5) * contrast + 0.5;
          if (cLuma < 0) cLuma = 0; else if (cLuma > 1) cLuma = 1;

          let density = 0;
          if (inkCount === 1) {
            density = 1 - cLuma;
          } else if (inkCount === 2) {
            if (k === 0) {
              const warm = r - b * 0.65;
              density = Math.min(1, (warm > 0 ? warm : 0) * 1.35 + (1 - cLuma) * 0.45);
            } else {
              density = Math.pow(1 - cLuma, 1.15);
            }
          } else {
            if (k === 0) {
              const v = (r + g * 0.5 - b) * 0.9;
              density = v < 0 ? 0 : (v > 1 ? 1 : v);
            } else if (k === 1) {
              const v = (r - g * 0.35) * 1.25 + (1 - cLuma) * 0.25;
              density = v < 0 ? 0 : (v > 1 ? 1 : v);
            } else {
              density = Math.pow(1 - cLuma, 1.25);
            }
          }

          const ca = cosA[k], sa = sinA[k];
          const rx = x * ca - y * sa;
          const ry = x * sa + y * ca;

          let threshold;
          if (isRosette) {
            threshold = ((Math.sin(rx * freq) + Math.cos(ry * freq)) * 0.25 + 0.5) * 0.82 + fineGrain * 0.09;
          } else if (isHalftone) {
            threshold = (Math.sin(rx * freq) * Math.sin(ry * freq)) * 0.45 + 0.5;
          } else if (isGrain) {
            threshold = fastHash01(refX + k * 71, refY + k * 43) * 0.88 + 0.06;
          } else {
            threshold = (Math.sin(rx * freqHatch) * 0.45 + 0.5) * 0.85 + fineGrain * 0.08;
          }

          const inkAlpha = (density - threshold + 0.14) * 3.6;
          if (inkAlpha > 0.01) {
            const clampedAlpha = inkAlpha > 1 ? 1 : inkAlpha;
            const strength = 0.86 * clampedAlpha;
            const invStr = 1 - strength;
            const ink = inkObjs[k];
            const targetR = (pr * ink.r) * 0.0021568627 + ink.r * 0.45;
            const targetG = (pg * ink.g) * 0.0021568627 + ink.g * 0.45;
            const targetB = (pb * ink.b) * 0.0021568627 + ink.b * 0.45;
            pr = pr * invStr + targetR * strength;
            pg = pg * invStr + targetG * strength;
            pb = pb * invStr + targetB * strength;
          }
        }

        out[outIdx]     = pr < 0 ? 0 : (pr > 255 ? 255 : pr);
        out[outIdx + 1] = pg < 0 ? 0 : (pg > 255 ? 255 : pg);
        out[outIdx + 2] = pb < 0 ? 0 : (pb > 255 ? 255 : pb);
        out[outIdx + 3] = 255;
      }
    }
  }

  function renderRisoSync(targetCanvas, photoObj, config, workWidth = RISO_PREVIEW_WIDTH) {
    const src = photoObj.proxy || photoObj.img;
    const aspect = photoObj.height / Math.max(1, photoObj.width);
    const w = workWidth;
    const h = Math.max(10, Math.round(w * aspect));

    targetCanvas.width = w;
    targetCanvas.height = h;
    const ctx = targetCanvas.getContext('2d');

    const paper = RISO_PAPERS.find(p => p.id === config.paperId) || RISO_PAPERS[0];
    const scaleFactor = w / 840;
    const dotSize = (config.dotSize || 5.5) * scaleFactor;
    const contrast = (config.contrast || 115) / 100;
    const brightOff = (config.brightness || 0) / 100;
    const textureAmt = (config.texture ?? 48) / 100;
    const marginRatio = (config.margin || 0) / 100;
    const shiftPx = (config.shift ?? 4) * scaleFactor;

    ctx.fillStyle = paper.hex;
    ctx.fillRect(0, 0, w, h);

    const padX = Math.round(w * marginRatio);
    const padY = Math.round(h * marginRatio);
    const innerW = Math.max(10, w - padX * 2);
    const innerH = Math.max(10, h - padY * 2);

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = innerW;
    srcCanvas.height = innerH;
    const sctx = srcCanvas.getContext('2d');
    sctx.drawImage(src, 0, 0, innerW, innerH);
    const srcData = sctx.getImageData(0, 0, innerW, innerH).data;

    const outImgData = ctx.getImageData(0, 0, w, h);
    const inkObjs = config.inks.map(id => RISO_INKS.find(i => i.id === id) || RISO_INKS[0]);
    const freq = (Math.PI * 2) / Math.max(2, dotSize);
    const cornerRad = marginRatio > 0 ? Math.round((config.radius ?? 18) * scaleFactor) : 0;

    processRisoRows(
      0, h, w, padX, padY, innerW, innerH, cornerRad,
      scaleFactor, freq, config.styleMode || 'ROSETTE', contrast, brightOff, textureAmt,
      shiftPx, paper, inkObjs, srcData, outImgData.data
    );
    ctx.putImageData(outImgData, 0, 0);

    const dims = calcDimensionsForMP(state.riso.exportMP, photoObj.width / Math.max(1, photoObj.height));
    return { totalW: dims.w, totalH: dims.h };
  }

  function renderRisoChunkedAsync(photoObj, config, mp, format, onProgress) {
    return new Promise((resolve) => {
      const aspect = photoObj.width / Math.max(1, photoObj.height);
      const { w, h } = calcDimensionsForMP(mp, aspect);

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = w;
      exportCanvas.height = h;
      const ctx = exportCanvas.getContext('2d');

      const paper = RISO_PAPERS.find(p => p.id === config.paperId) || RISO_PAPERS[0];
      const scaleFactor = w / 840;
      const dotSize = (config.dotSize || 5.5) * scaleFactor;
      const contrast = (config.contrast || 115) / 100;
      const brightOff = (config.brightness || 0) / 100;
      const textureAmt = (config.texture ?? 48) / 100;
      const marginRatio = (config.margin || 0) / 100;
      const shiftPx = (config.shift ?? 4) * scaleFactor;

      ctx.fillStyle = paper.hex;
      ctx.fillRect(0, 0, w, h);

      const padX = Math.round(w * marginRatio);
      const padY = Math.round(h * marginRatio);
      const innerW = Math.max(10, w - padX * 2);
      const innerH = Math.max(10, h - padY * 2);

      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = innerW;
      srcCanvas.height = innerH;
      const sctx = srcCanvas.getContext('2d');
      sctx.drawImage(photoObj.img, 0, 0, innerW, innerH);
      const srcData = sctx.getImageData(0, 0, innerW, innerH).data;

      const outImgData = ctx.getImageData(0, 0, w, h);
      const inkObjs = config.inks.map(id => RISO_INKS.find(i => i.id === id) || RISO_INKS[0]);
      const freq = (Math.PI * 2) / Math.max(2, dotSize);
      const cornerRad = marginRatio > 0 ? Math.round((config.radius ?? 18) * scaleFactor) : 0;

      let curY = 0;
      const chunkRows = Math.max(48, Math.floor(600000 / w));

      function step() {
        const endY = Math.min(h, curY + chunkRows);
        processRisoRows(
          curY, endY, w, padX, padY, innerW, innerH, cornerRad,
          scaleFactor, freq, config.styleMode || 'ROSETTE', contrast, brightOff, textureAmt,
          shiftPx, paper, inkObjs, srcData, outImgData.data
        );
        curY = endY;
        if (onProgress) onProgress(curY / h);

        if (curY < h) {
          requestAnimationFrame(step);
        } else {
          ctx.putImageData(outImgData, 0, 0);
          const mime = format === 'png' ? 'image/png' : 'image/jpeg';
          const ext = format === 'png' ? 'png' : 'jpg';
          const quality = format === 'png' ? undefined : 0.95;
          exportCanvas.toBlob((blob) => {
            resolve({ blob, filename: `${photoObj.name}_riso_${mp}MP_${w}x${h}.${ext}`, mime });
          }, mime, quality);
        }
      }
      requestAnimationFrame(step);
    });
  }

  // =========================================================================
  // 6. Preview Dispatcher & UI Synchronization
  // =========================================================================
  let rafId = null;
  let pendingOverlay = false;

  function schedulePreviewRender(showOverlay = false) {
    pendingOverlay = pendingOverlay || showOverlay;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const ov = pendingOverlay;
      pendingOverlay = false;
      renderPreviewNow(ov);
    });
  }

  function renderPreviewNow(showOverlay = false) {
    const photo = getCurrentPhoto();
    if (!photo) return;

    const maxDim = Math.max(
      dom.stageCanvasArea.clientWidth - 32,
      dom.stageCanvasArea.clientHeight - 32,
      900
    );

    if (state.mode === 'frame') {
      const info = renderFrame(dom.previewCanvas, photo, maxDim, showOverlay);
      const f = state.frame;
      const ratioTag = (f.canvasRatio !== 'original' || f.photoRatio !== 'original')
        ? ` (枠:${f.canvasRatio === 'original' ? '元' : f.canvasRatio} / 写真:${f.photoRatio === 'original' ? '元' : f.photoRatio})`
        : '';
      dom.infoResolution.textContent = `出力: ${info.totalW} × ${info.totalH}px${ratioTag}`;
      dom.infoIndex.textContent = `${state.currentIndex + 1} / ${state.photos.length}枚`;
    } else if (state.mode === 'crop') {
      const info = renderCrop(dom.previewCanvas, photo, maxDim, showOverlay);
      dom.infoResolution.textContent = `クロップ: ${info.totalW} × ${info.totalH}px (${info.ratioStr})`;
      dom.infoIndex.textContent = `${state.currentIndex + 1} / ${state.photos.length}枚`;
    } else if (state.mode === 'collage') {
      const info = renderCollage(dom.previewCanvas, true);
      dom.infoResolution.textContent = `コラージュ: ${info.totalW} × ${info.totalH}px (${info.ratioStr} / 24MP)`;
      dom.infoIndex.textContent = `枠 ${state.collage.activeCellIdx + 1} / ${state.collage.divisions}`;
    } else if (state.mode === 'calendar') {
      const info = renderCalendar(dom.previewCanvas, photo, true);
      dom.infoResolution.textContent = `カレンダー: ${info.totalW} × ${info.totalH}px (24MP)`;
      dom.infoIndex.textContent = `${state.currentIndex + 1} / ${state.photos.length}枚`;
    } else if (state.mode === 'riso') {
      const info = renderRisoSync(dom.previewCanvas, photo, getCurrentRisoConfig(), RISO_PREVIEW_WIDTH);
      dom.infoResolution.textContent = `リソ出力: ${info.totalW} × ${info.totalH}px (${state.riso.exportMP}MP)`;
      dom.infoIndex.textContent = `${state.currentIndex + 1} / ${state.photos.length}枚`;
    }
  }

  function updateExportButtonLabel() {
    const n = state.photos.length;
    dom.exportBtn.disabled = n === 0;
    if (!n) {
      dom.exportBtnText.textContent = '書き出し';
      return;
    }
    if (state.mode === 'collage') {
      dom.exportBtnText.textContent = '24MP保存';
    } else if (state.mode === 'riso') {
      dom.exportBtnText.textContent = `${state.riso.exportMP}MP保存`;
    } else if (state.mode === 'calendar') {
      dom.exportBtnText.textContent = n > 1 ? `一括24MP (${n}枚)` : '24MP保存';
    } else {
      dom.exportBtnText.textContent = n > 1 ? `一括保存 (${n}枚)` : '保存する';
    }
  }

  function updateDragHint() {
    const hasPhotos = state.photos.length > 0;
    const frameCanDrag = state.mode === 'frame' && state.frame.photoRatio !== 'original';
    const isInteractive = state.mode === 'crop' || state.mode === 'collage' || frameCanDrag;
    dom.previewCanvas.classList.toggle('interactive-canvas', isInteractive && hasPhotos);
    dom.dragHintBadge.hidden = !(isInteractive && hasPhotos);
    if (state.mode === 'crop') {
      dom.dragHintText.textContent = 'ドラッグで切り抜き位置を調整';
    } else if (state.mode === 'collage') {
      dom.dragHintText.textContent = 'ドラッグで位置移動 / 長押しで枠を入替';
    } else if (frameCanDrag) {
      dom.dragHintText.textContent = 'ドラッグで中の写真位置を調整';
    }
  }

  function syncPhotoContextUI() {
    const photo = getCurrentPhoto();
    if (!photo) {
      dom.exifStrip.textContent = '';
      return;
    }

    // Calendar date input & Exif status
    const d = photo.selectedDate;
    $('cal-dateInput').value = formatDateForInput(d);
    $('cal-exifSource').textContent = photo.exifSource;
    dom.exifStrip.textContent = `${photo.exifSource}: ${d.getFullYear()}/${pad2(d.getMonth() + 1)}/${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

    // Crop sliders
    $('crop-zoom').value = photo.crop.zoom;
    $('crop-zoomVal').textContent = `${photo.crop.zoom.toFixed(2)}x`;
    $('crop-panX').value = Math.round(photo.crop.panX * 100);
    $('crop-panXVal').textContent = `${Math.round(photo.crop.panX * 100)}%`;
    $('crop-panY').value = Math.round(photo.crop.panY * 100);
    $('crop-panYVal').textContent = `${Math.round(photo.crop.panY * 100)}%`;

    // Frame inner crop offset sliders
    const fc = photo.frameCrop || (photo.frameCrop = { offsetX: 0, offsetY: 0 });
    $('frame-offsetX').value = Math.round(fc.offsetX);
    $('frame-offsetXVal').textContent = `${Math.round(fc.offsetX)}%`;
    $('frame-offsetY').value = Math.round(fc.offsetY);
    $('frame-offsetYVal').textContent = `${Math.round(fc.offsetY)}%`;

    // Frame extracted palette
    renderFramePalette();
  }

  function renderFilmstrip() {
    dom.filmstripList.innerHTML = '';
    state.photos.forEach((photo, idx) => {
      const isCurrent = state.mode === 'collage'
        ? (state.collage.slots[state.collage.activeCellIdx]?.photoIndex === idx)
        : (idx === state.currentIndex);

      const item = document.createElement('div');
      item.className = 'thumb-item' + (isCurrent ? ' active' : '');

      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.name;
      item.appendChild(img);

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'thumb-del';
      del.textContent = '×';
      del.title = '削除';
      del.addEventListener('click', (e) => {
        e.stopPropagation();
        removePhotoAt(idx);
      });
      item.appendChild(del);

      item.addEventListener('click', () => {
        if (state.mode === 'collage') {
          const slot = state.collage.slots[state.collage.activeCellIdx];
          if (slot) {
            slot.photoIndex = idx;
            slot.panX = 0;
            slot.panY = 0;
          }
        } else {
          state.currentIndex = idx;
          syncPhotoContextUI();
        }
        renderFilmstrip();
        schedulePreviewRender();
      });

      dom.filmstripList.appendChild(item);
    });
  }

  function removePhotoAt(idx) {
    const [removed] = state.photos.splice(idx, 1);
    if (removed && removed.url) URL.revokeObjectURL(removed.url);

    if (state.photos.length === 0) {
      resetToEmpty();
      return;
    }
    if (state.currentIndex >= state.photos.length) {
      state.currentIndex = state.photos.length - 1;
    }
    state.collage.slots.forEach(s => {
      if (s.photoIndex >= state.photos.length) s.photoIndex = 0;
    });
    updateExportButtonLabel();
    renderFilmstrip();
    syncPhotoContextUI();
    schedulePreviewRender();
  }

  function resetToEmpty() {
    state.photos.forEach(p => { if (p.url) URL.revokeObjectURL(p.url); });
    state.photos = [];
    state.currentIndex = 0;
    dom.emptyState.hidden = false;
    dom.filmstripBar.hidden = true;
    dom.infoBadge.hidden = true;
    dom.stageOverlayActions.hidden = true;
    dom.dragHintBadge.hidden = true;
    dom.exifStrip.textContent = '';
    const ctx = dom.previewCanvas.getContext('2d');
    ctx.clearRect(0, 0, dom.previewCanvas.width, dom.previewCanvas.height);
    updateExportButtonLabel();
  }

  async function ingestFiles(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;

    const wasEmpty = state.photos.length === 0;
    for (const file of files) {
      try {
        const url = URL.createObjectURL(file);
        const img = await new Promise((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve(im);
          im.onerror = reject;
          im.src = url;
        });
        const [exifRes] = await Promise.all([extractPhotoDate(file)]);
        const proxy = createPreviewProxy(img);
        const palette = extractFiveColors(proxy);
        state.photos.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          file,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url,
          img,
          proxy,
          width: img.naturalWidth,
          height: img.naturalHeight,
          palette,
          exifDate: new Date(exifRes.date),
          exifSource: exifRes.source,
          selectedDate: new Date(exifRes.date),
          crop: { panX: 0, panY: 0, zoom: 1 },
          frameCrop: { offsetX: 0, offsetY: 0 }
        });
      } catch (err) {
        console.error('Image load error:', err);
      }
    }

    if (state.photos.length > 0) {
      if (wasEmpty) {
        for (let i = 0; i < 4; i++) {
          state.collage.slots[i] = { photoIndex: i % state.photos.length, panX: 0, panY: 0, zoom: 1 };
        }
      }
      dom.emptyState.hidden = true;
      dom.filmstripBar.hidden = false;
      dom.infoBadge.hidden = false;
      dom.stageOverlayActions.hidden = false;
      updateExportButtonLabel();
      updateDragHint();
      renderFilmstrip();
      syncPhotoContextUI();
      syncCollageZoomUI();
      schedulePreviewRender();
      showToast(`${files.length}枚の写真を読み込みました`);
    }
  }

  function loadBuiltInSample() {
    const c = document.createElement('canvas');
    c.width = 1500;
    c.height = 1000;
    const g = c.getContext('2d');

    const sky = g.createLinearGradient(0, 0, 0, 1000);
    sky.addColorStop(0, '#1e3a5f');
    sky.addColorStop(0.55, '#c97b53');
    sky.addColorStop(0.85, '#e8b982');
    sky.addColorStop(1, '#362d28');
    g.fillStyle = sky;
    g.fillRect(0, 0, 1500, 1000);

    const sun = g.createRadialGradient(780, 460, 20, 780, 460, 320);
    sun.addColorStop(0, 'rgba(255, 240, 200, 0.95)');
    sun.addColorStop(0.35, 'rgba(255, 165, 95, 0.55)');
    sun.addColorStop(1, 'rgba(255, 120, 60, 0)');
    g.fillStyle = sun;
    g.fillRect(0, 0, 1500, 1000);

    g.fillStyle = '#232732';
    g.beginPath();
    g.moveTo(0, 720);
    g.quadraticCurveTo(380, 560, 740, 660);
    g.quadraticCurveTo(1120, 520, 1500, 690);
    g.lineTo(1500, 1000);
    g.lineTo(0, 1000);
    g.closePath();
    g.fill();

    g.fillStyle = '#151821';
    g.beginPath();
    g.moveTo(0, 820);
    g.quadraticCurveTo(520, 700, 1040, 800);
    g.quadraticCurveTo(1280, 760, 1500, 810);
    g.lineTo(1500, 1000);
    g.lineTo(0, 1000);
    g.closePath();
    g.fill();

    c.toBlob((blob) => {
      if (!blob) return;
      const sampleFile = new File([blob], 'sample_landscape.jpg', { type: 'image/jpeg', lastModified: Date.now() });
      ingestFiles([sampleFile]);
    }, 'image/jpeg', 0.92);
  }

  // =========================================================================
  // 7. Mode Switching & Panel Bindings
  // =========================================================================
  function switchMode(newMode) {
    state.mode = newMode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === newMode);
    });
    ['frame', 'crop', 'collage', 'calendar', 'riso'].forEach(m => {
      $(`panel-${m}`).hidden = m !== newMode;
    });
    updateExportButtonLabel();
    updateDragHint();
    renderFilmstrip();
    syncPhotoContextUI();
    schedulePreviewRender();
  }

  function initSubTabs() {
    document.querySelectorAll('.sub-tabs').forEach(bar => {
      const btns = bar.querySelectorAll('.sub-tab-btn');
      const panel = bar.closest('.mode-panel');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.subtab;
          btns.forEach(b => b.classList.toggle('active', b === btn));
          panel.querySelectorAll('.subtab-content').forEach(sec => {
            sec.hidden = sec.id !== targetId;
          });
          if (targetId === 'frame-blur') {
            state.frame.fillMode = 'blur';
            schedulePreviewRender();
          }
        });
      });
    });
  }

  // --- Frame Controls ---
  function renderFramePalette() {
    const box = $('frame-palette');
    const photo = getCurrentPhoto();
    if (!photo) return;
    box.innerHTML = '';
    photo.palette.forEach((hex, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const active = state.frame.fillMode === 'extracted' && state.frame.extractedIndex === idx;
      btn.className = 'extracted-swatch' + (active ? ' active' : '');
      btn.style.backgroundColor = hex;
      btn.innerHTML = `<span>${hex}</span>`;
      btn.addEventListener('click', () => {
        state.frame.fillMode = 'extracted';
        state.frame.extractedIndex = idx;
        updateFrameColorUI();
        renderFramePalette();
        schedulePreviewRender();
      });
      box.appendChild(btn);
    });
  }

  function updateFrameColorUI() {
    document.querySelectorAll('[data-frame-color]').forEach(btn => {
      const active = state.frame.fillMode === 'solid' &&
        btn.dataset.frameColor.toUpperCase() === state.frame.solidColor.toUpperCase();
      btn.classList.toggle('active', active);
    });
  }

  function initFrameControls() {
    $('frame-width').addEventListener('input', (e) => {
      state.frame.borderPercent = parseFloat(e.target.value);
      $('frame-widthVal').textContent = `${state.frame.borderPercent}%`;
      schedulePreviewRender();
    });

    document.querySelectorAll('[data-frame-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.frame.fillMode = 'solid';
        state.frame.solidColor = btn.dataset.frameColor;
        updateFrameColorUI();
        renderFramePalette();
        schedulePreviewRender();
      });
    });

    $('frame-customColor').addEventListener('input', (e) => {
      state.frame.fillMode = 'solid';
      state.frame.solidColor = e.target.value;
      updateFrameColorUI();
      renderFramePalette();
      schedulePreviewRender();
    });

    $('frame-autoPerPhoto').addEventListener('change', (e) => {
      state.frame.autoPerPhoto = e.target.checked;
      schedulePreviewRender();
    });

    $('frame-blurAmt').addEventListener('input', (e) => {
      state.frame.fillMode = 'blur';
      state.frame.blurAmount = parseInt(e.target.value, 10);
      $('frame-blurAmtVal').textContent = `${state.frame.blurAmount}px`;
      schedulePreviewRender();
    });

    $('frame-blurBright').addEventListener('input', (e) => {
      state.frame.fillMode = 'blur';
      state.frame.blurBrightness = parseInt(e.target.value, 10);
      $('frame-blurBrightVal').textContent = `${state.frame.blurBrightness}%`;
      schedulePreviewRender();
    });

    const updateFrameRatioVisibility = () => {
      $('frame-ruleCard').hidden = state.frame.canvasRatio !== 'original';
      $('frame-offsetBox').hidden = state.frame.photoRatio === 'original';
      updateDragHint();
    };

    const bindFrameRatios = (containerId, setter) => {
      const btns = $(containerId).querySelectorAll('[data-ratio]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.toggle('active', b === btn));
          setter(btn.dataset.ratio);
          updateFrameRatioVisibility();
          schedulePreviewRender();
        });
      });
    };
    bindFrameRatios('frame-canvasRatios', (r) => { state.frame.canvasRatio = r; });
    bindFrameRatios('frame-photoRatios', (r) => { state.frame.photoRatio = r; });

    $('frame-offsetX').addEventListener('input', (e) => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.frameCrop.offsetX = parseInt(e.target.value, 10);
      $('frame-offsetXVal').textContent = `${p.frameCrop.offsetX}%`;
      schedulePreviewRender(true);
    });

    $('frame-offsetY').addEventListener('input', (e) => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.frameCrop.offsetY = parseInt(e.target.value, 10);
      $('frame-offsetYVal').textContent = `${p.frameCrop.offsetY}%`;
      schedulePreviewRender(true);
    });

    $('frame-resetCrop').addEventListener('click', () => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.frameCrop = { offsetX: 0, offsetY: 0 };
      syncPhotoContextUI();
      schedulePreviewRender();
    });

    document.querySelectorAll('[data-frame-rule]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.frame.sizingRule = btn.dataset.frameRule;
        document.querySelectorAll('[data-frame-rule]').forEach(b => {
          b.classList.toggle('active', b.dataset.frameRule === state.frame.sizingRule);
        });
        schedulePreviewRender();
      });
    });

    updateFrameRatioVisibility();

    $('frame-radius').addEventListener('input', (e) => {
      state.frame.cornerRadius = parseFloat(e.target.value);
      $('frame-radiusVal').textContent = `${state.frame.cornerRadius}%`;
      schedulePreviewRender();
    });

    $('frame-shadow').addEventListener('input', (e) => {
      state.frame.shadowStrength = parseInt(e.target.value, 10);
      $('frame-shadowVal').textContent = `${state.frame.shadowStrength}%`;
      schedulePreviewRender();
    });
  }

  // --- Crop Controls ---
  function updateCropRatioUI() {
    document.querySelectorAll('[data-crop-base]').forEach(btn => {
      const base = btn.dataset.cropBase;
      const lbl = btn.querySelector('.ratio-text');
      if (lbl) lbl.textContent = resolveRatioStr(base, state.crop.orientation);
      btn.classList.toggle('active', base === state.crop.baseRatio);
    });
    document.querySelectorAll('[data-crop-orient]').forEach(btn => {
      btn.classList.toggle('active-blue', btn.dataset.cropOrient === state.crop.orientation);
    });
  }

  function initCropControls() {
    document.querySelectorAll('[data-crop-orient]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.crop.orientation = btn.dataset.cropOrient;
        updateCropRatioUI();
        schedulePreviewRender(true);
      });
    });

    document.querySelectorAll('[data-crop-base]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.crop.baseRatio = btn.dataset.cropBase;
        updateCropRatioUI();
        schedulePreviewRender(true);
      });
    });

    $('crop-zoom').addEventListener('input', (e) => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.crop.zoom = parseFloat(e.target.value);
      $('crop-zoomVal').textContent = `${p.crop.zoom.toFixed(2)}x`;
      schedulePreviewRender(true);
    });

    $('crop-panX').addEventListener('input', (e) => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.crop.panX = parseInt(e.target.value, 10) / 100;
      $('crop-panXVal').textContent = `${e.target.value}%`;
      schedulePreviewRender(true);
    });

    $('crop-panY').addEventListener('input', (e) => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.crop.panY = parseInt(e.target.value, 10) / 100;
      $('crop-panYVal').textContent = `${e.target.value}%`;
      schedulePreviewRender(true);
    });

    $('crop-resetBtn').addEventListener('click', () => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.crop = { panX: 0, panY: 0, zoom: 1 };
      syncPhotoContextUI();
      schedulePreviewRender();
    });
  }

  // --- Collage Controls ---
  function updateCollageRatioUI() {
    document.querySelectorAll('[data-collage-base]').forEach(btn => {
      const base = btn.dataset.collageBase;
      const lbl = btn.querySelector('.ratio-text');
      if (lbl) lbl.textContent = resolveRatioStr(base, state.collage.orientation);
      btn.classList.toggle('active', base === state.collage.baseRatio);
    });
    document.querySelectorAll('[data-collage-orient]').forEach(btn => {
      btn.classList.toggle('active-blue', btn.dataset.collageOrient === state.collage.orientation);
    });
  }

  function renderCollageLayoutButtons() {
    const grid = $('collage-layoutGrid');
    grid.innerHTML = '';
    const layouts = COLLAGE_LAYOUTS[state.collage.divisions] || COLLAGE_LAYOUTS[2];
    layouts.forEach(layout => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'layout-btn' + (layout.id === state.collage.layoutId ? ' active' : '');

      const preview = document.createElement('div');
      preview.className = 'layout-preview';
      layout.cells.forEach(c => {
        const d = document.createElement('div');
        d.className = 'layout-preview-cell';
        d.style.left = `${c.x * 100}%`;
        d.style.top = `${c.y * 100}%`;
        d.style.width = `${c.w * 100}%`;
        d.style.height = `${c.h * 100}%`;
        preview.appendChild(d);
      });

      const label = document.createElement('span');
      label.textContent = layout.name;
      btn.appendChild(preview);
      btn.appendChild(label);

      btn.addEventListener('click', () => {
        state.collage.layoutId = layout.id;
        renderCollageLayoutButtons();
        schedulePreviewRender();
      });
      grid.appendChild(btn);
    });
  }

  function syncCollageZoomUI() {
    const slot = state.collage.slots[state.collage.activeCellIdx];
    if (!slot) return;
    $('collage-cellNum').textContent = String(state.collage.activeCellIdx + 1);
    $('collage-cellZoom').value = slot.zoom;
    $('collage-cellZoomVal').textContent = `${slot.zoom.toFixed(2)}x`;
  }

  function initCollageControls() {
    document.querySelectorAll('[data-collage-orient]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.collage.orientation = btn.dataset.collageOrient;
        updateCollageRatioUI();
        schedulePreviewRender();
      });
    });

    document.querySelectorAll('[data-collage-base]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.collage.baseRatio = btn.dataset.collageBase;
        updateCollageRatioUI();
        schedulePreviewRender();
      });
    });

    document.querySelectorAll('[data-collage-count]').forEach(btn => {
      btn.addEventListener('click', () => {
        const count = parseInt(btn.dataset.collageCount, 10);
        state.collage.divisions = count;
        state.collage.layoutId = COLLAGE_LAYOUTS[count][0].id;
        if (state.collage.activeCellIdx >= count) state.collage.activeCellIdx = 0;
        document.querySelectorAll('[data-collage-count]').forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.collageCount, 10) === count);
        });
        renderCollageLayoutButtons();
        syncCollageZoomUI();
        renderFilmstrip();
        schedulePreviewRender();
      });
    });

    $('collage-outer').addEventListener('input', (e) => {
      state.collage.outerBorderPercent = parseFloat(e.target.value);
      $('collage-outerVal').textContent = `${state.collage.outerBorderPercent.toFixed(1)}%`;
      schedulePreviewRender();
    });

    $('collage-gap').addEventListener('input', (e) => {
      state.collage.innerGapPercent = parseFloat(e.target.value);
      $('collage-gapVal').textContent = `${state.collage.innerGapPercent.toFixed(1)}%`;
      schedulePreviewRender();
    });

    document.querySelectorAll('[data-collage-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.collage.borderColor = btn.dataset.collageColor;
        document.querySelectorAll('[data-collage-color]').forEach(b => {
          b.classList.toggle('active', b.dataset.collageColor.toUpperCase() === state.collage.borderColor.toUpperCase());
        });
        schedulePreviewRender();
      });
    });

    $('collage-customColor').addEventListener('input', (e) => {
      state.collage.borderColor = e.target.value;
      document.querySelectorAll('[data-collage-color]').forEach(b => b.classList.remove('active'));
      schedulePreviewRender();
    });

    $('collage-cellZoom').addEventListener('input', (e) => {
      const slot = state.collage.slots[state.collage.activeCellIdx];
      if (!slot) return;
      slot.zoom = parseFloat(e.target.value);
      $('collage-cellZoomVal').textContent = `${slot.zoom.toFixed(2)}x`;
      schedulePreviewRender();
    });

    $('collage-resetBtn').addEventListener('click', () => {
      state.collage.slots.forEach(s => { s.panX = 0; s.panY = 0; s.zoom = 1; });
      syncCollageZoomUI();
      schedulePreviewRender();
    });

    renderCollageLayoutButtons();
  }

  // --- Calendar Controls ---
  function updateCalSubOptions() {
    $('cal-solidOpts').hidden = state.cal.frameMode !== 'solid';
    $('cal-blurOpts').hidden = state.cal.frameMode !== 'blur';
    $('cal-weekendOpts').hidden = state.cal.weekendMode !== 'color';
  }

  function initCalendarControls() {
    $('cal-dateInput').addEventListener('change', (e) => {
      const p = getCurrentPhoto();
      if (!p || !e.target.value) return;
      p.selectedDate = new Date(e.target.value);
      syncPhotoContextUI();
      schedulePreviewRender();
    });

    const shiftDay = (delta) => {
      const p = getCurrentPhoto();
      if (!p) return;
      const d = new Date(p.selectedDate);
      d.setDate(d.getDate() + delta);
      p.selectedDate = d;
      syncPhotoContextUI();
      schedulePreviewRender();
    };
    $('cal-prevDay').addEventListener('click', () => shiftDay(-1));
    $('cal-nextDay').addEventListener('click', () => shiftDay(1));
    $('cal-resetExif').addEventListener('click', () => {
      const p = getCurrentPhoto();
      if (!p) return;
      p.selectedDate = new Date(p.exifDate);
      syncPhotoContextUI();
      schedulePreviewRender();
    });

    $('cal-showTime').addEventListener('change', (e) => {
      state.cal.showTime = e.target.checked;
      schedulePreviewRender();
    });

    document.querySelectorAll('[data-cal-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.cal.stampTarget = btn.dataset.calTarget;
        document.querySelectorAll('[data-cal-target]').forEach(b => b.classList.toggle('active', b === btn));
        schedulePreviewRender();
      });
    });

    document.querySelectorAll('[data-cal-pos]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.cal.calPos = btn.dataset.calPos;
        document.querySelectorAll('[data-cal-pos]').forEach(b => b.classList.toggle('active', b === btn));
        schedulePreviewRender();
      });
    });

    $('cal-scale').addEventListener('input', (e) => {
      state.cal.calScale = parseInt(e.target.value, 10) / 100;
      $('cal-scaleVal').textContent = `${e.target.value}%`;
      schedulePreviewRender();
    });

    const updateCalMargin = () => {
      $('cal-marginVal').textContent = `${state.cal.calMarginX}% / ${state.cal.calMarginY}%`;
      schedulePreviewRender();
    };
    $('cal-marginX').addEventListener('input', (e) => { state.cal.calMarginX = parseFloat(e.target.value); updateCalMargin(); });
    $('cal-marginY').addEventListener('input', (e) => { state.cal.calMarginY = parseFloat(e.target.value); updateCalMargin(); });

    $('cal-logoScale').addEventListener('input', (e) => {
      state.cal.logoScale = parseInt(e.target.value, 10) / 100;
      $('cal-logoScaleVal').textContent = `${e.target.value}%`;
      schedulePreviewRender();
    });

    $('cal-logoMarginY').addEventListener('input', (e) => {
      state.cal.logoMarginY = parseFloat(e.target.value);
      $('cal-logoMarginYVal').textContent = `${e.target.value}%`;
      schedulePreviewRender();
    });

    const bindRatioGroup = (containerId, setter) => {
      const btns = $(containerId).querySelectorAll('[data-ratio]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.toggle('active', b === btn));
          setter(btn.dataset.ratio);
          schedulePreviewRender();
        });
      });
    };
    bindRatioGroup('cal-canvasRatios', (r) => { state.cal.canvasRatio = r; });
    bindRatioGroup('cal-photoRatios', (r) => { state.cal.photoRatio = r; });

    $('cal-offsetX').addEventListener('input', (e) => { state.cal.cropOffsetX = parseInt(e.target.value, 10); schedulePreviewRender(); });
    $('cal-offsetY').addEventListener('input', (e) => { state.cal.cropOffsetY = parseInt(e.target.value, 10); schedulePreviewRender(); });
    $('cal-resetCrop').addEventListener('click', () => {
      state.cal.cropOffsetX = 0; state.cal.cropOffsetY = 0;
      $('cal-offsetX').value = 0; $('cal-offsetY').value = 0;
      schedulePreviewRender();
    });

    document.querySelectorAll('[data-cal-framemode]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.cal.frameMode = btn.dataset.calFramemode;
        document.querySelectorAll('[data-cal-framemode]').forEach(b => b.classList.toggle('active', b === btn));
        updateCalSubOptions();
        schedulePreviewRender();
      });
    });

    $('cal-frameThick').addEventListener('input', (e) => {
      state.cal.frameThickness = parseFloat(e.target.value);
      $('cal-frameThickVal').textContent = `${e.target.value}%`;
      schedulePreviewRender();
    });
    $('cal-blurAmt').addEventListener('input', (e) => {
      state.cal.blurAmount = parseInt(e.target.value, 10);
      $('cal-blurAmtVal').textContent = `${e.target.value}px`;
      schedulePreviewRender();
    });
    $('cal-blurBright').addEventListener('input', (e) => {
      state.cal.blurBrightness = parseInt(e.target.value, 10);
      $('cal-blurBrightVal').textContent = `${e.target.value}%`;
      schedulePreviewRender();
    });
    $('cal-innerBorder').addEventListener('change', (e) => { state.cal.innerBorder = e.target.checked; schedulePreviewRender(); });
    $('cal-photoShadow').addEventListener('change', (e) => { state.cal.photoShadow = e.target.checked; schedulePreviewRender(); });

    const bindColor = (id, key) => {
      $(id).addEventListener('input', (e) => { state.cal[key] = e.target.value; schedulePreviewRender(); });
    };
    bindColor('cal-frameColor', 'frameColor');
    bindColor('cal-textColor', 'textColor');
    bindColor('cal-logoColor', 'logoColor');
    bindColor('cal-ringColor', 'ringColor');
    bindColor('cal-sunColor', 'sunColor');
    bindColor('cal-satColor', 'satColor');

    document.querySelectorAll('[data-cal-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = $(btn.dataset.calPreset);
        if (input) {
          input.value = btn.dataset.color;
          input.dispatchEvent(new Event('input'));
        }
      });
    });

    document.querySelectorAll('[data-cal-weekend]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.cal.weekendMode = btn.dataset.calWeekend;
        document.querySelectorAll('[data-cal-weekend]').forEach(b => b.classList.toggle('active', b === btn));
        updateCalSubOptions();
        schedulePreviewRender();
      });
    });

    $('cal-showLogo').addEventListener('change', (e) => { state.cal.showLogo = e.target.checked; schedulePreviewRender(); });

    $('cal-uploadLogoBtn').addEventListener('click', () => {
      dom.customLogoInput.value = '';
      dom.customLogoInput.click();
    });

    dom.customLogoInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const img = await blobToImage(file);
        state.cal.logoCanvas = trimTransparentEdges(img);
        $('cal-logoSourceBadge').textContent = 'カスタムロゴ';
        schedulePreviewRender();
        showToast('カスタムロゴを読み込みました');
      } catch (_) {
        showToast('ロゴの読み込みに失敗しました');
      }
    });

    $('cal-resetLogoBtn').addEventListener('click', () => {
      state.cal.logoCanvas = state.cal.defaultLogoCanvas;
      $('cal-logoSourceBadge').textContent = state.cal.defaultLogoLabel;
      schedulePreviewRender();
      showToast('標準ロゴに戻しました');
    });

    updateCalSubOptions();
  }

  // --- Riso Controls ---
  function renderRisoUI() {
    const r = state.riso;

    // Ink Layer Tabs
    const tabsBar = $('riso-inkTabs');
    tabsBar.innerHTML = '';
    r.inks.forEach((inkId, idx) => {
      const ink = RISO_INKS.find(i => i.id === inkId) || RISO_INKS[0];
      const tab = document.createElement('div');
      tab.className = 'riso-ink-tab' + (idx === r.activeTabIndex ? ' active' : '');
      tab.innerHTML = `<span class="riso-dot" style="background:${ink.hex}"></span><span>${ink.name}</span>${r.inks.length > 1 ? `<span class="riso-tab-x" data-rm="${idx}">×</span>` : ''}`;
      tab.addEventListener('click', (e) => {
        if (e.target.dataset.rm !== undefined) {
          r.inks.splice(parseInt(e.target.dataset.rm, 10), 1);
          if (r.activeTabIndex >= r.inks.length) r.activeTabIndex = r.inks.length - 1;
          renderRisoUI();
          schedulePreviewRender();
          return;
        }
        r.activeTabIndex = idx;
        renderRisoUI();
      });
      tabsBar.appendChild(tab);
    });

    if (r.inks.length < 3) {
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'riso-ink-add';
      add.textContent = '+';
      add.title = 'インク版を追加（最大3色）';
      add.addEventListener('click', () => {
        const unused = RISO_INKS.find(i => !r.inks.includes(i.id)) || RISO_INKS[0];
        r.inks.push(unused.id);
        r.activeTabIndex = r.inks.length - 1;
        renderRisoUI();
        schedulePreviewRender();
      });
      tabsBar.appendChild(add);
    }

    // Swatch highlight
    const activeInk = r.inks[r.activeTabIndex];
    document.querySelectorAll('.riso-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.ink === activeInk);
    });

    // Styles & Papers
    document.querySelectorAll('[data-riso-style]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.risoStyle, 10) === r.styleIndex);
    });
    document.querySelectorAll('[data-riso-paper]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.risoPaper, 10) === r.paperIndex);
    });
    document.querySelectorAll('[data-riso-margin]').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.risoMargin, 10) === r.margin);
    });

    // Sliders sync
    $('riso-dotSize').value = r.dotSize; $('riso-dotSizeVal').textContent = `${r.dotSize}px`;
    $('riso-texture').value = r.texture; $('riso-textureVal').textContent = `${r.texture}%`;
    $('riso-shift').value = r.shift; $('riso-shiftVal').textContent = `${r.shift}px`;
    $('riso-contrast').value = r.contrast; $('riso-contrastVal').textContent = `${r.contrast}%`;
    $('riso-brightness').value = r.brightness; $('riso-brightnessVal').textContent = `${r.brightness}`;
    $('riso-margin').value = r.margin; $('riso-marginVal').textContent = `${r.margin}%`;
    $('riso-radius').value = r.radius; $('riso-radiusVal').textContent = `${r.radius}px`;
  }

  function initRisoControls() {
    // Swatches
    const swatchBox = $('riso-swatches');
    const autoBtn = document.createElement('button');
    autoBtn.type = 'button';
    autoBtn.className = 'riso-swatch-auto';
    autoBtn.textContent = 'A';
    autoBtn.title = 'トーン・粒子を自動リセット';
    autoBtn.addEventListener('click', () => {
      Object.assign(state.riso, { dotSize: 5.5, texture: 48, contrast: 115, brightness: 0, shift: 4 });
      renderRisoUI();
      schedulePreviewRender();
      showToast('リソ設定をオートリセット');
    });
    swatchBox.appendChild(autoBtn);

    RISO_INKS.forEach(ink => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'riso-swatch' + (ink.hatched ? ' hatched' : '');
      btn.style.backgroundColor = ink.hex;
      btn.dataset.ink = ink.id;
      btn.title = ink.name;
      btn.addEventListener('click', () => {
        state.riso.inks[state.riso.activeTabIndex] = ink.id;
        renderRisoUI();
        schedulePreviewRender();
      });
      swatchBox.appendChild(btn);
    });

    // Papers
    const paperBox = $('riso-papers');
    RISO_PAPERS.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn paper-chip' + (idx === 0 ? ' active' : '');
      btn.dataset.risoPaper = String(idx);
      btn.innerHTML = `<span class="paper-dot" style="background:${p.hex}"></span><span>${p.name}</span>`;
      btn.addEventListener('click', () => {
        state.riso.paperIndex = idx;
        renderRisoUI();
        schedulePreviewRender();
      });
      paperBox.appendChild(btn);
    });

    document.querySelectorAll('[data-riso-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.riso.styleIndex = parseInt(btn.dataset.risoStyle, 10);
        renderRisoUI();
        schedulePreviewRender();
      });
    });

    document.querySelectorAll('[data-riso-margin]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.riso.margin = parseInt(btn.dataset.risoMargin, 10);
        renderRisoUI();
        schedulePreviewRender();
      });
    });

    const bindRisoSlider = (id, key, unit) => {
      $(id).addEventListener('input', (e) => {
        state.riso[key] = parseFloat(e.target.value);
        $(`${id}Val`).textContent = `${state.riso[key]}${unit}`;
        if (key === 'margin') {
          document.querySelectorAll('[data-riso-margin]').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.risoMargin, 10) === state.riso.margin);
          });
        }
        schedulePreviewRender();
      });
    };
    bindRisoSlider('riso-dotSize', 'dotSize', 'px');
    bindRisoSlider('riso-texture', 'texture', '%');
    bindRisoSlider('riso-shift', 'shift', 'px');
    bindRisoSlider('riso-contrast', 'contrast', '%');
    bindRisoSlider('riso-brightness', 'brightness', '');
    bindRisoSlider('riso-margin', 'margin', '%');
    bindRisoSlider('riso-radius', 'radius', 'px');

    $('riso-invertBtn').addEventListener('click', () => {
      state.riso.inks.reverse();
      renderRisoUI();
      schedulePreviewRender();
      showToast('インク順序を反転しました');
    });

    $('riso-randomBtn').addEventListener('click', () => {
      const count = Math.random() > 0.35 ? 2 : 3;
      const shuffled = [...RISO_INKS].sort(() => 0.5 - Math.random());
      state.riso.inks = shuffled.slice(0, count).map(i => i.id);
      state.riso.activeTabIndex = 0;
      state.riso.paperIndex = Math.floor(Math.random() * RISO_PAPERS.length);
      state.riso.styleIndex = Math.floor(Math.random() * RISO_STYLES.length);
      renderRisoUI();
      schedulePreviewRender();
      showToast(`RANDOM: ${state.riso.inks.map(id => RISO_INKS.find(i => i.id === id).name).join(' + ')}`);
    });

    // Preset Modal
    $('riso-presetsBtn').addEventListener('click', () => {
      dom.risoPresetModal.hidden = false;
      renderRisoPresetGallery();
    });
    $('closeRisoPresetBtn').addEventListener('click', () => { dom.risoPresetModal.hidden = true; });
    dom.risoPresetModal.addEventListener('click', (e) => {
      if (e.target === dom.risoPresetModal) dom.risoPresetModal.hidden = true;
    });

    $('saveRisoPresetBtn').addEventListener('click', () => {
      const title = state.riso.inks.map(id => {
        const n = RISO_INKS.find(i => i.id === id)?.name || id;
        return n.charAt(0) + n.slice(1).toLowerCase();
      }).join(' + ') + ' Custom';
      const preset = {
        title,
        custom: true,
        inks: [...state.riso.inks],
        paper: RISO_PAPERS[state.riso.paperIndex].id,
        style: RISO_STYLES[state.riso.styleIndex],
        margin: state.riso.margin,
        shift: state.riso.shift
      };
      state.riso.presets.unshift(preset);
      saveCustomRisoPresets();
      renderRisoPresetGallery();
      showToast('プリセットを保存しました');
    });

    renderRisoUI();
  }

  function saveCustomRisoPresets() {
    try {
      const custom = state.riso.presets.filter(p => p.custom);
      localStorage.setItem('photo_studio_riso_presets', JSON.stringify(custom));
    } catch (_) {}
  }

  function renderRisoPresetGallery() {
    const grid = dom.risoPresetGrid;
    grid.innerHTML = '';
    const photo = getCurrentPhoto();

    state.riso.presets.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'preset-card';

      const thumb = document.createElement('canvas');
      thumb.className = 'preset-thumb';
      card.appendChild(thumb);

      const meta = document.createElement('div');
      meta.className = 'preset-meta';
      const title = document.createElement('span');
      title.className = 'preset-title';
      title.textContent = p.title;
      meta.appendChild(title);

      if (p.custom) {
        const rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'btn btn-ghost btn-sm';
        rm.textContent = '×';
        rm.addEventListener('click', (e) => {
          e.stopPropagation();
          state.riso.presets.splice(idx, 1);
          saveCustomRisoPresets();
          renderRisoPresetGallery();
        });
        meta.appendChild(rm);
      }
      card.appendChild(meta);
      grid.appendChild(card);

      if (photo) {
        setTimeout(() => {
          renderRisoSync(thumb, photo, {
            inks: p.inks,
            paperId: p.paper,
            styleMode: p.style,
            dotSize: 5.5,
            texture: 48,
            contrast: 115,
            brightness: 0,
            shift: p.shift ?? 4,
            margin: p.margin ?? 14,
            radius: 18
          }, 220);
        }, 12 * idx);
      }

      card.addEventListener('click', () => {
        state.riso.inks = [...p.inks];
        state.riso.activeTabIndex = 0;
        const pi = RISO_PAPERS.findIndex(item => item.id === p.paper);
        if (pi !== -1) state.riso.paperIndex = pi;
        const si = RISO_STYLES.indexOf(p.style);
        if (si !== -1) state.riso.styleIndex = si;
        state.riso.margin = p.margin ?? 14;
        state.riso.shift = p.shift ?? 4;
        dom.risoPresetModal.hidden = true;
        renderRisoUI();
        schedulePreviewRender();
        showToast(`PRESET: ${p.title}`);
      });
    });
  }

  // =========================================================================
  // 8. Interactive Canvas (Crop Pan + Collage Pan & Long-Press Swap)
  // =========================================================================
  function initCanvasInteractions() {
    let isDragging = false;
    let startClientX = 0, startClientY = 0;
    let startPanX = 0, startPanY = 0;
    let longPressTimer = null;

    const clearLongPress = () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
    };

    const toCanvasCoords = (clientX, clientY) => {
      const rect = dom.previewCanvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (dom.previewCanvas.width / Math.max(1, rect.width)),
        y: (clientY - rect.top) * (dom.previewCanvas.height / Math.max(1, rect.height)),
        rect
      };
    };

    dom.previewCanvas.addEventListener('pointerdown', (e) => {
      if (!state.photos.length) return;
      const isFrameCrop = state.mode === 'frame' && state.frame.photoRatio !== 'original';
      if (state.mode !== 'crop' && state.mode !== 'collage' && !isFrameCrop) return;

      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      clearLongPress();
      state.collage.swapDrag.active = false;

      if (state.mode === 'collage') {
        const hit = state.collage.lastRenderedBoxes.find(
          b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h
        );
        if (hit) {
          state.collage.activeCellIdx = hit.idx;
          syncCollageZoomUI();
          renderFilmstrip();
          schedulePreviewRender();

          longPressTimer = setTimeout(() => {
            state.collage.swapDrag = { active: true, fromIdx: hit.idx, overIdx: hit.idx, pointerX: x, pointerY: y };
            if (navigator.vibrate) navigator.vibrate(35);
            dom.dragHintText.textContent = '入れ替え先の枠まで動かして離す';
            schedulePreviewRender(true);
          }, 350);
        }
        const slot = state.collage.slots[state.collage.activeCellIdx];
        startPanX = slot ? slot.panX : 0;
        startPanY = slot ? slot.panY : 0;
      } else if (isFrameCrop) {
        const p = getCurrentPhoto();
        startPanX = p.frameCrop.offsetX;
        startPanY = p.frameCrop.offsetY;
      } else {
        const p = getCurrentPhoto();
        startPanX = p.crop.panX;
        startPanY = p.crop.panY;
      }

      isDragging = true;
      startClientX = e.clientX;
      startClientY = e.clientY;
      dom.previewCanvas.setPointerCapture(e.pointerId);
      schedulePreviewRender(true);
    });

    dom.previewCanvas.addEventListener('pointermove', (e) => {
      if (!isDragging || !state.photos.length) return;
      if (!state.collage.swapDrag.active && Math.hypot(e.clientX - startClientX, e.clientY - startClientY) > 10) {
        clearLongPress();
      }
      const { x, y, rect } = toCanvasCoords(e.clientX, e.clientY);

      if (state.mode === 'collage' && state.collage.swapDrag.active) {
        state.collage.swapDrag.pointerX = x;
        state.collage.swapDrag.pointerY = y;
        const over = state.collage.lastRenderedBoxes.find(
          b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h
        );
        state.collage.swapDrag.overIdx = over ? over.idx : -1;
        schedulePreviewRender(true);
        return;
      }

      const sens = 2.2;
      const dx = ((e.clientX - startClientX) / Math.max(120, rect.width)) * sens;
      const dy = ((e.clientY - startClientY) / Math.max(120, rect.height)) * sens;

      if (state.mode === 'crop') {
        const p = getCurrentPhoto();
        p.crop.panX = Math.max(-1, Math.min(1, startPanX + dx));
        p.crop.panY = Math.max(-1, Math.min(1, startPanY + dy));
        syncPhotoContextUI();
        schedulePreviewRender(true);
      } else if (state.mode === 'frame' && state.frame.photoRatio !== 'original') {
        const p = getCurrentPhoto();
        p.frameCrop.offsetX = Math.max(-100, Math.min(100, Math.round(startPanX - dx * 100)));
        p.frameCrop.offsetY = Math.max(-100, Math.min(100, Math.round(startPanY - dy * 100)));
        syncPhotoContextUI();
        schedulePreviewRender(true);
      } else if (state.mode === 'collage') {
        const slot = state.collage.slots[state.collage.activeCellIdx];
        if (slot) {
          slot.panX = Math.max(-1, Math.min(1, startPanX + dx));
          slot.panY = Math.max(-1, Math.min(1, startPanY + dy));
          schedulePreviewRender(true);
        }
      }
    });

    const endDrag = () => {
      clearLongPress();
      if (!isDragging) return;
      isDragging = false;
      if (state.mode === 'collage' && state.collage.swapDrag.active) {
        const { fromIdx, overIdx } = state.collage.swapDrag;
        if (fromIdx >= 0 && overIdx >= 0 && fromIdx !== overIdx) {
          const tmp = { ...state.collage.slots[fromIdx] };
          state.collage.slots[fromIdx] = { ...state.collage.slots[overIdx] };
          state.collage.slots[overIdx] = tmp;
          state.collage.activeCellIdx = overIdx;
          syncCollageZoomUI();
          renderFilmstrip();
        }
        state.collage.swapDrag.active = false;
        updateDragHint();
      }
      schedulePreviewRender(false);
    };

    dom.previewCanvas.addEventListener('pointerup', endDrag);
    dom.previewCanvas.addEventListener('pointercancel', endDrag);
  }

  // =========================================================================
  // 9. Unified Export Modal & Full-Resolution Generator
  // =========================================================================
  function renderRisoMpSelector() {
    const grid = dom.risoMpGrid;
    grid.innerHTML = '';
    const photo = getCurrentPhoto();
    const aspect = photo ? (photo.width / Math.max(1, photo.height)) : 1.5;

    RISO_EXPORT_MPS.forEach(mp => {
      const dims = calcDimensionsForMP(mp, aspect);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip-btn' + (state.riso.exportMP === mp ? ' active' : '');
      btn.innerHTML = `<span>${mp}MP</span><span class="chip-sub">${dims.w}×${dims.h}</span>`;
      btn.addEventListener('click', () => {
        state.riso.exportMP = mp;
        renderRisoMpSelector();
        updateExportButtonLabel();
        schedulePreviewRender();
      });
      grid.appendChild(btn);
    });
  }

  function openExportModal() {
    if (!state.photos.length) return;
    const isCollage = state.mode === 'collage';
    const isRiso = state.mode === 'riso';
    const count = isCollage ? 1 : state.photos.length;

    dom.exportProgressArea.hidden = true;
    dom.exportActionsArea.hidden = false;
    dom.risoExportOpts.hidden = !isRiso;
    dom.zipExportBtn.hidden = isCollage || count < 2;

    if (isRiso) {
      renderRisoMpSelector();
      dom.exportSummaryText.textContent = `リソグラフ品質で書き出します（${count}枚・選択解像度で非同期レンダリング）`;
    } else if (isCollage) {
      dom.exportSummaryText.textContent = '2400万画素（6000×4000ベース）のフル解像度でコラージュを書き出します。';
    } else if (state.mode === 'calendar') {
      dom.exportSummaryText.textContent = `2400万画素の高解像度でカレンダー合成写真を書き出します（${count}枚）。`;
    } else {
      dom.exportSummaryText.textContent = `元の高解像度を維持したまま書き出します（${count}枚）。`;
    }

    dom.exportModal.hidden = false;
  }

  async function generateExportItems() {
    state.isExporting = true;
    dom.exportActionsArea.hidden = true;
    dom.exportProgressArea.hidden = false;

    const results = [];
    const workCanvas = document.createElement('canvas');

    try {
      if (state.mode === 'collage') {
        dom.exportProgressText.textContent = '24MP コラージュをレンダリング中...';
        dom.exportProgressCount.textContent = '1 / 1';
        dom.exportProgressBar.style.width = '50%';
        await new Promise(r => setTimeout(r, 40));

        renderCollage(workCanvas, false);
        const blob = await new Promise(res => workCanvas.toBlob(res, 'image/jpeg', 0.96));
        const ratioSafe = resolveRatioStr(state.collage.baseRatio, state.collage.orientation).replace(':', 'x');
        results.push({
          blob,
          filename: `collage_${ratioSafe}_${workCanvas.width}x${workCanvas.height}.jpg`,
          mime: 'image/jpeg'
        });
        dom.exportProgressBar.style.width = '100%';
        return results;
      }

      const total = state.photos.length;
      for (let i = 0; i < total; i++) {
        const photo = state.photos[i];
        dom.exportProgressCount.textContent = `${i + 1} / ${total}`;

        if (state.mode === 'riso') {
          dom.exportProgressText.textContent = `リソグラフ ${state.riso.exportMP}MP レンダリング中...`;
          const item = await renderRisoChunkedAsync(
            photo, getCurrentRisoConfig(), state.riso.exportMP, state.riso.exportFormat,
            (frac) => {
              const overall = ((i + frac) / total) * 100;
              dom.exportProgressBar.style.width = `${Math.round(overall)}%`;
            }
          );
          results.push(item);
        } else {
          dom.exportProgressBar.style.width = `${Math.round(((i + 0.5) / total) * 100)}%`;
          await new Promise(r => setTimeout(r, 30));

          let filename;
          if (state.mode === 'frame') {
            dom.exportProgressText.textContent = 'フレームを合成中...';
            renderFrame(workCanvas, photo, null);
            filename = `${photo.name}_framed.jpg`;
          } else if (state.mode === 'crop') {
            dom.exportProgressText.textContent = 'クロップ書き出し中...';
            const info = renderCrop(workCanvas, photo, null, false);
            filename = `${photo.name}_crop_${info.ratioStr.replace(':', 'x')}.jpg`;
          } else {
            dom.exportProgressText.textContent = '24MP カレンダーを合成中...';
            renderCalendar(workCanvas, photo, false);
            const d = photo.selectedDate;
            filename = `Calendar_${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}_24MP_${i + 1}.jpg`;
          }

          const blob = await new Promise(res => workCanvas.toBlob(res, 'image/jpeg', 0.95));
          results.push({ blob, filename, mime: 'image/jpeg' });
          dom.exportProgressBar.style.width = `${Math.round(((i + 1) / total) * 100)}%`;
        }
      }
    } finally {
      state.isExporting = false;
    }

    return results;
  }

  function triggerDownloads(items) {
    items.forEach((item, idx) => {
      setTimeout(() => {
        const url = URL.createObjectURL(item.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }, idx * 240);
    });
  }

  function initExportModal() {
    dom.exportBtn.addEventListener('click', openExportModal);
    $('closeExportModalBtn').addEventListener('click', () => {
      if (!state.isExporting) dom.exportModal.hidden = true;
    });
    dom.exportModal.addEventListener('click', (e) => {
      if (e.target === dom.exportModal && !state.isExporting) dom.exportModal.hidden = true;
    });

    document.querySelectorAll('[data-riso-fmt]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.riso.exportFormat = btn.dataset.risoFmt;
        document.querySelectorAll('[data-riso-fmt]').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    $('shareExportBtn').addEventListener('click', async () => {
      const items = await generateExportItems();
      const files = items.map(it => new File([it.blob], it.filename, { type: it.mime }));
      if (navigator.canShare && navigator.canShare({ files })) {
        try {
          await navigator.share({ files, title: 'Photo Studio Unified' });
          dom.exportModal.hidden = true;
          showToast('共有・保存が完了しました');
          return;
        } catch (err) {
          if (err.name === 'AbortError') {
            dom.exportModal.hidden = true;
            return;
          }
        }
      }
      triggerDownloads(items);
      dom.exportModal.hidden = true;
      showToast('ダウンロードを開始しました');
    });

    $('downloadExportBtn').addEventListener('click', async () => {
      const items = await generateExportItems();
      triggerDownloads(items);
      dom.exportModal.hidden = true;
      showToast(`${items.length}枚の保存を開始しました`);
    });

    dom.zipExportBtn.addEventListener('click', async () => {
      if (!window.JSZip) {
        showToast('オフラインのため個別ダウンロードを実行します');
        const items = await generateExportItems();
        triggerDownloads(items);
        dom.exportModal.hidden = true;
        return;
      }
      const items = await generateExportItems();
      dom.exportProgressText.textContent = 'ZIPアーカイブを作成中...';
      const zip = new window.JSZip();
      items.forEach(it => zip.file(it.filename, it.blob));
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerDownloads([{ blob: zipBlob, filename: `PhotoStudio_${state.mode}_${Date.now()}.zip` }]);
      dom.exportModal.hidden = true;
      showToast('ZIPファイルの保存を開始しました');
    });
  }

  // =========================================================================
  // 10. Settings Modal, PWA Registration & PNG Icon Generator
  // =========================================================================
  function downloadPWAIconPNG(size) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d');
    const s = size / 512;

    g.fillStyle = '#0d0d11';
    g.fillRect(0, 0, size, size);

    g.fillStyle = '#17171d';
    g.strokeStyle = '#2c2c38';
    g.lineWidth = 10 * s;
    drawRoundedRectPath(g, 52 * s, 52 * s, 408 * s, 408 * s, 76 * s);
    g.fill();
    g.stroke();

    g.strokeStyle = '#f3f3f6';
    g.lineWidth = 16 * s;
    drawRoundedRectPath(g, 118 * s, 118 * s, 276 * s, 276 * s, 36 * s);
    g.stroke();

    g.globalCompositeOperation = 'screen';
    const circles = [
      [214, 224, 48, '#3b82f6'],
      [294, 288, 54, '#dbe734'],
      [298, 202, 30, '#ff48b0']
    ];
    circles.forEach(([cx, cy, r, col]) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(cx * s, cy * s, r * s, 0, Math.PI * 2);
      g.fill();
    });
    g.globalCompositeOperation = 'source-over';

    c.toBlob((blob) => {
      if (!blob) return;
      triggerDownloads([{ blob, filename: `icon-${size}.png` }]);
      showToast(`icon-${size}.png を書き出しました`);
    }, 'image/png');
  }

  function initPWAAndGlobalEvents() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then(reg => reg.update()).catch(() => {});
    }

    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      dom.installAppBtn.hidden = false;
    });

    dom.installAppBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      dom.installAppBtn.hidden = true;
    });

    // Mode navigation buttons (both desktop & mobile bars)
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Photo pickers & Drag-and-Drop
    const triggerPick = () => { dom.fileInput.value = ''; dom.fileInput.click(); };
    $('selectPhotoBtn').addEventListener('click', triggerPick);
    $('addPhotoBtn').addEventListener('click', triggerPick);
    $('loadSampleBtn').addEventListener('click', loadBuiltInSample);
    $('clearAllBtn').addEventListener('click', resetToEmpty);
    dom.fileInput.addEventListener('change', (e) => ingestFiles(e.target.files));

    ['dragenter', 'dragover'].forEach(ev => {
      dom.stageCanvasArea.addEventListener(ev, (e) => {
        e.preventDefault();
        dom.stageCanvasArea.classList.add('drag-over');
      });
    });
    ['dragleave', 'drop'].forEach(ev => {
      dom.stageCanvasArea.addEventListener(ev, (e) => {
        e.preventDefault();
        dom.stageCanvasArea.classList.remove('drag-over');
      });
    });
    dom.stageCanvasArea.addEventListener('drop', (e) => {
      if (e.dataTransfer?.files?.length) ingestFiles(e.dataTransfer.files);
    });

    // Settings Modal
    $('settingsBtn').addEventListener('click', () => { dom.settingsModal.hidden = false; });
    $('closeSettingsBtn').addEventListener('click', () => { dom.settingsModal.hidden = true; });
    dom.settingsModal.addEventListener('click', (e) => {
      if (e.target === dom.settingsModal) dom.settingsModal.hidden = true;
    });
    $('dlIcon192Btn').addEventListener('click', () => downloadPWAIconPNG(192));
    $('dlIcon512Btn').addEventListener('click', () => downloadPWAIconPNG(512));

    window.addEventListener('resize', () => {
      if (state.photos.length) schedulePreviewRender();
    });
  }

  // =========================================================================
  // 11. Bootstrap
  // =========================================================================
  window.addEventListener('DOMContentLoaded', async () => {
    initPWAAndGlobalEvents();
    initSubTabs();
    initFrameControls();
    initCropControls();
    initCollageControls();
    initCalendarControls();
    initRisoControls();
    initCanvasInteractions();
    initExportModal();

    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    } catch (_) {}

    await loadAuthenticLogo();
    if (state.photos.length) schedulePreviewRender();
  });
})();
