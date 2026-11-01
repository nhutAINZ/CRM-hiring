// ====================================================================
// FASTHUNT RECRUITMENT AGENT - CV EXPORT SERVICE
// Pure JavaScript Standalone HTML & Markdown Generator for Candidate Resumes
// ====================================================================

export function generateCvMarkdown(cvData) {
  const p = cvData?.personal || {};
  return `# ${p.fullName || 'HỒ SƠ ỨNG VIÊN'}
**${p.title || 'Vị trí ứng tuyển'}**

- **Điện thoại:** ${p.phone || 'N/A'}
- **Email:** ${p.email || 'N/A'}
- **Địa chỉ:** ${p.location || 'N/A'}
- **Mức lương kỳ vọng:** ${p.expectedSalary || 'Thỏa thuận'}
- **Thời gian nhận việc:** ${p.availability || 'Sẵn sàng'}
${p.website ? `- **Portfolio / LinkedIn:** ${p.website}\n` : ''}
---

## 🎯 TÓM TẮT NĂNG LỰC
${cvData?.summary || 'Chưa cập nhật'}

---

## 💼 KINH NGHIỆM LÀM VIỆC
${(cvData?.experiences || [])
  .map(
    (exp) => `### ${exp.role || 'Chức danh'} — ${exp.company || 'Doanh nghiệp'}
*Thời gian:* ${exp.period || ''}

${exp.description || ''}
`
  )
  .join('\n')}

---

## 🛠️ KỸ NĂNG CHUYÊN MÔN
${(cvData?.skills || []).map((s) => `- ${s}`).join('\n')}

---

## 🎓 HỌC VẤN & BẰNG CẤP
${(cvData?.education || []).map((edu) => `- **${edu.school}** — ${edu.degree} (${edu.year})`).join('\n')}

${
  (cvData?.languages || []).length > 0
    ? `---

## 🌐 NGOẠI NGỮ
${(cvData?.languages || []).map((l) => `- ${l.name}: ${l.level}`).join('\n')}
`
    : ''
}
${
  cvData?.endorsement
    ? `---

## ⭐ ĐÁNH GIÁ CHUYÊN MÔN
> "${cvData.endorsement}"
`
    : ''
}
`;
}

