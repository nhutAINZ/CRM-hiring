import Papa from 'papaparse';

export const DEFAULT_CONFIG = {
  sheet1Id: '1ij2ivwCd4-hI69XBGIhkhb_jPWbkc5J1oAGtlKwjLXc',
  sheet1Gid: '1557540072',
  sheet2Id: '1QxicFfdrkDL_vsUv9uZPwSl1Osi0c06h4xDEBrU6p2Y',
  sheet2Gid: '0',
  ctvSheetId: '11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk',
  ctvSheetGid: '497830992',
  jobSheetId: '1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko',
  jobSheetGid: '0',
  intergreatSheetId: '1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4',
  intergreatSheetGid: '0',
  autoRefreshInterval: 0, // 0 = disabled, or minutes: 1, 5, 15
};

export const CTV_SHEET_URL = 'https://docs.google.com/spreadsheets/d/11g-mvcukMTE0Bdjek5kIgbI_8WuxZshTlS0eCGw60Wk/edit?gid=497830992#gid=497830992';
export const JOB_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit?gid=0#gid=0';
export const INTERGREAT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4/edit?gid=0#gid=0';


export const getStoredConfig = () => {
  const saved = localStorage.getItem('recruitment_dashboard_config');
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading stored config', e);
    }
  }
  return DEFAULT_CONFIG;
};

export const saveStoredConfig = (config) => {
  localStorage.setItem('recruitment_dashboard_config', JSON.stringify(config));
};

// Clean string helper
const cleanText = (str) => {
  if (str === null || str === undefined) return '';
  return String(str).trim();
};

// Helper to construct GViz CSV URL
export const getCsvUrl = (spreadsheetId, gid = '0') => {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
};

// Helper to construct view URL for Sheet 2
export const getSheet2ViewUrl = (sheet2Id = DEFAULT_CONFIG.sheet2Id) => {
  return `https://docs.google.com/spreadsheets/d/${sheet2Id}/edit`;
};

// Helper to construct view URL for CTV Sheet
export const getCtvSheetViewUrl = (
  ctvSheetId = DEFAULT_CONFIG.ctvSheetId,
  ctvSheetGid = DEFAULT_CONFIG.ctvSheetGid
) => {
  return `https://docs.google.com/spreadsheets/d/${ctvSheetId}/edit?gid=${ctvSheetGid}#gid=${ctvSheetGid}`;
};

// Helper to construct view URL for Job Sheet
export const getJobSheetViewUrl = (
  jobSheetId = DEFAULT_CONFIG.jobSheetId,
  jobSheetGid = DEFAULT_CONFIG.jobSheetGid
) => {
  return `https://docs.google.com/spreadsheets/d/${jobSheetId}/edit?gid=${jobSheetGid}#gid=${jobSheetGid}`;
};

/**
 * Normalizes headers from Google Sheet by cleaning whitespace & linebreaks
 */
const normalizeHeader = (header) => {
  if (!header) return '';
  return header
    .toLowerCase()
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Find exact or fuzzy value from row object based on candidate field keywords
 */
const extractField = (row, fieldKeywords) => {
  const keys = Object.keys(row);
  for (const keyword of fieldKeywords) {
    const matchedKey = keys.find((k) => normalizeHeader(k).includes(normalizeHeader(keyword)));
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
      return cleanText(row[matchedKey]);
    }
  }
  return '';
};

/**
 * Parse Sheet 1 Data
 */
