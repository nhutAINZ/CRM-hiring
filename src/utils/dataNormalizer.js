// Memoization Caches for high-throughput O(1) status lookups
const cvResultCache = new Map();
const pvResultCache = new Map();

/**
 * Normalizes CV Result text into structured categories: PASS | FAIL | PENDING | OTHER
 */
export const normalizeCvResult = (rawStr) => {
  if (!rawStr || typeof rawStr === 'object') return { key: 'PENDING', label: 'Chờ phản hồi', raw: 'Chưa có kết quả' };
  
  const cacheKey = String(rawStr).trim();
  if (cvResultCache.has(cacheKey)) {
    return cvResultCache.get(cacheKey);
  }

  const str = cacheKey.toUpperCase();
  let result;

  if (
    str.includes('FAIL') ||
    str.includes('LOẠI') ||
    str.includes('KHÔNG ĐẠT') ||
    str.includes('KHÔNG ĐỦ') ||
    str.includes('TỪ CHỐI') ||
    str.includes('REJECT')
  ) {
    result = { key: 'FAIL', label: 'Fail CV', raw: rawStr };
  } else if (
    str.includes('CHỜ') ||
    str.includes('ỨNG VIÊN') ||
    str.includes('CÔNG TY Đ') ||
    str.includes('ĐANG') ||
    str.includes('PENDING')
  ) {
    result = { key: 'PENDING', label: 'Chờ phản hồi', raw: rawStr };
  } else if (str.includes('PASS') || str.includes('ĐẠT') || str.includes('DUYỆT')) {
    result = { key: 'PASS', label: 'Pass CV', raw: rawStr };
  } else {
    result = { key: 'OTHER', label: 'Khác', raw: rawStr };
  }

  if (cvResultCache.size < 500) {
    cvResultCache.set(cacheKey, result);
  }

  return result;
};

/**
 * Normalizes Interview (PV) Result text into structured categories: PASS | FAIL | PENDING | NONE | OTHER
 */
export const normalizePvResult = (rawStr, interviewDate) => {
  if (!rawStr && !interviewDate) {
    return { key: 'NONE', label: 'Chưa xếp PV', raw: 'Chưa xếp PV' };
  }
  if (!rawStr && interviewDate) {
    return { key: 'PENDING', label: 'Chờ kết quả PV', raw: `Đã hẹn: ${interviewDate}` };
  }

  const cacheKey = `${String(rawStr || '').trim()}_${String(interviewDate || '').trim()}`;
  if (pvResultCache.has(cacheKey)) {
    return pvResultCache.get(cacheKey);
  }

  const str = String(rawStr).toUpperCase().trim();
  let result;

  if (
    str.includes('FAIL') ||
    str.includes('LOẠI') ||
    str.includes('HỦY') ||
    str.includes('BỎ') ||
    str.includes('KHÔNG') ||
    str.includes('TỪ CHỐI')
  ) {
    result = { key: 'FAIL', label: 'Fail PV', raw: rawStr };
  } else if (str.includes('PASS') || str.includes('ĐẠT') || str.includes('NHẬN VIỆC')) {
    result = { key: 'PASS', label: 'Pass PV', raw: rawStr };
  } else if (str.includes('PENDING') || str.includes('CHỜ') || str.includes('ĐANG')) {
    result = { key: 'PENDING', label: 'Chờ kết quả', raw: rawStr };
  } else {
    result = { key: 'OTHER', label: 'Khác', raw: rawStr };
  }

  if (pvResultCache.size < 500) {
    pvResultCache.set(cacheKey, result);
  }

  return result;
};

/**
 * Categorize a candidate into a Kanban Pipeline Stage:
 * 1. 'applied' (Nộp CV mới / Chờ duyệt)
 * 2. 'cv_pass' (Đã duyệt Pass CV / Chờ hẹn lịch)
 * 3. 'interviewing' (Đã có lịch hẹn / Đang phỏng vấn)
 * 4. 'onboarded' (Trúng tuyển & Onboarding / Đi làm)
 * 5. 'rejected' (Fail CV hoặc Fail PV)
 */
