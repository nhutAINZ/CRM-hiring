import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Award, Briefcase, TrendingUp, Users } from 'lucide-react';
import { getCtvLeaderboard, getPositionBreakdown } from '../utils/dataNormalizer';

export default function AnalyticsCharts({ candidates, metrics, darkMode }) {
  const ctvData = getCtvLeaderboard(candidates);
  const positionData = getPositionBreakdown(candidates);

  // Pie chart data for CV
  const cvPieData = [
    { name: 'PASS CV', value: metrics.cvPass, color: '#10b981' },
    { name: 'FAIL CV', value: metrics.cvFail, color: '#f43f5e' },
    { name: 'CHỜ PHẢN HỒI', value: metrics.cvPending, color: '#f59e0b' },
    { name: 'KHÁC', value: metrics.cvOther, color: '#94a3b8' }
  ].filter((item) => item.value > 0);

  // Pie chart data for PV
  const pvPieData = [
    { name: 'PASS PV', value: metrics.pvPass, color: '#06b6d4' },
    { name: 'FAIL / HỦY', value: metrics.pvFail, color: '#e11d48' },
    { name: 'CHỜ PV / KẾT QUẢ', value: metrics.pvPending, color: '#fbbf24' }
  ].filter((item) => item.value > 0);

  const tooltipBg = darkMode ? '#0b1121' : '#ffffff';
  const tooltipBorder = darkMode ? 'rgba(255,255,255,0.15)' : '#e2e8f0';
  const tooltipText = darkMode ? '#f9fafb' : '#111827';

  return (
    <div className="space-y-6">
      {/* Top Row: Donut Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. CV & PV Status Breakdown Donut Charts */}
        <div className="mengto-card mengto-card-emerald p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tỉ Lệ Thẩm Duyệt CV & Phỏng Vấn
              </h3>
              <p className="text-[11px] text-slate-400">Phân bổ kết quả các vòng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[220px]">
            {/* CV Donut */}
            <div className="flex flex-col items-center h-full">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Pass CV: {metrics.cvPassRate}%</span>
              <div className="w-full h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cvPieData.length > 0 ? cvPieData : [{ name: 'Không có dữ liệu', value: 1, color: '#64748b' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {cvPieData.map((entry, index) => (
                        <Cell key={`cv-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        color: tooltipText,
                        borderRadius: '16px',
                        fontSize: '12px',
                        boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5)',
                        borderWidth: '1px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.cvPassRate}%</span>
                </div>
              </div>
            </div>

            {/* PV Donut */}
            <div className="flex flex-col items-center h-full">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Pass PV: {metrics.pvPassRate}%</span>
              <div className="w-full h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pvPieData.length > 0 ? pvPieData : [{ name: 'Chưa có PV', value: 1, color: '#64748b' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pvPieData.map((entry, index) => (
                        <Cell key={`pv-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder,
                        color: tooltipText,
                        borderRadius: '16px',
                        fontSize: '12px',
                        boxShadow: '0 12px 32px -4px rgba(0,0,0,0.5)',
                        borderWidth: '1px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">{metrics.pvPassRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            <span className="flex items-center gap-1 font-bold text-emerald-500">● Pass CV ({metrics.cvPass})</span>
            <span className="flex items-center gap-1 font-bold text-rose-500">● Fail CV ({metrics.cvFail})</span>
            <span className="flex items-center gap-1 font-bold text-cyan-500">● Pass PV ({metrics.pvPass})</span>
          </div>
        </div>

        {/* 2. Top CTV Leaderboard Bar Chart */}
        <div className="mengto-card mengto-card-purple p-5 shadow-sm flex flex-col justify-between lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bảng Xếp Hạng Hiệu Suất Cộng Tác Viên (Top CTV)
                </h3>
                <p className="text-[11px] text-slate-400">Số lượng hồ sơ nộp & Tỉ lệ Pass CV</p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-500/30 px-3 py-1 rounded-xl">
              {ctvData.length} CTV hoạt động
            </span>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ctvData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} opacity={0.3} />
                <XAxis dataKey="code" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: tooltipBorder,
                    color: tooltipText,
                    borderRadius: '16px',
                    fontSize: '12px',
                    borderWidth: '1px'
                  }}
                  formatter={(val, name) => [
                    `${val} ${name === 'passRate' ? '%' : 'hồ sơ'}`,
                    name === 'total' ? 'Tổng nộp' : name === 'cvPass' ? 'Pass CV' : 'Pass PV'
                  ]}
                />
                <Bar dataKey="total" name="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cvPass" name="cvPass" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pvPass" name="pvPass" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            <span className="flex items-center gap-1.5 font-bold text-indigo-500">■ Tổng hồ sơ nộp</span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-500">■ Đạt kết quả CV</span>
            <span className="flex items-center gap-1.5 font-bold text-cyan-500">■ Đạt phỏng vấn</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Positions Breakdown Grid */}
      <div className="mengto-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500 border border-purple-500/30">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Phân Bổ Vị Trí & Nhu Cầu Tuyển Dụng Doanh Nghiệp
            </h3>
            <p className="text-[11px] text-slate-400">Số lượng ứng viên quan tâm theo từng đầu việc</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {positionData.map((pos) => {
            const passPct = pos.count > 0 ? Math.round((pos.passCount / pos.count) * 100) : 0;
            return (
              <div
                key={pos.name}
                className="mengto-card rounded-xl p-3.5 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                    {pos.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-purple-100 dark:bg-purple-950/80 border border-purple-500/30 text-purple-700 dark:text-purple-300">
                    {pos.count} UV
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                    <span>Pass CV: {pos.passCount} UV</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{passPct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${passPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
