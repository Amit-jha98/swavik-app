import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { json, readJson, requireMethod } from '../_utils/http.js';

const otpCache = globalThis.__swavikOtpCache || new Map();
globalThis.__swavikOtpCache = otpCache;

export default async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) {
    return;
  }

  try {
    const { email } = await readJson(req);
    if (!isEmail(email)) {
      json(res, 400, { error: 'A valid email address is required.' });
      return;
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpCache.set(email.toLowerCase(), { codeHash: hashOtp(code), expiresAt });

    if (hasSmtpConfig()) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Your SWAVIK private access code',
        text: `Your SWAVIK private access code is ${code}. It expires in 10 minutes.`
      });
    }

    json(res, 200, {
      ok: true,
      devCode: process.env.NODE_ENV === 'development' && !hasSmtpConfig() ? code : undefined
    });
  } catch (error) {
    json(res, 500, {
      error: 'Unable to send OTP.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function hashOtp(code) {
  return crypto.createHash('sha256').update(`${code}:${process.env.SMTP_PASS || 'local'}`).digest('hex');
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM);
}

export { hashOtp, otpCache };
