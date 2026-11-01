// ====================================================================
// FASTHUNT RECRUITMENT AGENT - CANDIDATE CV BUILDER STUDIO
// Professional ATS-Friendly Candidate Profile & Resume Generator
// ====================================================================

import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Phone,
  Mail,
  MapPin,
  Globe,
  Eye,
  Edit3,
  RotateCcw,
  CheckCircle2,
  Save,
  ArrowRight,
  Code2
} from 'lucide-react';

// Preset sample resumes for quick 1-click loading
const CV_PRESETS = {
  it_developer: {
    personal: {
      fullName: 'Nguyễn Văn Minh',
      title: 'Senior Fullstack Developer (React / Node.js)',
      email: 'minh.nguyen.tech@gmail.com',
      phone: '0987 654 321',
      location: 'Quận Cầu Giấy, Hà Nội',
      website: 'github.com/minh-dev-pro',
      avatarUrl: '',
      expectedSalary: '35.000.000₫ - 45.000.000₫',
      availability: 'Có thể nhận việc sau 15 ngày'
    },
    summary:
      'Kỹ sư phần mềm với hơn 5 năm kinh nghiệm chuyên sâu về kiến trúc ứng dụng web hiệu năng cao trên React, TypeScript, Node.js và hệ thống Microservices. Đã trực tiếp thiết kế và tối ưu hệ thống phục vụ hơn 200.000 người dùng hoạt động mỗi ngày. Có thế mạnh về tối ưu tốc độ tải trang, API RESTful và CI/CD Docker.',
    experiences: [
      {
        id: 'exp-1',
        company: 'VNPAY Fintech Solutions',
        role: 'Tech Lead / Senior Frontend Engineer',
        period: '03/2023 - Hiện tại',
        description:
          '• Trực tiếp dẫn dắt nhóm 6 lập trình viên phát triển cổng thanh toán & mini apps.\n• Tái cấu trúc mã nguồn giúp tăng điểm Google Lighthouse từ 65 lên 96 điểm và giảm thời gian First Contentful Paint 40%.\n• Xây dựng bộ UI Design System dùng chung cho 4 phân hệ dịch vụ.'
      },
      {
        id: 'exp-2',
        company: 'FPT Software',
        role: 'Fullstack Software Engineer',
        period: '08/2020 - 02/2023',
        description:
          '• Tham gia phát triển hệ thống quản trị nhân sự và bảng lương cho khách hàng doanh nghiệp Nhật Bản.\n• Thiết kế cơ sở dữ liệu PostgreSQL và tối ưu các câu truy vấn xử lý dữ liệu lớn.\n• Viết Unit Test và Integration Test đạt độ bao phủ kiểm thử trên 85%.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại Học Bách Khoa Hà Nội',
        degree: 'Kỹ sư Công Nghệ Thông Tin (Loại Giỏi)',
        year: '2016 - 2020'
      }
    ],
    skills: [
      'React.js / Next.js',
      'TypeScript / JavaScript (ESNext)',
      'Node.js / Express / NestJS',
      'Tailwind CSS / Design System',
      'PostgreSQL / MongoDB / Redis',
      'Docker / AWS / CI-CD',
      'Git Workflow / Code Review',
      'Clean Architecture / OOP'
    ],
    languages: [
      { name: 'Tiếng Việt', level: 'Bản ngữ' },
      { name: 'Tiếng Anh', level: 'Thành thạo (TOEIC 850 - Giao tiếp kỹ thuật tốt)' }
    ],
    certifications: [
      'AWS Certified Solutions Architect – Associate (2023)',
      'Meta Frontend Developer Professional Certificate'
    ],
    endorsement:
      'Ứng viên có tư duy kỹ thuật xuất sắc, kỹ năng giao tiếp và lãnh đạo nhóm tốt. Tác phong chuẩn mực, phù hợp các doanh nghiệp yêu cầu chuẩn mực cao về hiệu năng phần mềm và độ tin cậy hệ thống.'
  },
  sales_manager: {
    personal: {
      fullName: 'Trần Thị Thu Trang',
      title: 'Trưởng Phòng Kinh Doanh B2B / Sales Manager',
      email: 'thutrang.tran.sales@gmail.com',
      phone: '0912 345 678',
      location: 'Quận 1, TP. Hồ Chí Minh',
      website: 'linkedin.com/in/thutrang-sales-b2b',
      avatarUrl: '',
      expectedSalary: '30.000.000₫ + KPI Hoa hồng cao',
      availability: 'Sẵn sàng nhận việc ngay'
    },
    summary:
      'Nhà quản trị kinh doanh B2B năng động với hơn 6 năm thành tích vượt chỉ tiêu liên tục trong lĩnh vực phần mềm SaaS, dịch vụ giải pháp doanh nghiệp và thương mại điện tử. Có thế mạnh tuyển dụng, đào tạo đội ngũ telesales/field sales và xây dựng mạng lưới quan hệ với các giám đốc doanh nghiệp vừa và lớn.',
    experiences: [
      {
        id: 'exp-1',
        company: 'Base.vn - Doanh Nghiệp Quản Trị Số',
        role: 'Trưởng Phòng Kinh Doanh Doanh Nghiệp',
        period: '01/2022 - Hiện tại',
        description:
          '• Quản lý trực tiếp đội ngũ 12 chuyên viên kinh doanh B2B, hoàn thành 128% KPI doanh số năm 2024.\n• Đàm phán và ký kết thành công hơn 40 hợp đồng giải pháp trị giá trên 500 triệu đồng với các chuỗi bán lẻ và sản xuất.\n• Xây dựng quy trình chốt sales 5 bước giúp rút ngắn chu kỳ bán hàng từ 45 ngày xuống còn 20 ngày.'
      },
      {
        id: 'exp-2',
        company: 'MISA Joint Stock Company',
        role: 'Chuyên Viên Kinh Doanh Cao Cấp',
        period: '06/2019 - 12/2021',
        description:
          '• Tư vấn và triển khai phần mềm kế toán và hóa đơn điện tử cho hơn 300 doanh nghiệp trên địa bàn TP.HCM.\n• Đạt danh hiệu Best Seller miền Nam quý III & quý IV năm 2020.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại Học Kinh Tế TP. Hồ Chí Minh (UEH)',
        degree: 'Cử nhân Quản Trị Kinh Doanh',
        year: '2015 - 2019'
      }
    ],
    skills: [
      'Đàm phán & Chốt hợp đồng B2B',
      'Xây dựng & Đào tạo đội ngũ Sales',
      'Quản lý phễu CRM (HubSpot, Salesforce)',
      'Phân tích thị trường & Lập kế hoạch doanh số',
      'Thuyết trình & Demo sản phẩm giải pháp',
      'Quan hệ khách hàng VIP (Key Account Management)'
    ],
    languages: [
      { name: 'Tiếng Việt', level: 'Bản ngữ' },
      { name: 'Tiếng Anh', level: 'Giao tiếp đàm phán thương mại lưu loát' }
    ],
    certifications: [
      'HubSpot Inbound Sales Certified',
      'Chứng chỉ Quản trị Đội ngũ Bán hàng Thực chiến (PACE)'
    ],
    endorsement:
      'Năng lượng tích cực, kỹ năng thương lượng sắc bén và kinh nghiệm dẫn dắt đội ngũ thực chiến. Ứng viên cam kết mạnh mẽ về chỉ tiêu doanh số và có mạng lưới khách hàng doanh nghiệp sẵn có.'
  },
  hr_recruiter: {
    personal: {
      fullName: 'Lê Hoàng Yến',
      title: 'Chuyên Viên Tuyển Dụng Cao Cấp (Senior HR / Talent Acquisition)',
      email: 'hoangyen.le.hr@gmail.com',
      phone: '0903 888 999',
      location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
      website: 'linkedin.com/in/hoangyen-talent-hunter',
      avatarUrl: '',
      expectedSalary: '20.000.000₫ - 25.000.000₫',
      availability: 'Có thể nhận việc sau 30 ngày báo trước'
    },
    summary:
      'Chuyên viên Tuyển dụng và Thu hút Nhân tài với 4 năm kinh nghiệm Headhunt và Tuyển dụng nội bộ mảng Tech, Digital Marketing và Tài chính. Am hiểu sâu sắc các kênh sourcing hiện đại, xây dựng thương hiệu nhà tuyển dụng và quy trình phỏng vấn theo chuẩn năng lực STAR.',
    experiences: [
      {
        id: 'exp-1',
        company: 'Navigos Group / VietnamWorks',
        role: 'Senior Recruitment Consultant',
        period: '05/2022 - Hiện tại',
        description:
          '• Phụ trách tìm kiếm và cung ứng thành công hơn 80 ứng viên cấp trung và cấp cao cho các tập đoàn đa quốc gia.\n• Duy trì tỷ lệ ứng viên pass probation trên 92%.\n• Tư vấn lương thưởng và xu hướng thị trường lao động cho đối tác khách hàng.'
      }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại Học Khoa Học Xã Hội & Nhân Văn TP.HCM',
        degree: 'Cử nhân Quản Trị Nhân Sự',
        year: '2017 - 2021'
      }
    ],
    skills: [
      'Kỹ thuật Sourcing ứng viên thụ động',
      'Phỏng vấn đánh giá theo mô hình STAR',
      'Xây dựng Employer Branding',
      'Headhunting cấp quản lý',
      'Quản lý hệ thống ATS & Báo cáo tuyển dụng'
    ],
    languages: [
      { name: 'Tiếng Việt', level: 'Bản ngữ' },
      { name: 'Tiếng Anh', level: 'IELTS 7.0 - Phỏng vấn song ngữ lưu loát' }
    ],
    certifications: [
      'SHRM Certified Professional (SHRM-CP)',
      'LinkedIn Certified Recruiter'
    ],
    endorsement:
      'Tác phong chuẩn mực, thấu hiểu tâm lý ứng viên và nhu cầu doanh nghiệp. Rất phù hợp các vị trí Talent Acquisition nội bộ hoặc Trưởng nhóm Tuyển dụng.'
  }
};

