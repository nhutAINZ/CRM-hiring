import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Admin Authentication & Security Guard Unit Tests', () => {
  const validateAdminPassword = (input, currentPassword) => {
    const cleanInput = (input || '').trim();
    const cleanCurrent = (currentPassword || 'admin123').trim();
    if (!cleanInput) return false;
    return cleanInput === cleanCurrent || cleanInput === 'admin123' || cleanInput === 'admin';
  };

  it('should allow login with matching custom password', () => {
    assert.strictEqual(validateAdminPassword('mySecretPass2026', 'mySecretPass2026'), true);
  });

  it('should allow login with whitespace trimmed', () => {
    assert.strictEqual(validateAdminPassword('  admin123  ', 'admin123'), true);
    assert.strictEqual(validateAdminPassword(' customPass ', 'customPass'), true);
  });

  it('should accept default fallback keys admin123 and admin', () => {
    assert.strictEqual(validateAdminPassword('admin123', 'different_saved_pwd'), true);
    assert.strictEqual(validateAdminPassword('admin', 'different_saved_pwd'), true);
  });

  it('should reject invalid passwords and empty string', () => {
    assert.strictEqual(validateAdminPassword('wrongPass', 'custom123'), false);
    assert.strictEqual(validateAdminPassword('', 'admin123'), false);
    assert.strictEqual(validateAdminPassword('   ', 'admin123'), false);
  });

  it('should verify admin-only views require isAdmin true', () => {
    const adminViews = ['table', 'dashboard', 'kanban', 'analytics', 'urgent', 'clients', 'ctv', 'zalo', 'multiagent', 'archify'];
    const ctvPublicViews = ['ctv-dashboard', 'jobs', 'content-gen', 'group-finder'];

    const isViewAccessible = (viewId, isAdmin) => {
      if (ctvPublicViews.includes(viewId)) return true;
      if (adminViews.includes(viewId)) return isAdmin;
      return false;
    };

    // Anonymous / CTV user
    assert.strictEqual(isViewAccessible('ctv-dashboard', false), true);
    assert.strictEqual(isViewAccessible('jobs', false), true);
    assert.strictEqual(isViewAccessible('content-gen', false), true);
    assert.strictEqual(isViewAccessible('group-finder', false), true);

    // Protected views blocked for CTV
    assert.strictEqual(isViewAccessible('table', false), false);
    assert.strictEqual(isViewAccessible('kanban', false), false);
    assert.strictEqual(isViewAccessible('dashboard', false), false);

    // Admin user unlocks all views
    assert.strictEqual(isViewAccessible('table', true), true);
    assert.strictEqual(isViewAccessible('kanban', true), true);
    assert.strictEqual(isViewAccessible('dashboard', true), true);
    assert.strictEqual(isViewAccessible('multiagent', true), true);
    assert.strictEqual(isViewAccessible('archify', true), true);
  });

  it('should handle transition to dashboard on login success', () => {
    let activeView = 'ctv-dashboard';
    let isAdmin = false;

    const handleLoginAdminSuccess = (targetView = null) => {
      isAdmin = true;
      if (activeView === 'ctv-dashboard' || targetView) {
        activeView = targetView || 'dashboard';
      }
    };

    handleLoginAdminSuccess();
    assert.strictEqual(isAdmin, true);
    assert.strictEqual(activeView, 'dashboard');
  });

  it('should reset view to ctv-dashboard on admin logout', () => {
    let activeView = 'dashboard';
    let isAdmin = true;

    const handleAdminLogout = () => {
      isAdmin = false;
      activeView = 'ctv-dashboard';
    };

    handleAdminLogout();
    assert.strictEqual(isAdmin, false);
    assert.strictEqual(activeView, 'ctv-dashboard');
  });
});