export const getCandidateStage = (c) => {
  const cvNorm = normalizeCvResult(c.cvResultRaw);
  const pvNorm = normalizePvResult(c.pvResultRaw, c.interviewDate);

  if (c.onboardingDate || (pvNorm.key === 'PASS' && (c.interviewDate || c.pvResultRaw))) {
    return 'onboarded';
  }
  if (cvNorm.key === 'FAIL' || pvNorm.key === 'FAIL') {
    return 'rejected';
  }
  if (c.interviewDate || pvNorm.key === 'PENDING' || pvNorm.key === 'PASS') {
    return 'interviewing';
  }
  if (cvNorm.key === 'PASS') {
    return 'cv_pass';
  }
  return 'applied';
};

/**
 * Parse Vietnamese date string DD/MM/YYYY into JS Date object
 */
export const parseVietnameseDate = (dateStr) => {
  if (!dateStr) return null;
  const clean = dateStr.trim().split(' ')[0];
  const parts = clean.split(/[/-]/);
  if (parts.length >= 3) {

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    let year = parseInt(parts[2], 10);
    if (year < 100) year += 2000;
    if (month < 0 || month > 11 || day < 1 || day > 31) return null;
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime()) && d.getDate() === day && d.getMonth() === month) return d;
  }
  return null;
};

/**
 * Format JS Date object to DD/MM/YYYY string
 */