export const fetchSheet1Data = async (sheet1Id, sheet1Gid) => {
  const url = getCsvUrl(sheet1Id, sheet1Gid);
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Không thể kết nối Google Sheet 1 (HTTP ${response.status})`);
  }
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          resolve([]);
          return;
        }

        const candidates = results.data
          .map((row, index) => {
            const timestamp = extractField(row, ['dấu thời gian', 'timestamp']);
            const name = extractField(row, ['tên ứng viên', 'tên uv', 'ứng viên']);

            // Ignore blank or header repetition rows
            if (!name && !timestamp) return null;

            const ctvCode = extractField(row, ['mã ctv', 'ctv']);
            const positionCompany = extractField(row, ['vị trí ứng tuyển_doanh nghiệp', 'vị trí ứng tuyển', 'vị trí']);
            const desiredSalary = extractField(row, ['mức lương mong muốn', 'lương mong muốn']);
            const startTime = extractField(row, ['thời gian bắt đầu làm việc', 'thời gian bắt đầu']);
            const cvUrl = extractField(row, ['update cv', 'link cv', 'cv']);
            const email = extractField(row, ['địa chỉ email', 'email']);
            const notes = extractField(row, ['ghi chú thêm về ứng viên', 'ghi chú thêm']);
            const cvResultRaw = extractField(row, ['kết quả cv']);
            const interviewDate = extractField(row, ['ngày phỏng vấn']);
            const interviewTime = extractField(row, ['giờ phỏng vấn']);
            const interviewLocation = extractField(row, ['địa điểm phỏng vấn']);
            const pvResultRaw = extractField(row, ['kết quả pv', 'kết quả phỏng vấn']);
            const onboardingDate = extractField(row, ['ngày onboarding', 'ngày ob']);
            const onboardingSalary = extractField(row, ['mức lương ob', 'lương ob']);
            const bonusDate = extractField(row, ['ngày trả bonus', 'bonus']);
            const statusCandidate = extractField(row, ['tình trạng ứng viên', 'tình trạng']);
            const generalNotes = extractField(row, ['ghi chú']);

            // Extract position vs company name if separated by underscore or hyphen
            let position = positionCompany;
            let company = '';
            if (positionCompany.includes('_')) {
              const parts = positionCompany.split('_');
              position = parts[0].trim();
              company = parts.slice(1).join('_').trim();
            } else if (positionCompany.includes('-')) {
              const parts = positionCompany.split('-');
              position = parts[0].trim();
              company = parts.slice(1).join('-').trim();
            }

            return {
              id: `uv_${index + 1}_${Date.now()}`,
              rowIndex: index + 2, // 1-based, plus header row
              timestamp,
              name,
              ctvCode: ctvCode || 'N/A',
              positionCompany,
              position,
              company,
              desiredSalary,
              startTime,
              cvUrl,
              email,
              notes,
              cvResultRaw,
              interviewDate,
              interviewTime,
              interviewLocation,
              pvResultRaw,
              onboardingDate,
              onboardingSalary,
              bonusDate,
              statusCandidate,
              generalNotes,
              rawRow: row
            };
          })
          .filter(Boolean);

        resolve(candidates);
      },
      error: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * Parse Sheet 2 Data (Client Sheet mapping)
 */
export const fetchSheet2Data = async (sheet2Id, sheet2Gid = '0') => {
  try {
    const url = getCsvUrl(sheet2Id, sheet2Gid);
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return [];

    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data) {
            resolve([]);
            return;
          }
          const items = results.data.map((row, idx) => ({
            stt: extractField(row, ['stt']),
            name: extractField(row, ['ứng viên', 'tên ứng viên']),
            position: extractField(row, ['vị trí ứng tuyển', 'vị trí']),
            cvResult: extractField(row, ['kết quả cv']),
            pvResult: extractField(row, ['kết quả phỏng vấn', 'kết quả pv']),
            stage: extractField(row, ['giai đoạn']),
            status: extractField(row, ['tình trạng ứng viên', 'tình trạng']),
            rowIndex: idx + 2
          }));
          resolve(items);
        },
        error: () => resolve([])
      });
    });
  } catch (err) {
    console.warn('Could not fetch Sheet 2, falling back safely', err);
    return [];
  }
};

/**
 * Parse CTV Sheet Data (CTV Registrations & Code Mapping)
 */
export const fetchCtvSheetData = async (
  ctvSheetId = DEFAULT_CONFIG.ctvSheetId,
  ctvSheetGid = DEFAULT_CONFIG.ctvSheetGid
) => {
  try {
    const url = getCsvUrl(ctvSheetId, ctvSheetGid);
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return [];

    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data) {
            resolve([]);
            return;
          }
          const ctvList = results.data.map((row, idx) => ({
            id: `ctv_${idx + 1}`,
            timestamp: extractField(row, ['dấu thời gian', 'timestamp']),
            name: extractField(row, ['họ và tên cộng tác viên', 'họ và tên', 'tên']),
            bankAccount: extractField(row, ['số tài khoản']),
            bankName: extractField(row, ['tên ngân hàng']),
            email: extractField(row, ['địa chỉ email', 'email']),
            phoneZalo: extractField(row, ['số điện thoại', 'zalo', 'sđt']),
            birthYear: extractField(row, ['năm sinh']),
            ctvCode: extractField(row, ['mã', 'mã ctv']),
            notes: extractField(row, ['góp ý', 'mong muốn']),
            rowIndex: idx + 2
          })).filter(item => item.name || item.ctvCode);
          resolve(ctvList);
        },
        error: () => resolve([])
      });
    });
  } catch (err) {
    console.warn('Could not fetch CTV Sheet, falling back safely', err);
    return [];
  }
};

/**
 * Parse Job Sheet Data (Job Openings & CTV Commission Info)
 */
export const fetchJobSheetData = async (
  jobSheetId = DEFAULT_CONFIG.jobSheetId,
  jobSheetGid = DEFAULT_CONFIG.jobSheetGid
) => {
  try {
    const url = getCsvUrl(jobSheetId, jobSheetGid);
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return [];

    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            resolve([]);
            return;
          }

          const jobs = results.data
            .map((row, idx) => {
              const title = extractField(row, ['vị trí ứng tuyển', 'vị trí', 'job title', 'chức danh']);
              const location = extractField(row, ['khu vực', 'địa điểm', 'location']);
              const industry = extractField(row, ['loại ngành', 'ngành nghề', 'category', 'industry']);
              const status = extractField(row, ['trạng thái', 'tình trạng', 'status']);
              const datePosted = extractField(row, ['ngày đăng', 'date posted']);
              const company = extractField(row, ['công ty', 'doanh nghiệp', 'khách hàng', 'company']);
              const salary = extractField(row, ['mức lương tham khảo', 'mức lương', 'lương', 'salary']);
              const headcount = extractField(row, ['số lượng tuyển', 'số lượng', 'headcount']);
              const warrantyPeriod = extractField(row, ['thời gian bảo hành', 'bảo hành', 'warranty']);
              const bonus = extractField(row, ['bonus (hh) cho ctv', 'bonus', 'hoa hồng', 'hh cho ctv']);
              const requirements = extractField(row, ['ghi chú cần thiết hoặc yêu cầu thêm', 'yêu cầu', 'ghi chú', 'requirements']);
              const jdFile = extractField(row, ['job description', 'jd', 'mô tả công việc']);

              // Skip completely empty placeholder rows
              if (!title && !company && !bonus) return null;

              return {
                id: `job_${idx + 1}`,
                title: title || 'Vị trí tuyển dụng',
                location: location || 'Toàn quốc',
                industry: industry || 'Khác',
                status: status || 'Đang tuyển',
                datePosted: datePosted || '',
                company: company || 'Doanh nghiệp đối tác',
                salary: salary || 'Thỏa thuận',
                headcount: headcount || '1',
                warrantyPeriod: warrantyPeriod || '30 Ngày',
                bonus: bonus || 'Thỏa thuận',
                requirements: requirements || '',
                jdFile: jdFile || '',
                rowIndex: idx + 2,
                sheetRowUrl: `https://docs.google.com/spreadsheets/d/${jobSheetId}/edit?gid=${jobSheetGid}#gid=${jobSheetGid}&range=A${idx + 2}`,
                rawRow: row
              };
            })
            .filter(Boolean);

          resolve(jobs);
        },
        error: () => resolve([])
      });
    });
  } catch (err) {
    console.warn('Could not fetch Job Sheet, falling back safely', err);
    return [];
  }
};