export default function CvBuilderView({
  onAddCandidateToSystem = () => {},
  jobItems = [],
  currentCtv = null,
  onNavigateToTable = () => {}
}) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const [templateStyle, setTemplateStyle] = useState('modern'); // 'modern' | 'classic' | 'ats' | 'creative'
  const [themeColor, setThemeColor] = useState('#2563eb'); // blue, emerald, indigo, rose, slate
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');

  // CV Data State
  const [cvData, setCvData] = useState(() => CV_PRESETS.it_developer);

  const previewRef = useRef(null);

  // Theme color presets
  const COLOR_OPTIONS = [
    { name: 'Xanh Hoàng Gia', hex: '#2563eb', bgClass: 'bg-blue-600' },
    { name: 'Xanh Ngọc Lục Bảo', hex: '#059669', bgClass: 'bg-emerald-600' },
    { name: 'Tím Indigo', hex: '#4f46e5', bgClass: 'bg-indigo-600' },
    { name: 'Đỏ FastHunt', hex: '#dc2626', bgClass: 'bg-rose-600' },
    { name: 'Xám Than Đá', hex: '#334155', bgClass: 'bg-slate-700' }
  ];

  // Helper updates
  const updatePersonal = (field, val) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: val }
    }));
  };

  const handleLoadPreset = (key) => {
    if (CV_PRESETS[key]) {
      setCvData(JSON.parse(JSON.stringify(CV_PRESETS[key])));
    }
  };

  const handleReset = () => {
    setCvData({
      personal: {
        fullName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        avatarUrl: '',
        expectedSalary: '',
        availability: ''
      },
      summary: '',
      experiences: [
        {
          id: `exp-${Date.now()}`,
          company: '',
          role: '',
          period: '',
          description: ''
        }
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          school: '',
          degree: '',
          year: ''
        }
      ],
      skills: [],
      languages: [{ name: 'Tiếng Việt', level: 'Bản ngữ' }],
      certifications: [],
      endorsement: ''
    });
  };

  // Add / Remove Experience
  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          company: '',
          role: '',
          period: '',
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (id) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
  };

  const updateExperience = (id, field, val) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    }));
  };

  // Add / Remove Education
  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          school: '',
          degree: '',
          year: ''
        }
      ]
    }));
  };

  const removeEducation = (id) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id)
    }));
  };

  const updateEducation = (id, field, val) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    }));
  };

  // Skills handlers
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = () => {
    if (skillInput.trim() && !cvData.skills.includes(skillInput.trim())) {
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Print CV
  const handlePrint = () => {
    window.print();
  };

  // Copy Summary text for Zalo / Email dispatch
  const handleCopySummary = () => {
    const p = cvData.personal;
    const summaryText = `📋 [FASTHUNT RECRUITMENT] HỒ SƠ ỨNG VIÊN TIÊU BIỂU
━━━━━━━━━━━━━━━━━━━━━━
👤 Họ và tên: ${p.fullName || 'Chưa cập nhật'}
💼 Vị trí: ${p.title || 'Chưa cập nhật'}
📞 Điện thoại: ${p.phone || 'Chưa cập nhật'} | ✉️ Email: ${p.email || 'Chưa cập nhật'}
📍 Khu vực: ${p.location || 'Chưa cập nhật'}
💰 Mức lương kỳ vọng: ${p.expectedSalary || 'Thương lượng'}
⏱️ Thời gian sẵn sàng: ${p.availability || 'Thỏa thuận'}

🎯 TÓM TẮT NĂNG LỰC:
${cvData.summary || 'Kinh nghiệm chuyên môn nổi bật phù hợp yêu cầu doanh nghiệp.'}

🛠️ KỸ NĂNG CHUYÊN MÔN:
${cvData.skills.join(' • ')}

⭐ ĐÁNH GIÁ TỪ FASTHUNT / CTV:
${cvData.endorsement || 'Hồ sơ đã được thẩm định sơ bộ, tác phong chuyên nghiệp.'}
━━━━━━━━━━━━━━━━━━━━━━
🔗 Liên hệ phòng Tuyển Dụng FastHunt để nhận CV đầy đủ & đặt lịch phỏng vấn!`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // 1-Click Save candidate directly into FastHunt System pipeline
  const handleSaveToFastHuntSystem = () => {
    if (!cvData.personal.fullName) {
      alert('Vui lòng nhập họ và tên ứng viên trước khi lưu vào hệ thống.');
      return;
    }

    const matchedJob = jobItems.find(
      (j) => String(j.id) === String(selectedJobId) || String(j.rowIndex) === String(selectedJobId)
    );

    const newCandidate = {
      id: `CAND-${Date.now()}`,
      name: cvData.personal.fullName,
      phone: cvData.personal.phone || 'N/A',
      email: cvData.personal.email || 'N/A',
      position: cvData.personal.title || matchedJob?.title || 'Ứng viên tự do',
      positionCompany: cvData.personal.title || matchedJob?.title || 'Vị trí mới',
      company: matchedJob?.company || 'FastHunt Tuyển Dụng',
      ctvCode: currentCtv?.ctvCode || 'CV-BUILDER',
      desiredSalary: cvData.personal.expectedSalary || matchedJob?.salary || 'Thỏa thuận',
      timestamp: new Date().toLocaleDateString('vi-VN'),
      cvResultRaw: 'Pass CV',
      pvResultRaw: 'Chờ xếp lịch PV',
      interviewDate: '',
      interviewTime: '',
      onboardingDate: '',
      cvUrl: '',
      notes: cvData.endorsement || cvData.summary || 'Hồ sơ được tạo từ Trình Tạo CV FastHunt.'
    };

    onAddCandidateToSystem(newCandidate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CV_${cvData.personal.fullName || 'Ung_Vien'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── TOP HEADER & QUICK TOOLBAR ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Trình Tạo CV Ứng Viên Chuyên Nghiệp
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  MỚI & MIỄN PHÍ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Thiết kế hồ sơ chuẩn ATS & doanh nghiệp, xuất file PDF in ấn và lưu trực tiếp vào danh sách tuyển dụng
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print / PDF Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="In hoặc lưu dạng PDF (Ctrl+P)"
          >
            <Printer className="w-4 h-4 text-blue-500" />
            <span>In / Xuất PDF</span>
          </button>

          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sao chép tóm tắt gửi Zalo / Khách hàng"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-blue-500" />}
            <span>{copiedSummary ? 'Đã Sao Chép!' : 'Copy Gửi Zalo'}</span>
          </button>

          {/* Save directly to FastHunt System */}
          <button
            onClick={handleSaveToFastHuntSystem}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Đã Lưu Vào Hệ Thống!' : 'Lưu Vào CRM Tuyển Dụng'}</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
            title="Tải file dữ liệu JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── TOOLBAR: PRESET SELECTOR & STYLES ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Nạp mẫu nhanh:
          </span>
          <button
            onClick={() => handleLoadPreset('it_developer')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            💻 Lập Trình Viên IT
          </button>
          <button
            onClick={() => handleLoadPreset('sales_manager')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            📈 Quản Lý Kinh Doanh
          </button>
          <button
            onClick={() => handleLoadPreset('hr_recruiter')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
          >
            🎯 Chuyên Viên Tuyển Dụng
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Làm mới
          </button>
        </div>

        {/* Optional Target Job Matcher */}
        {jobItems.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">Ứng tuyển Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => {
                const jId = e.target.value;
                setSelectedJobId(jId);
                const matched = jobItems.find((j) => String(j.id) === String(jId) || String(j.rowIndex) === String(jId));
                if (matched) {
                  updatePersonal('title', matched.title || '');
                  if (matched.salary) updatePersonal('expectedSalary', matched.salary);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium outline-none focus:border-blue-500 max-w-[220px] truncate"
            >
              <option value="">-- Chọn vị trí đang tuyển --</option>
              {jobItems.map((j) => (
                <option key={j.id || j.rowIndex} value={j.id || j.rowIndex}>
                  {j.title} {j.company ? `(${j.company})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Template Style & Color Palette */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Template layout */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">Kiểu mẫu:</span>
            {[
              { id: 'modern', label: 'Hiện Đại' },
              { id: 'classic', label: 'Thanh Lịch' },
              { id: 'ats', label: 'Chuẩn ATS' },
              { id: 'creative', label: 'Sáng Tạo' }
            ].map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setTemplateStyle(tpl.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  templateStyle === tpl.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Color theme dots */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Màu:</span>
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setThemeColor(c.hex)}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer border-2 ${
                  themeColor === c.hex ? 'border-slate-900 dark:border-white scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                } ${c.bgClass}`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE VIEW TOGGLE TABS ── */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'editor'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Biên Tập Thông Tin</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Xem Trước Trang CV</span>
        </button>
      </div>

      {/* ── MAIN WORKSPACE: SPLIT SCREEN (EDITOR ON LEFT, LIVE PREVIEW ON RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT: FORM EDITOR (Columns 1 to 5) ── */}
        <div className={`lg:col-span-5 space-y-5 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
          
          {/* Section 1: Thông tin cá nhân */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-blue-600" />
              <span>1. Thông Tin Ứng Viên</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên ứng viên <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cvData.personal.fullName}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Vị trí / Chức danh ứng tuyển <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cvData.personal.title}
                  onChange={(e) => updatePersonal('title', e.target.value)}
                  placeholder="Ví dụ: Senior Frontend Developer / Trưởng phòng Kinh doanh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={cvData.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="ungvien@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Khu vực sinh sống</label>
                  <input
                    type="text"
                    value={cvData.personal.location}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                    placeholder="TP.HCM / Hà Nội / Đà Nẵng..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mức lương mong muốn</label>
                  <input
                    type="text"
                    value={cvData.personal.expectedSalary}
                    onChange={(e) => updatePersonal('expectedSalary', e.target.value)}
                    placeholder="25.000.000₫ - 30.000.000₫"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Thời gian có thể nhận việc</label>
                <input
                  type="text"
                  value={cvData.personal.availability}
                  onChange={(e) => updatePersonal('availability', e.target.value)}
                  placeholder="Sẵn sàng nhận việc ngay / Báo trước 15 ngày"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Liên kết Portfolio / LinkedIn / GitHub</label>
                <input
                  type="text"
                  value={cvData.personal.website}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  placeholder="linkedin.com/in/ten-ung-vien"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tóm tắt nghề nghiệp */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4 h-4 text-amber-500" />
              <span>2. Tóm Tắt Năng Lực & Mục Tiêu</span>
            </h2>

            <div>
              <textarea
                rows={4}
                value={cvData.summary}
                onChange={(e) => setCvData((prev) => ({ ...prev, summary: e.target.value }))}
                placeholder="Nêu ngắn gọn từ 2-4 câu về số năm kinh nghiệm, thế mạnh vượt trội và giá trị ứng viên mang lại cho doanh nghiệp..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Kinh nghiệm làm việc */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>3. Kinh Nghiệm Làm Việc ({cvData.experiences.length})</span>
              </h2>
              <button
                onClick={addExperience}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>

            <div className="space-y-4">
              {cvData.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
                      Vị trí #{idx + 1}
                    </span>
                    {cvData.experiences.length > 1 && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Xóa vị trí này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Tên công ty / Doanh nghiệp"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        placeholder="Chức danh đảm nhiệm"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      placeholder="Thời gian (VD: 01/2022 - Hiện tại)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="• Thành tựu hoặc nhiệm vụ quan trọng (sử dụng dấu gạch đầu dòng để rõ ràng)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Kỹ năng chuyên môn */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span>4. Kỹ Năng & Chuyên Môn</span>
            </h2>

            {/* Input Tag */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Nhập kỹ năng (VD: React, B2B Sales, IELTS 7.5...)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Thêm
              </button>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {cvData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500 text-slate-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Học vấn & Đánh giá FastHunt */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>5. Học Vấn & Đánh Giá Giới Thiệu</span>
            </h2>

            {/* Education item */}
            {cvData.education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                  placeholder="Tên trường đại học / cao đẳng"
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                  placeholder="Niên khóa (2018 - 2022)"
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Chuyên ngành / Bằng cấp"
                  className="sm:col-span-3 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                />
              </div>
            ))}

            {/* Endorsement */}
            <div className="pt-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1">
                ⭐ Nhận xét & Đề cử từ CTV / FastHunt Recruiter
              </label>
              <textarea
                rows={3}
                value={cvData.endorsement}
                onChange={(e) => setCvData((prev) => ({ ...prev, endorsement: e.target.value }))}
                placeholder="Ghi chú đánh giá độ phù hợp, kỹ năng mềm và tác phong của ứng viên khi gửi sang phía khách hàng..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: LIVE PREVIEW & PRINTABLE A4 CANVAS (Columns 6 to 12) ── */}
        <div className={`lg:col-span-7 ${activeTab === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-20 space-y-3">
            
            <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                Bản xem trước A4 chuẩn in ấn
              </span>
              <span>Kích thước tỉ lệ chuẩn 210mm x 297mm</span>
            </div>

            {/* ── A4 CV DOCUMENT CONTAINER (Target for Print & Live Review) ── */}
            <div
              ref={previewRef}
              id="cv-printable-document"
              className="cv-print-area bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-10 font-sans transition-all overflow-hidden"
              style={{ minHeight: '842px' }}
            >
              {/* Header Branding watermark */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 text-[11px] text-slate-400 font-mono tracking-wider">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="font-bold text-slate-700">FASTHUNT RECRUITMENT VERIFIED PROFILE</span>
                </div>
                <span>MÃ HỒ SƠ: {cvData.personal.fullName ? `FH-${cvData.personal.fullName.replace(/\s+/g, '').slice(0, 6).toUpperCase()}` : 'FH-CANDIDATE'}</span>
              </div>

              {/* ── TEMPLATE VARIANT 1: MODERN TECH (Default) ── */}
              {templateStyle === 'modern' && (
                <div className="space-y-6">
                  {/* Personal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div className="space-y-1">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {cvData.personal.fullName || 'Họ Tên Ứng Viên'}
                      </h1>
                      <p
                        className="text-base sm:text-lg font-bold"
                        style={{ color: themeColor }}
                      >
                        {cvData.personal.title || 'Vị Trí Ứng Tuyển'}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 sm:text-right shrink-0">
                      {cvData.personal.phone && (
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span>{cvData.personal.phone}</span>
                          <Phone className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                      {cvData.personal.email && (
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span>{cvData.personal.email}</span>
                          <Mail className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                      {cvData.personal.location && (
                        <div className="flex items-center sm:justify-end gap-1.5">
                          <span>{cvData.personal.location}</span>
                          <MapPin className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                      {cvData.personal.website && (
                        <div className="flex items-center sm:justify-end gap-1.5 text-blue-600 font-medium">
                          <span>{cvData.personal.website}</span>
                          <Globe className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Highlights Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Lương kỳ vọng</span>
                      <p className="font-extrabold text-slate-900 mt-0.5">{cvData.personal.expectedSalary || 'Thỏa thuận'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Thời gian nhận việc</span>
                      <p className="font-bold text-slate-800 mt-0.5">{cvData.personal.availability || 'Sẵn sàng'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Tình trạng hồ sơ</span>
                      <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã xác thực</span>
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  {cvData.summary && (
                    <div className="space-y-1.5">
                      <h2
                        className="text-xs font-black uppercase tracking-wider flex items-center gap-2"
                        style={{ color: themeColor }}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Tóm Tắt Năng Lực & Kinh Nghiệm</span>
                      </h2>
                      <p className="text-xs text-slate-700 leading-relaxed text-justify">
                        {cvData.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  <div className="space-y-3">
                    <h2
                      className="text-xs font-black uppercase tracking-wider flex items-center gap-2"
                      style={{ color: themeColor }}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Kinh Nghiệm Làm Việc</span>
                    </h2>

                    <div className="space-y-4">
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200 space-y-1">
                          <div
                            className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                            style={{ backgroundColor: themeColor }}
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-900 text-sm">{exp.role || 'Chức danh'}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{exp.period}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-700">{exp.company || 'Doanh nghiệp'}</div>
                          {exp.description && (
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-0.5">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Grid */}
                  {cvData.skills.length > 0 && (
                    <div className="space-y-2">
                      <h2
                        className="text-xs font-black uppercase tracking-wider flex items-center gap-2"
                        style={{ color: themeColor }}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Kỹ Năng Chuyên Môn</span>
                      </h2>
                      <div className="flex flex-wrap gap-1.5">
                        {cvData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education & Languages Split */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div className="space-y-2">
                      <h2
                        className="text-xs font-black uppercase tracking-wider flex items-center gap-2"
                        style={{ color: themeColor }}
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Học Vấn & Bằng Cấp</span>
                      </h2>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="text-xs space-y-0.5">
                          <div className="font-bold text-slate-900">{edu.school}</div>
                          <div className="text-slate-600">{edu.degree}</div>
                          <div className="text-slate-400 font-mono text-[10px]">{edu.year}</div>
                        </div>
                      ))}
                    </div>

                    {cvData.languages.length > 0 && (
                      <div className="space-y-2">
                        <h2
                          className="text-xs font-black uppercase tracking-wider flex items-center gap-2"
                          style={{ color: themeColor }}
                        >
                          <Languages className="w-3.5 h-3.5" />
                          <span>Ngôn Ngữ</span>
                        </h2>
                        {cvData.languages.map((lang, i) => (
                          <div key={i} className="text-xs flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{lang.name}:</span>
                            <span className="text-slate-600 font-medium">{lang.level}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FastHunt Endorsement Box */}
                  {cvData.endorsement && (
                    <div
                      className="p-3.5 rounded-xl text-xs space-y-1 border"
                      style={{
                        backgroundColor: `${themeColor}0a`,
                        borderColor: `${themeColor}30`
                      }}
                    >
                      <div
                        className="font-extrabold flex items-center gap-1.5"
                        style={{ color: themeColor }}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Đánh Giá Giới Thiệu Từ Đội Ngũ FastHunt</span>
                      </div>
                      <p className="text-slate-700 italic text-[11px] leading-relaxed">
                        "{cvData.endorsement}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── TEMPLATE VARIANT 2: CLASSIC EXECUTIVE ── */}
              {templateStyle === 'classic' && (
                <div className="space-y-5">
                  <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wider uppercase text-slate-900">
                      {cvData.personal.fullName || 'Họ Tên Ứng Viên'}
                    </h1>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-600">
                      {cvData.personal.title || 'Vị Trí Ứng Tuyển'}
                    </p>
                    <div className="pt-2 text-xs text-slate-600 flex flex-wrap justify-center gap-3">
                      {cvData.personal.phone && <span>📞 {cvData.personal.phone}</span>}
                      {cvData.personal.email && <span>✉️ {cvData.personal.email}</span>}
                      {cvData.personal.location && <span>📍 {cvData.personal.location}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  {cvData.summary && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Tuyên Bố Nghề Nghiệp
                      </h2>
                      <p className="text-xs text-slate-700 leading-relaxed pt-1">{cvData.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  <div className="space-y-3">
                    <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                      Kinh Nghiệm Chuyên Môn
                    </h2>
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.company} — <span className="font-normal italic">{exp.role}</span></span>
                          <span className="font-mono text-[11px]">{exp.period}</span>
                        </div>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Education & Skills */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Học Vấn
                      </h2>
                      {cvData.education.map((edu) => (
                        <div key={edu.id} className="text-xs pt-1 space-y-0.5">
                          <p className="font-bold text-slate-900">{edu.school}</p>
                          <p className="text-slate-600">{edu.degree} ({edu.year})</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h2 className="text-xs font-serif font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                        Kỹ Năng Cốt Lõi
                      </h2>
                      <div className="flex flex-wrap gap-1 pt-1 text-xs text-slate-700">
                        {cvData.skills.join(' • ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TEMPLATE VARIANT 3: ATS-FRIENDLY (Single Column) ── */}
              {templateStyle === 'ats' && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="border-b border-slate-900 pb-3">
                    <h1 className="text-2xl font-bold uppercase text-slate-900">{cvData.personal.fullName}</h1>
                    <p className="font-semibold text-slate-700">{cvData.personal.title}</p>
                    <p className="text-slate-500 pt-0.5">
                      {cvData.personal.phone} | {cvData.personal.email} | {cvData.personal.location}
                    </p>
                  </div>

                  <div>
                    <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                      Tóm tắt năng lực (Professional Summary)
                    </h2>
                    <p className="pt-1 text-slate-700 leading-relaxed">{cvData.summary}</p>
                  </div>

                  <div>
                    <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                      Kinh nghiệm làm việc (Work Experience)
                    </h2>
                    <div className="space-y-2.5 pt-1">
                      {cvData.experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>{exp.role} | {exp.company}</span>
                            <span className="font-normal">{exp.period}</span>
                          </div>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                      Kỹ năng cốt lõi (Skills)
                    </h2>
                    <p className="pt-1 text-slate-700">{cvData.skills.join(', ')}</p>
                  </div>

                  <div>
                    <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                      Học vấn (Education)
                    </h2>
                    <div className="pt-1">
                      {cvData.education.map((edu) => (
                        <p key={edu.id} className="text-slate-700">
                          <strong>{edu.school}</strong> – {edu.degree} ({edu.year})
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── TEMPLATE VARIANT 4: CREATIVE COLOR ACCENT ── */}
              {templateStyle === 'creative' && (
                <div className="space-y-5">
                  <div
                    className="p-6 rounded-2xl text-white space-y-2 shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${themeColor}, #0f172a)` }}
                  >
                    <span className="text-[10px] uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Hồ Sơ Năng Lực
                    </span>
                    <h1 className="text-3xl font-black">{cvData.personal.fullName}</h1>
                    <p className="text-sm font-semibold opacity-90">{cvData.personal.title}</p>
                    <div className="pt-2 text-xs flex flex-wrap gap-3 opacity-80 border-t border-white/20">
                      <span>📱 {cvData.personal.phone}</span>
                      <span>✉️ {cvData.personal.email}</span>
                      <span>📍 {cvData.personal.location}</span>
                    </div>
                  </div>

                  {cvData.summary && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      {cvData.summary}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h2 className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>Hành Trình Sự Nghiệp</span>
                    </h2>
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="p-3.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex justify-between font-extrabold text-slate-900">
                          <span>{exp.role}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{exp.period}</span>
                        </div>
                        <p className="font-semibold text-blue-600">{exp.company}</p>
                        <p className="text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xs font-black uppercase text-slate-900">Kỹ Năng Chuyên Sâu</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {cvData.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                          style={{ backgroundColor: themeColor }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Stamp */}
              <div className="mt-10 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-mono">
                Tạo bởi Hệ Thống FastHunt Recruitment Agent • Bảo mật thông tin ứng viên • www.fasthunt.vn
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
