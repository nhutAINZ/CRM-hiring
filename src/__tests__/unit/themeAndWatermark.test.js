import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Unit Tests: Frontend Design, Royal Blue Theme, Dark Mode & Watermark Suppression', () => {
  const rootDir = process.cwd();
  const indexPath = path.join(rootDir, 'index.html');
  const cssPath = path.join(rootDir, 'src', 'index.css');
  const appPath = path.join(rootDir, 'src', 'App.jsx');
  const headerPath = path.join(rootDir, 'src', 'components', 'Header.jsx');
  const sidebarPath = path.join(rootDir, 'src', 'components', 'Sidebar.jsx');
  const ctvDashboardPath = path.join(rootDir, 'src', 'components', 'CtvDashboardView.jsx');

  it('should verify index.html contains zero-flicker dark mode script and anti-watermark observer', () => {
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Zero-flicker dark mode script check
    assert.ok(indexContent.includes('localStorage.getItem(\'fasthunt_theme\')'), 'index.html must check fasthunt_theme');
    assert.ok(indexContent.includes('document.documentElement.classList.add(\'dark\')'), 'index.html must set dark class');
    
    // Anti-watermark MutationObserver check
    assert.ok(indexContent.includes('removeWatermarks'), 'index.html must contain removeWatermarks logic');
    assert.ok(indexContent.includes('netlify-badge'), 'index.html must target Netlify badge');
    assert.ok(indexContent.includes('MutationObserver'), 'index.html must use MutationObserver to catch injected badges');
  });

  it('should verify src/index.css contains strict watermark suppression rules', () => {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    assert.ok(cssContent.includes('#netlify-badge'), 'index.css must hide #netlify-badge');
    assert.ok(cssContent.includes('.netlify-badge'), 'index.css must hide .netlify-badge');
    assert.ok(cssContent.includes('[data-netlify-badge]'), 'index.css must hide [data-netlify-badge]');
    assert.ok(cssContent.includes('netlify-drawer'), 'index.css must hide netlify-drawer');
    assert.ok(cssContent.includes('display: none !important'), 'index.css must use display none important');
  });

  it('should verify DTCG tokens are harmonized to Royal Blue and Crisp White', () => {
    const cssContent = fs.readFileSync(cssPath, 'utf-8');
    
    assert.ok(cssContent.includes('--color-brand-primary:    #2563eb'), 'Primary brand token must be Royal Blue #2563eb');
    assert.ok(cssContent.includes('--color-brand-secondary:  #1d4ed8'), 'Secondary brand token must be #1d4ed8');
    assert.ok(cssContent.includes('--font-sans: \'Be Vietnam Pro\''), 'Typography must prioritize Be Vietnam Pro');
    assert.ok(cssContent.includes('--color-surface-base:      #090d16'), 'Dark mode base surface must be deep navy #090d16');
  });

  it('should verify App.jsx synchronizes darkMode with localStorage and html classList', () => {
    const appContent = fs.readFileSync(appPath, 'utf-8');
    
    assert.ok(appContent.includes('localStorage.getItem(\'fasthunt_theme\')'), 'App.jsx must read stored theme');
    assert.ok(appContent.includes('localStorage.setItem(\'fasthunt_theme\''), 'App.jsx must persist theme in localStorage');
    assert.ok(appContent.includes('document.documentElement.classList.add(\'dark\')'), 'App.jsx must add dark class');
    assert.ok(appContent.includes('document.documentElement.classList.remove(\'dark\')'), 'App.jsx must remove dark class');
    assert.ok(appContent.includes('darkMode={darkMode}'), 'App.jsx must pass darkMode to subcomponents');
  });

  it('should verify Header.jsx and Sidebar.jsx both provide Dark Mode toggles', () => {
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
    
    assert.ok(headerContent.includes('setDarkMode(!darkMode)'), 'Header must toggle dark mode');
    assert.ok(headerContent.includes('Giao diện Sáng'), 'Header must show mode label/title');
    assert.ok(sidebarContent.includes('setDarkMode(!darkMode)'), 'Sidebar must toggle dark mode');
    assert.ok(sidebarContent.includes('Giao diện Tối'), 'Sidebar must show mode label/title');
  });

  it('should verify CtvDashboardView has Royal Blue hero banner and clean white styling', () => {
    const ctvContent = fs.readFileSync(ctvDashboardPath, 'utf-8');
    
    assert.ok(ctvContent.includes('from-blue-600 via-blue-700 to-blue-900'), 'Hero banner must use Royal Blue gradient');
    assert.ok(ctvContent.includes('bg-white text-blue-700'), 'CTA button must be crisp white with royal blue text');
    assert.ok(ctvContent.includes('Hồ Sơ Ứng Viên & Tiến Độ Hoa Hồng Của Tôi'), 'Candidate tracker title must be present');
  });
});
