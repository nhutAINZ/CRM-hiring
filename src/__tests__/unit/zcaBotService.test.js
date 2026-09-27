import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatZcaJobPitch,
  formatGroupBroadcastPost,
  formatPersonalMemberPitch,
  resolveSpintax,
  calculateAntiSpamDelay,
  generateZcaNodeRunnerCode,
  DEFAULT_ZCA_CONFIG,
  FASTHUNT_GROUP_MEMBERS,
  FASTHUNT_SUBMIT_FORM_URL,
  FASTHUNT_WEB_URL,
  ZCA_DOCS_URL
} from '../../services/zcaBotService.js';
import { CTV_SUBMIT_CV_FORM_URL } from '../../services/sheetsService.js';

describe('Unit Tests: FastHunt Zalo Admin Agent & zca-js Integration', () => {
  it('should verify Google Form URL for candidate submission matches across services', () => {
    assert.ok(CTV_SUBMIT_CV_FORM_URL);
    assert.strictEqual(
      CTV_SUBMIT_CV_FORM_URL,
      'https://docs.google.com/forms/d/e/1FAIpQLSesf4DX0FgtE46bcWjgxjwGu7bOSFSu76pLCXG5zFMbxY2Bvw/viewform'
    );
    assert.strictEqual(CTV_SUBMIT_CV_FORM_URL, FASTHUNT_SUBMIT_FORM_URL);
  });

  it('should format Group Broadcast post matching Admin FastHunt screenshot style (Chức năng 1)', () => {
    const mockJobs = [
      {
        title: 'Junior UA',
        salary: '13-15 triệu',
        warrantyPeriod: '60 ngày',
        bonus: 'hh 35% lương uv',
        linkJd: 'https://docs.google.com/document/d/1sd7PoULYpz9F7g927X__OhC20Mr0VoeS/edit'
      },
      {
        title: 'Middle UA',
        salary: '15-25 triệu',
        warrantyPeriod: '60 ngày',
        bonus: 'hh 40% lương uv',
        linkJd: 'https://docs.google.com/document/u/0/d/1ZOHr82yS6uMeU1jx1biaFLejX5utpGHZ/edit'
      },
      {
        title: 'Video Editor & Motion Graphic Specialist',
        salary: '11-15 triệu',
        warrantyPeriod: '60 ngày',
        bonus: 'hh 35% lương uv',
        linkJd: 'https://docs.google.com/document/u/0/d/1kTrxQabYRX1oFFfOCnBgPzSHUe7ySRDk/edit'
      }
    ];

    const post = formatGroupBroadcastPost(mockJobs, '@All Team ơi mình mới lên job Và các job gấp thưởng ngay 50k cv đi pv:');

    assert.ok(post.includes('@All'));
    assert.ok(post.includes('1/Junior UA lương 13-15 triệu bh 60 ngày hh 35% lương uv'));
    assert.ok(post.includes('2/Middle UA lương 15-25 triệu bh 60 ngày hh 40% lương uv'));
    assert.ok(post.includes('3/Video Editor & Motion Graphic Specialist'));
    assert.ok(post.includes('50 cá 1 cv đủ đk đi pv') || post.includes('50k'));
    assert.ok(post.includes('https://crmhiring.netlify.app/#ctv-dashboard'));
    assert.ok(post.includes(FASTHUNT_SUBMIT_FORM_URL));
  });

  it('should format 1-1 Member Pitch with Spintax and candidate submission link (Chức năng 2)', () => {
    const member = { name: 'Áii Thư', phone: '0912345601' };
    const job = {
      title: 'Senior Frontend React / Next.js',
      salary: '25-45 triệu',
      bonus: 'hh 35% lương uv'
    };

    const pitch = formatPersonalMemberPitch(member, job);

    assert.ok(pitch.includes('Áii Thư'));
    assert.ok(pitch.includes('Senior Frontend React / Next.js'));
    assert.ok(pitch.includes('25-45 triệu'));
    assert.ok(pitch.includes(FASTHUNT_SUBMIT_FORM_URL));
  });

  it('should resolve Spintax patterns correctly into random variations', () => {
    const template = '{Chào|Hi|Hello} {name}, bên mình {tuyển gấp|cần tuyển} {job}!';
    const resolved = resolveSpintax(template, { name: 'Bảo', job: 'Sales B2B' });

    assert.ok(resolved.includes('Bảo'));
    assert.ok(resolved.includes('Sales B2B'));
    assert.ok(['Chào', 'Hi', 'Hello'].some(greeting => resolved.includes(greeting)));
    assert.ok(['tuyển gấp', 'cần tuyển'].some(intent => resolved.includes(intent)));
  });

  it('should calculate Anti-Spam delay within expected range with Jitter', () => {
    const delay = calculateAntiSpamDelay(15, 35, true);
    assert.ok(delay.seconds >= 5 && delay.seconds <= 45);
    assert.strictEqual(delay.ms, delay.seconds * 1000);
  });

  it('should verify FastHunt 196 member list contains screenshot contacts', () => {
    assert.ok(FASTHUNT_GROUP_MEMBERS.length >= 20);
    const memberNames = FASTHUNT_GROUP_MEMBERS.map(m => m.name);
    assert.ok(memberNames.includes('Áii Thư'));
    assert.ok(memberNames.includes('Anh Quân Bvg'));
    assert.ok(memberNames.includes('Ash Tourmaline Yi'));
    assert.ok(memberNames.includes('Bảo'));
    assert.ok(memberNames.includes('Bùi Thị Hoa'));
    assert.ok(memberNames.includes('Đặng Hoàng Oanh'));
    assert.ok(memberNames.includes('Đạt'));
    assert.ok(memberNames.includes('Đinh Hoàng Quân'));
    assert.ok(memberNames.includes('Đỗ Việt Anh'));
    assert.ok(memberNames.includes('Thảoo'));
  });

  it('should format ZCA single job pitch containing Job details and Google Form link', () => {
    const mockJob = {
      title: 'Senior Node.js & React Developer',
      company: 'Tech Solutions VN',
      location: 'Hà Nội',
      salary: '35.000.000 - 50.000.000 VNĐ',
      bonus: '3.000.000 VNĐ',
      headcount: 3,
      warrantyPeriod: '60 Ngày',
      requirements: 'Ít nhất 3 năm kinh nghiệm Nodejs, Express, MongoDB'
    };

    const pitch = formatZcaJobPitch(mockJob, 'Ưu tiên ứng viên pv ngay', '0901234567');
    assert.ok(pitch.includes('SENIOR NODE.JS & REACT DEVELOPER'));
    assert.ok(pitch.includes('Tech Solutions VN'));
    assert.ok(pitch.includes('3.000.000 VNĐ'));
    assert.ok(pitch.includes(CTV_SUBMIT_CV_FORM_URL));
    assert.ok(pitch.includes('zca-js Engine'));
    assert.ok(pitch.includes('0901234567'));
  });

  it('should generate valid standalone Node.js runner script with zca-js import', () => {
    const script = generateZcaNodeRunnerCode(DEFAULT_ZCA_CONFIG);
    assert.ok(script.includes('import { Zalo, ThreadType } from "zca-js"'));
    assert.ok(script.includes(ZCA_DOCS_URL));
    assert.ok(script.includes(CTV_SUBMIT_CV_FORM_URL));
    assert.ok(script.includes('runRecruitmentBot'));
  });
});
