import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_CONFIG,
  getCsvUrl,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  getJobSheetViewUrl,
  getIntergreatSheetViewUrl,
  JOB_SHEET_URL,
  CTV_SHEET_URL,
  INTERGREAT_SHEET_URL
} from '../../services/sheetsService.js';
import { cleanPhoneNumber } from '../../services/zaloOaService.js';


describe('Unit Tests: sheetsService', () => {

  it('should have valid default config IDs including Job sheet', () => {
    assert.ok(DEFAULT_CONFIG.sheet1Id);
    assert.ok(DEFAULT_CONFIG.sheet1Gid);
    assert.ok(DEFAULT_CONFIG.sheet2Id);
    assert.strictEqual(DEFAULT_CONFIG.jobSheetId, '1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko');
    assert.strictEqual(DEFAULT_CONFIG.jobSheetGid, '0');
  });

  it('should construct correct GViz CSV URL', () => {
    const url = getCsvUrl('test_sheet_id', '12345');
    assert.strictEqual(
      url,
      'https://docs.google.com/spreadsheets/d/test_sheet_id/gviz/tq?tqx=out:csv&gid=12345'
    );
  });

  it('should construct correct Sheet2 View URL', () => {
    const url = getSheet2ViewUrl('custom_sheet2_id');
    assert.strictEqual(
      url,
      'https://docs.google.com/spreadsheets/d/custom_sheet2_id/edit'
    );
  });

  it('should construct correct Job Sheet View URL', () => {
    const defaultUrl = getJobSheetViewUrl();
    assert.strictEqual(
      defaultUrl,
      'https://docs.google.com/spreadsheets/d/1PJUSclHhVYLvoYTzmwkwpzsRfPOqODs0RDrvhW99Uko/edit?gid=0#gid=0'
    );

    const customUrl = getJobSheetViewUrl('custom_job_id', '999');
    assert.strictEqual(
      customUrl,
      'https://docs.google.com/spreadsheets/d/custom_job_id/edit?gid=999#gid=999'
    );
  });

  it('should construct correct Intergreat Client Sheet View URL', () => {
    const defaultUrl = getIntergreatSheetViewUrl();
    assert.strictEqual(
      defaultUrl,
      'https://docs.google.com/spreadsheets/d/1Krhpgtd-l-4DK0GwIhnntatbhakC5GYHKK0jVc5Pij4/edit?gid=0#gid=0'
    );

    const customUrl = getIntergreatSheetViewUrl('custom_intergreat_id', '0');
    assert.strictEqual(
      customUrl,
      'https://docs.google.com/spreadsheets/d/custom_intergreat_id/edit?gid=0#gid=0'
    );
  });

  it('should verify cleanPhoneNumber utility for direct Zalo chats', () => {
    assert.strictEqual(cleanPhoneNumber('0901234567'), '0901234567');
    assert.strictEqual(cleanPhoneNumber('+84901234567'), '0901234567');
    assert.strictEqual(cleanPhoneNumber('84901234567'), '0901234567');
    assert.strictEqual(cleanPhoneNumber('090.123.4567'), '0901234567');
  });
});

