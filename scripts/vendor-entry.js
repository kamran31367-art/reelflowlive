import * as yaml from 'js-yaml';
import mammoth from 'mammoth';
import JSZip from 'jszip';
import { parseGIF, decompressFrames } from 'gifuct-js';
import exifr from 'exifr';
import { format as sqlFormat } from 'sql-formatter';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { CronExpressionParser } from 'cron-parser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

window.CT_VENDOR = {
  yaml,
  mammoth,
  JSZip,
  parseGIF,
  decompressFrames,
  exifr,
  sqlFormat,
  parsePhoneNumberFromString,
  CronExpressionParser,
  marked,
  DOMPurify
};