// Helper to construct view URL for Intergreat Client Sheet
export const getIntergreatSheetViewUrl = (
  sheetId = DEFAULT_CONFIG.intergreatSheetId,
  sheetGid = DEFAULT_CONFIG.intergreatSheetGid
) => {

  return `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=${sheetGid}#gid=${sheetGid}`;
};

/**
 * Parse Intergreat Client Sheet Data (Tư vấn tuyển sinh Intergreat)
 */
export const fetchIntergreatSheetData = async (
  sheetId = DEFAULT_CONFIG.intergreatSheetId,
  sheetGid = DEFAULT_CONFIG.intergreatSheetGid
) => {
  try {
    const url = getCsvUrl(sheetId, sheetGid);
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return [];

    const csvText = await response.text();
    return new Promise((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            resolve([]);
            return;
          }

          const candidates = results.data
            .map((row, idx) => {
              const name = extractField(row, ['tên ứng viên', 'tên uv', 'ứng viên', 'name']);
              const position = extractField(row, ['vị trí ứng tuyển', 'vị trí', 'position']) || 'Tư vấn Tuyển Sinh';
              const salary = extractField(row, ['lương mong muốn', 'lương', 'salary']);
              const startTime = extractField(row, ['thời gian bắt đầu làm việc', 'thời gian bắt đầu']);
              const cvFile = extractField(row, ['sơ yếu lý lịch', 'cv', 'link cv']);
              const cvResult = extractField(row, ['kết quả cv']);
              const interviewDate = extractField(row, ['ngày phỏng vấn']);
              const interviewTime = extractField(row, ['giờ phỏng vấn']);
              const pvResult = extractField(row, ['kết quả phỏng vấn', 'kết quả pv']);
              const onboardDate = extractField(row, ['ngày bắt đầu làm', 'ngày ob']);
              const statusCandidate = extractField(row, ['tình trạng ứng viên', 'tình trạng']);
              const notes = extractField(row, ['cột 1', 'ghi chú', 'đánh giá']);

              if (!name && !position) return null;

              return {
                id: `intergreat_uv_${idx + 1}`,
                rowIndex: idx + 2,
                name: name || 'Ứng viên',
                position: position || 'Tư vấn Tuyển Sinh',
                company: 'Intergreat Education',
                salary: salary || 'Trong khoảng đã đề xuất',
                startTime: startTime || '',
                cvFile: cvFile || '',
                cvResult: cvResult || '',
                interviewDate: interviewDate || '',
                interviewTime: interviewTime || '',
                pvResult: pvResult || '',
                onboardDate: onboardDate || '',
                statusCandidate: statusCandidate || '',
                notes: notes || '',
                rawRow: row
              };
            })
            .filter(Boolean);

          resolve(candidates);
        },
        error: () => resolve([])
      });
    });
  } catch (err) {
    console.warn('Could not fetch Intergreat Sheet, falling back safely', err);
    return [];
  }
};