export function generateStandaloneHtml(cvData, templateStyle = 'modern', themeColor = '#2563eb') {
  const p = cvData?.personal || {};
  const experiences = cvData?.experiences || [];
  const education = cvData?.education || [];
  const skills = cvData?.skills || [];
  const languages = cvData?.languages || [];
  const summary = cvData?.summary || '';
  const endorsement = cvData?.endorsement || '';
  const candidateName = p.fullName || 'Ứng Viên';

  const avatarImgTag = p.avatarUrl
    ? `<img src="${p.avatarUrl}" alt="${candidateName}" class="avatar-img" />`
    : '';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CV - ${candidateName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #f1f5f9;
      line-height: 1.5;
      padding: 24px;
    }
    .no-print-bar {
      position: sticky;
      top: 12px;
      z-index: 999;
      max-width: 820px;
      margin: 0 auto 20px auto;
      background: #0f172a;
      color: #fff;
      padding: 12px 20px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
      font-size: 13px;
    }
    .no-print-bar .brand { font-weight: 700; display: flex; items-center; gap: 8px; }
    .no-print-bar button {
      background: ${themeColor};
      color: #fff;
      border: none;
      padding: 8px 16px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      transition: opacity 0.2s;
    }
    .no-print-bar button:hover { opacity: 0.9; }
    .cv-container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      min-height: 1050px;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 24px;
    }
    .header-info h1 {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .header-info .job-title {
      font-size: 16px;
      font-weight: 700;
      color: ${themeColor};
      margin-top: 2px;
    }
    .avatar-img {
      width: 84px;
      height: 84px;
      border-radius: 16px;
      object-fit: cover;
      border: 2px solid ${themeColor};
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .contact-info {
      text-align: right;
      font-size: 12px;
      color: #475569;
      line-height: 1.8;
      flex-shrink: 0;
    }
    .info-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .info-strip .label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .info-strip .value { font-weight: 800; color: #0f172a; margin-top: 2px; }
    .section-title {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: ${themeColor};
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .summary-text {
      font-size: 13px;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 24px;
      text-align: justify;
    }
    .exp-item {
      position: relative;
      padding-left: 18px;
      border-left: 2px solid #e2e8f0;
      margin-bottom: 18px;
    }
    .exp-item::before {
      content: "";
      position: absolute;
      left: -6px;
      top: 6px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${themeColor};
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }
    .exp-header .period { font-size: 11px; font-weight: 600; color: #64748b; }
    .exp-company { font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px; }
    .exp-desc { font-size: 12px; color: #475569; line-height: 1.6; white-space: pre-line; }
    .skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
    .skill-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
    .edu-item { margin-bottom: 8px; font-size: 12px; }
    .edu-school { font-weight: 800; color: #0f172a; }
    .edu-deg { color: #475569; }
    .edu-yr { color: #94a3b8; font-size: 11px; }
    .endorsement-box {
      margin-top: 24px;
      padding: 14px 18px;
      border-radius: 12px;
      background: ${themeColor}12;
      border: 1px solid ${themeColor}35;
      font-size: 12px;
    }
    .endorsement-title { font-weight: 800; color: ${themeColor}; margin-bottom: 4px; }
    .endorsement-text { font-style: italic; color: #334155; line-height: 1.6; }

    @media print {
      body { background: #fff !important; padding: 0 !important; }
      .no-print-bar { display: none !important; }
      .cv-container {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
        min-height: auto !important;
      }
      @page { size: A4 portrait; margin: 12mm 14mm; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div class="brand">
      <span>📄 Bản CV Ứng Viên Chuẩn In Ấn - ${candidateName}</span>
    </div>
    <button onclick="window.print()">🖨️ In Ra Giấy / Lưu File PDF (1-Chạm)</button>
  </div>

  <div class="cv-container">
    <div class="header-row">
      <div style="display:flex; align-items:center; gap:16px;">
        ${avatarImgTag}
        <div class="header-info">
          <h1>${candidateName}</h1>
          <p class="job-title">${p.title || 'Vị trí ứng tuyển'}</p>
        </div>
      </div>
      <div class="contact-info">
        ${p.phone ? `<div>📞 ${p.phone}</div>` : ''}
        ${p.email ? `<div>✉️ ${p.email}</div>` : ''}
        ${p.location ? `<div>📍 ${p.location}</div>` : ''}
        ${p.website ? `<div>🌐 ${p.website}</div>` : ''}
      </div>
    </div>

    <div class="info-strip">
      <div>
        <div class="label">Mức lương kỳ vọng</div>
        <div class="value">${p.expectedSalary || 'Thương lượng'}</div>
      </div>
      <div>
        <div class="label">Thời gian nhận việc</div>
        <div class="value">${p.availability || 'Sẵn sàng'}</div>
      </div>
      <div>
        <div class="label">Tình trạng hồ sơ</div>
        <div class="value" style="color:#059669;">✓ Đã xác thực</div>
      </div>
    </div>

    ${
      summary
        ? `<div class="section-title">🎯 Tóm Tắt Năng Lực & Mục Tiêu</div>
    <div class="summary-text">${summary}</div>`
        : ''
    }

    ${
      experiences.length > 0
        ? `<div class="section-title">💼 Kinh Nghiệm Làm Việc</div>
    <div style="margin-bottom: 24px;">
      ${experiences
        .map(
          (exp) => `
        <div class="exp-item">
          <div class="exp-header">
            <span>${exp.role || 'Chức danh'}</span>
            <span class="period">${exp.period || ''}</span>
          </div>
          <div class="exp-company">${exp.company || 'Doanh nghiệp'}</div>
          ${exp.description ? `<div class="exp-desc">${exp.description}</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>`
        : ''
    }

    ${
      skills.length > 0
        ? `<div class="section-title">🛠️ Kỹ Năng Chuyên Môn</div>
    <div class="skills-wrap">
      ${skills.map((s) => `<span class="skill-pill">${s}</span>`).join('')}
    </div>`
        : ''
    }

    <div class="grid-2">
      ${
        education.length > 0
          ? `<div>
        <div class="section-title">🎓 Học Vấn & Bằng Cấp</div>
        ${education
          .map(
            (edu) => `
          <div class="edu-item">
            <div class="edu-school">${edu.school || ''}</div>
            <div class="edu-deg">${edu.degree || ''}</div>
            <div class="edu-yr">${edu.year || ''}</div>
          </div>
        `
          )
          .join('')}
      </div>`
          : '<div></div>'
      }

      ${
        languages.length > 0
          ? `<div>
        <div class="section-title">🌐 Ngôn Ngữ</div>
        ${languages
          .map(
            (l) => `
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:6px;">
            <span style="font-weight:700;">${l.name}:</span>
            <span style="color:#475569;">${l.level}</span>
          </div>
        `
          )
          .join('')}
      </div>`
          : '<div></div>'
      }
    </div>

    ${
      endorsement
        ? `<div class="endorsement-box">
      <div class="endorsement-title">⭐ Đánh Giá Giới Thiệu Chuyên Môn</div>
      <div class="endorsement-text">"${endorsement}"</div>
    </div>`
        : ''
    }
  </div>
</body>
</html>`;
}
