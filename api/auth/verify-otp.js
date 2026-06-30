import { json, readJson, requireMethod } from '../_utils/http.js';
import { hashOtp, otpCache } from './send-otp.js';

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) {
    return;
  }

  const { email, code } = await readJson(req);
  const key = String(email || '').toLowerCase();
  const record = otpCache.get(key);

  if (!record || record.expiresAt < Date.now()) {
    otpCache.delete(key);
    json(res, 401, { error: 'The access code has expired. Please request a new one.' });
    return;
  }

  if (record.codeHash !== hashOtp(String(code || ''))) {
    json(res, 401, { error: 'Invalid access code.' });
    return;
  }

  otpCache.delete(key);
  json(res, 200, {
    ok: true,
    message: 'OTP verified. Firebase custom token issuance will be completed in Phase 4.'
  });
}