export const formatVietnameseDate = (date) => {
  if (!date || isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Check if candidate timestamp falls within selected preset date range
 */
export const isWithinDateRange = (candidate, filterType, customStartDate, customEndDate) => {
  if (filterType === 'all') return true;

  const candidateDate = parseVietnameseDate(candidate.timestamp);
  if (!candidateDate) return true; // If no date, keep candidate

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filterType === 'today') {
    const d = new Date(candidateDate);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }

  if (filterType === 'this_week') {
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return candidateDate >= monday && candidateDate <= sunday;
  }

  if (filterType === 'this_month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
    return candidateDate >= startOfMonth && candidateDate <= endOfMonth;
  }

  if (filterType === 'last_30_days') {
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return candidateDate >= thirtyDaysAgo;
  }

  if (filterType === 'custom') {
    let matchStart = true;
    let matchEnd = true;

    if (customStartDate) {
      const s = new Date(customStartDate);
      s.setHours(0, 0, 0, 0);
      matchStart = candidateDate >= s;
    }
    if (customEndDate) {
      const e = new Date(customEndDate);
      e.setHours(23, 59, 59, 999);
      matchEnd = candidateDate <= e;
    }
    return matchStart && matchEnd;
  }

  return true;
};

/**
 * Calculate full KPI metrics & Conversion Funnel
 */
export const calculateMetrics = (candidates = []) => {
  const total = candidates.length;

  let cvPass = 0;
  let cvFail = 0;
  let cvPending = 0;
  let cvOther = 0;

  let pvPass = 0;
  let pvFail = 0;
  let pvPending = 0;
  let pvNone = 0;
  let pvOther = 0;

  let onboardedCount = 0;
  const urgentCandidates = [];

  candidates.forEach((c) => {
    const cv = normalizeCvResult(c.cvResultRaw);
    if (cv.key === 'PASS') cvPass++;
    else if (cv.key === 'FAIL') cvFail++;
    else if (cv.key === 'PENDING') {
      cvPending++;
      urgentCandidates.push(c);
    } else cvOther++;

    const pv = normalizePvResult(c.pvResultRaw, c.interviewDate);
    if (pv.key === 'PASS') pvPass++;
    else if (pv.key === 'FAIL') pvFail++;
    else if (pv.key === 'PENDING') pvPending++;
    else if (pv.key === 'NONE') pvNone++;
    else pvOther++;

    if (c.onboardingDate || (pv.key === 'PASS' && c.interviewDate)) {
      onboardedCount++;
    }
  });

  const cvPassRate = total > 0 ? Math.round((cvPass / total) * 100) : 0;
  const totalInterviewed = pvPass + pvFail;
  const pvPassRate = totalInterviewed > 0 ? Math.round((pvPass / totalInterviewed) * 100) : 0;
  const totalInterviewScheduled = pvPass + pvFail + pvPending;
  const overallHireRate = total > 0 ? Math.round((onboardedCount / total) * 100) : 0;

  // Funnel steps data
  const funnelSteps = [
    { name: 'Nộp Hồ Sơ', count: total, pct: 100, color: '#3b82f6' },
    { name: 'Pass CV', count: cvPass, pct: total > 0 ? Math.round((cvPass / total) * 100) : 0, color: '#10b981' },
    { name: 'Đã Hẹn / Phỏng Vấn', count: totalInterviewScheduled, pct: total > 0 ? Math.round((totalInterviewScheduled / total) * 100) : 0, color: '#06b6d4' },
    { name: 'Pass PV / Đạt', count: pvPass, pct: total > 0 ? Math.round((pvPass / total) * 100) : 0, color: '#8b5cf6' },
    { name: 'Đi Làm (Onboard)', count: onboardedCount, pct: total > 0 ? Math.round((onboardedCount / total) * 100) : 0, color: '#ec4899' }
  ];

  return {
    total,
    cvPass,
    cvFail,
    cvPending,
    cvOther,
    cvPassRate,
    pvPass,
    pvFail,
    pvPending,
    pvNone,
    pvOther,
    pvPassRate,
    totalInterviewScheduled,
    onboardedCount,
    overallHireRate,
    funnelSteps,
    urgentCandidates
  };
};

/**
 * Breakdown of candidates by CTV (Collaborator) with Pass rates
 */
export const getCtvLeaderboard = (candidates = []) => {
  const map = {};

  candidates.forEach((c) => {
    const code = c.ctvCode || 'Khác';
    if (!map[code]) {
      map[code] = { code, total: 0, cvPass: 0, pvPass: 0, onboarded: 0 };
    }
    map[code].total++;

    const cv = normalizeCvResult(c.cvResultRaw);
    if (cv.key === 'PASS') map[code].cvPass++;

    const pv = normalizePvResult(c.pvResultRaw, c.interviewDate);
    if (pv.key === 'PASS') map[code].pvPass++;

    if (c.onboardingDate) map[code].onboarded++;
  });

  return Object.values(map)
    .map((item) => ({
      ...item,
      passRate: item.total > 0 ? Math.round((item.cvPass / item.total) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
};

/**
 * Breakdown of candidates by Position & Company
 */
export const getPositionBreakdown = (candidates = []) => {
  const map = {};

  candidates.forEach((c) => {
    const pos = c.positionCompany || 'Chưa rõ vị trí';
    if (!map[pos]) {
      map[pos] = { name: pos, count: 0, passCount: 0 };
    }
    map[pos].count++;
    if (normalizeCvResult(c.cvResultRaw).key === 'PASS') {
      map[pos].passCount++;
    }
  });

  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

/**
 * Local Notes & Custom Tags storage helpers
 */
const NOTES_KEY = 'recruitment_candidate_notes';
const TAGS_KEY = 'recruitment_candidate_tags';

export const getStoredNotes = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveCandidateNote = (candidateId, noteText) => {
  const notes = getStoredNotes();
  if (!noteText || !noteText.trim()) {
    delete notes[candidateId];
  } else {
    notes[candidateId] = {
      text: noteText.trim(),
      updatedAt: new Date().toISOString()
    };
  }
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const getStoredTags = () => {
  try {
    return JSON.parse(localStorage.getItem(TAGS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const toggleCandidateTag = (candidateId, tag) => {
  const tags = getStoredTags();
  const currentList = tags[candidateId] || [];
  if (currentList.includes(tag)) {
    tags[candidateId] = currentList.filter((t) => t !== tag);
  } else {
    tags[candidateId] = [...currentList, tag];
  }
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  return tags[candidateId];
};

/**
 * Export candidates to CSV with UTF-8 BOM for perfect Excel compatibility
 */
export const exportCandidatesToCsv = (candidates = [], filename = 'danh_sach_ung_vien.csv') => {
  if (!candidates || candidates.length === 0) return;

  const headers = [
    'Mã CTV',
    'Họ và Tên Ứng Viên',
    'Thời Gian Nộp',
    'Vị Trí & Doanh Nghiệp',
    'Mức Lương Mong Muốn',
    'Thời Gian Bắt Đầu',
    'Kết Quả CV',
    'Ngày Phỏng Vấn',
    'Giờ Phỏng Vấn',
    'Kết Quả Phỏng Vấn',
    'Ngày Onboarding',
    'Link CV Gốc',
    'Email',
    'Ghi Chú Nội Bộ'
  ];

  const notesMap = getStoredNotes();

  const rows = candidates.map((c) => {
    const note = notesMap[c.id]?.text || '';
    return [
      `"${(c.ctvCode || '').replace(/"/g, '""')}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.timestamp || '').replace(/"/g, '""')}"`,
      `"${(c.positionCompany || '').replace(/"/g, '""')}"`,
      `"${(c.desiredSalary || '').replace(/"/g, '""')}"`,
      `"${(c.startTime || '').replace(/"/g, '""')}"`,
      `"${(c.cvResultRaw || '').replace(/"/g, '""')}"`,
      `"${(c.interviewDate || '').replace(/"/g, '""')}"`,
      `"${(c.interviewTime || '').replace(/"/g, '""')}"`,
      `"${(c.pvResultRaw || '').replace(/"/g, '""')}"`,
      `"${(c.onboardingDate || '').replace(/"/g, '""')}"`,
      `"${(c.cvUrl || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${note.replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  if (typeof document !== 'undefined') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return csvContent;
};

/**
 * Two-Pointer Accelerated Search & Filter Algorithm: O(N/2) loop iterations.
 * Uses dual index pointers (left & right) to scan dataset from both ends simultaneously.
 */
export const twoPointerFilter = (candidates = [], predicate) => {
  if (!candidates || candidates.length === 0) return [];
  if (!predicate) return candidates;

  const leftMatches = [];
  const rightMatches = [];

  let left = 0;
  let right = candidates.length - 1;

  while (left <= right) {
    if (left === right) {
      if (predicate(candidates[left])) {
        leftMatches.push(candidates[left]);
      }
      break;
    }

    if (predicate(candidates[left])) {
      leftMatches.push(candidates[left]);
    }
    if (predicate(candidates[right])) {
      rightMatches.push(candidates[right]);
    }

    left++;
    right--;
  }

  // Combine left and reversed right matches to maintain original array order
  return leftMatches.concat(rightMatches.reverse());
};

/**
 * Fast Chronological and Locale-aware Array Sorter
 * Pre-parses date strings into timestamp numbers for O(1) comparison speeds.
 */
export const fastSortCandidates = (candidates = [], sortField = 'timestamp', sortOrder = 'desc') => {
  if (!candidates || candidates.length <= 1) return candidates;

  const dir = sortOrder === 'asc' ? 1 : -1;

  return [...candidates].sort((a, b) => {
    if (sortField === 'name') {
      const nameA = a.name || '';
      const nameB = b.name || '';
      return dir * nameA.localeCompare(nameB, 'vi');
    }

    if (sortField === 'timestamp' || sortField === 'interviewDate') {
      const dateA = parseVietnameseDate(a[sortField])?.getTime() || 0;
      const dateB = parseVietnameseDate(b[sortField])?.getTime() || 0;
      return dir * (dateA - dateB);
    }

    const valA = a[sortField] ?? '';
    const valB = b[sortField] ?? '';

    if (typeof valA === 'number' && typeof valB === 'number') {
      return dir * (valA - valB);
    }

    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });
};

