// ====================================================================
// FASTHUNT / RECRUITCRM PRO - CV EMAIL EXTRACTION ENGINE
// Regex-based Email Extraction from Candidate CV and Metadata
// ====================================================================

export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

/**
 * Extracts email address from text with contact section prioritization.
 *
 * @param {string} text - Raw text content from CV or metadata
 * @returns {string|null} - Extracted email or null
 */
export const extractEmailFromText = (text) => {
  if (!text || typeof text !== 'string') return null;

  const matches = text.match(EMAIL_REGEX);
  if (!matches || matches.length === 0) return null;

  // Filter unique valid emails (lowercase)
  const uniqueEmails = Array.from(new Set(matches.map((m) => m.trim().toLowerCase())));
  if (uniqueEmails.length === 1) {
    return uniqueEmails[0];
  }

  // Filter out system / do not reply / corporate support domains if other candidates exist
  const nonGenericEmails = uniqueEmails.filter((email) => {
    const local = email.split('@')[0];
    return !['noreply', 'no-reply', 'donotreply', 'support', 'help', 'info'].includes(local);
  });

  const candidatesToScore = nonGenericEmails.length > 0 ? nonGenericEmails : uniqueEmails;
  if (candidatesToScore.length === 1) {
    return candidatesToScore[0];
  }

  // Contact section keywords
  const contactKeywords = [
    'thông tin liên hệ',
    'liên hệ',
    'contact',
    'contact info',
    'contact information',
    'email cá nhân',
    'email liên hệ',
    'email',
    'e-mail',
    'mail',
    'hòm thư',
    'ứng viên',
    'candidate'
  ];

  const lowerText = text.toLowerCase();
  let bestEmail = candidatesToScore[0];
  let bestScore = -Infinity;

  for (const email of candidatesToScore) {
    let emailScore = 0;
    const emailIndex = lowerText.indexOf(email);

    if (emailIndex !== -1) {
      for (const keyword of contactKeywords) {
        let searchStart = 0;
        while (searchStart < lowerText.length) {
          const kwIndex = lowerText.indexOf(keyword, searchStart);
          if (kwIndex === -1) break;

          const diff = emailIndex - kwIndex;
          // If email is shortly after keyword (within 250 chars)
          if (diff >= 0 && diff <= 250) {
            emailScore += 100 - (diff / 250) * 50;
          } else if (diff < 0 && Math.abs(diff) <= 100) {
            emailScore += 30;
          }

          searchStart = kwIndex + keyword.length;
        }
      }
    }

    if (emailScore > bestScore) {
      bestScore = emailScore;
      bestEmail = email;
    }
  }

  return bestEmail;
};

/**
 * Comprehensive email extractor for Candidate object.
 * Checks CV text, CV URL parameters, candidate notes, and raw sheet rows.
 *
 * @param {object} candidate - Candidate data object
 * @param {string} [cvTextContent] - Optional raw text parsed from CV document
 * @returns {{ email: string, isAutoExtracted: boolean, warning: string|null }}
 */
export const extractCandidateEmail = (candidate, cvTextContent = '') => {
  // 1. Try extracting from supplied CV document text first
  if (cvTextContent) {
    const fromCvText = extractEmailFromText(cvTextContent);
    if (fromCvText) {
      return {
        email: fromCvText,
        isAutoExtracted: true,
        warning: null
      };
    }
  }

  // 2. Try candidate direct email field
  if (candidate?.email && typeof candidate.email === 'string') {
    const emailMatch = extractEmailFromText(candidate.email);
    if (emailMatch) {
      return {
        email: emailMatch,
        isAutoExtracted: true,
        warning: null
      };
    }
  }

  // 3. Try raw row data fields
  if (candidate?.rawRow && typeof candidate.rawRow === 'object') {
    const rawValues = Object.values(candidate.rawRow).join(' ');
    const fromRawRow = extractEmailFromText(rawValues);
    if (fromRawRow) {
      return {
        email: fromRawRow,
        isAutoExtracted: true,
        warning: null
      };
    }
  }

  // 4. Try candidate notes or CV URL string (some URLs or notes embed candidate email)
  const otherSources = `${candidate?.notes || ''} ${candidate?.cvUrl || ''}`;
  const fromOther = extractEmailFromText(otherSources);
  if (fromOther) {
    return {
      email: fromOther,
      isAutoExtracted: true,
      warning: null
    };
  }

  // 5. If no text layer found or scan image
  return {
    email: '',
    isAutoExtracted: false,
    warning: 'Không tìm thấy email trong CV (ảnh scan không có text layer hoặc chưa có email). Vui lòng nhập tay.'
  };
};

/**
 * Client-side file parser to extract text from PDF or DOCX file object or ArrayBuffer.
 *
 * @param {File|Blob} file - Uploaded CV file
 * @returns {Promise<string>} - Extracted text content
 */
export const parseFileToText = async (file) => {
  if (!file) return '';

  try {
    // For text-based or plain format
    if (file.type === 'text/plain' || file.name?.endsWith('.txt')) {
      return await file.text();
    }

    // Read file as text / array buffer for binary text streams
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const decoded = decoder.decode(buffer);

    // Extract ASCII/printable strings from binary files like PDF / DOCX
    const printableStrings = decoded.match(/[a-zA-Z0-9._%+-@:/\\ \t\r\n]{4,}/g) || [];
    return printableStrings.join(' ');
  } catch (err) {
    console.error('Error parsing CV file in browser', err);
    return '';
  }
};
