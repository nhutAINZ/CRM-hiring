import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  DEFAULT_CONFIG,
  getCsvUrl,
  getSheet2ViewUrl,
  getCtvSheetViewUrl,
  getJobSheetViewUrl,
  JOB_SHEET_URL,
  CTV_SHEET_URL
} from '../../services/sheetsService.js';

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
});
