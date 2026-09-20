import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_9ROUTER_CONFIG,
  PRESET_9ROUTER_ENDPOINTS,
  POPULAR_9ROUTER_MODELS,
  normalize9RouterUrl,
  get9RouterConfig,
  save9RouterConfig,
  test9RouterConnection,
  call9RouterChat
} from '../services/nineRouterService.js';

describe('9Router AI Gateway Service Test Suite', () => {
  it('should verify DEFAULT_9ROUTER_CONFIG constants and defaults', () => {
    assert.strictEqual(DEFAULT_9ROUTER_CONFIG.enabled, true);
    assert.strictEqual(DEFAULT_9ROUTER_CONFIG.endpoint, 'http://localhost:20128/v1');
    assert.strictEqual(DEFAULT_9ROUTER_CONFIG.model, 'auto');
    assert.strictEqual(DEFAULT_9ROUTER_CONFIG.tokenSaver, true);
    assert.strictEqual(DEFAULT_9ROUTER_CONFIG.autoFailover, true);
  });

  it('should verify preset endpoints cover local 20128, 127.0.0.1, and OpenRouter', () => {
    assert.ok(PRESET_9ROUTER_ENDPOINTS.length >= 4);
    const ids = PRESET_9ROUTER_ENDPOINTS.map(p => p.id);
    assert.ok(ids.includes('local_20128'));
    assert.ok(ids.includes('local_127'));
    assert.ok(ids.includes('openrouter'));
  });

  it('should verify popular models include gemini, gpt-4o, claude, deepseek', () => {
    const modelIds = POPULAR_9ROUTER_MODELS.map(m => m.id);
    assert.ok(modelIds.includes('auto'));
    assert.ok(modelIds.includes('gpt-4o'));
    assert.ok(modelIds.includes('claude-3-5-sonnet'));
    assert.ok(modelIds.includes('gemini-2.5-flash'));
    assert.ok(modelIds.includes('deepseek-chat'));
  });

  it('normalize9RouterUrl formats base URLs correctly', () => {
    assert.strictEqual(normalize9RouterUrl(''), 'http://localhost:20128/v1');
    assert.strictEqual(normalize9RouterUrl('http://localhost:20128'), 'http://localhost:20128/v1');
    assert.strictEqual(normalize9RouterUrl('http://localhost:20128/'), 'http://localhost:20128/v1');
    assert.strictEqual(normalize9RouterUrl('http://127.0.0.1:20128/v1'), 'http://127.0.0.1:20128/v1');
    assert.strictEqual(normalize9RouterUrl('https://openrouter.ai/api/v1'), 'https://openrouter.ai/api/v1');
  });

  it('test9RouterConnection handles network failures gracefully with detailed error message', async () => {
    // Testing non-existent port should return structured failure object without crashing
    const result = await test9RouterConnection({
      endpoint: 'http://127.0.0.1:59999/v1',
      apiKey: 'test-key'
    });

    assert.strictEqual(typeof result, 'object');
    assert.strictEqual(result.success, false);
    assert.ok(typeof result.latency === 'number');
    assert.ok(result.message.length > 0);
  });
});
