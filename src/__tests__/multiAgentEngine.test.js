import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  AGENT_REGISTRY,
  calculateCandidateFit,
  runSupervisorSwarm,
  runBatchCandidateScreening,
  runCandidateDebate,
  runPipelineSlaAudit
} from '../services/multiAgentEngine.js';

describe('Multi-Agent Swarm Engine Test Suite', () => {
  it('should have 6 registered agents in AGENT_REGISTRY', () => {
    assert.strictEqual(Object.keys(AGENT_REGISTRY).length, 6);
    assert.ok(AGENT_REGISTRY.supervisor);
    assert.ok(AGENT_REGISTRY.screener);
    assert.ok(AGENT_REGISTRY.scheduler);
    assert.ok(AGENT_REGISTRY.auditor);
    assert.ok(AGENT_REGISTRY.ctv_partner);
    assert.ok(AGENT_REGISTRY.copilot);
  });

  it('calculateCandidateFit computes high score for matching job position and skills', () => {
    const candidate = {
      name: 'Nguyễn Văn A',
      position: 'Senior React Developer',
      experience: '5 năm kinh nghiệm Frontend React Nodejs',
      cvResult: 'Pass'
    };
    const job = {
      title: 'Senior React Developer',
      requirements: '3+ years React, Nodejs'
    };

    const fit = calculateCandidateFit(candidate, job);
    assert.ok(fit.score >= 80, `Expected score >= 80, got ${fit.score}`);
    assert.ok(fit.strengths.length > 0);
  });

  it('runPipelineSlaAudit identifies pending CVs and calculates compliance rate', () => {
    const candidates = [
      { id: '1', name: 'Nguyen A', cvResult: 'Chờ duyệt', pvResult: '' },
      { id: '2', name: 'Tran B', cvResult: 'Pass', pvResult: 'Pass' },
      { id: '3', name: 'Le C', cvResult: 'Pass', pvResult: 'Chờ PV' }
    ];

    const audit = runPipelineSlaAudit(candidates, []);
    assert.strictEqual(audit.totalChecked, 3);
    assert.strictEqual(audit.criticalCount, 1);
    assert.strictEqual(audit.warningCount, 1);
    assert.ok(audit.bottlenecks.length >= 2);
  });

  it('runBatchCandidateScreening sorts candidates by score descending', () => {
    const job = { title: 'Java Developer' };
    const candidates = [
      { id: '1', name: 'Nguyen A', position: 'Designer', cvResult: 'Loại' },
      { id: '2', name: 'Tran B', position: 'Senior Java Developer', experience: '5 năm', cvResult: 'Pass' }
    ];

    const results = runBatchCandidateScreening(job, candidates);
    assert.strictEqual(results.length, 2);
    assert.ok(results[0].score >= results[1].score);
    assert.strictEqual(results[0].candidateName, 'Tran B');
  });

  it('runCandidateDebate executes debate steps between Screener, Auditor, and Supervisor', async () => {
    const candidate = { name: 'Candidate X', position: 'Nodejs Dev', cvResult: 'Chờ' };
    const job = { title: 'Nodejs Dev' };

    const debate = await runCandidateDebate(candidate, job);
    assert.ok(debate.steps.length >= 3);
    assert.ok(debate.verdictTitle.length > 0);
  });
});
