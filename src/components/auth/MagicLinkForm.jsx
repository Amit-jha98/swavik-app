import { useState } from 'react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { OTPVerification } from './OTPVerification';

export function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  async function sendOtp(event) {
    event.preventDefault();
    setStatus('sending');
    setError('');
    setDevCode('');

    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || 'Unable to send the access code.');
      setStatus('idle');
      return;
    }

    setDevCode(payload.devCode || '');
    setStatus('sent');
  }

  return (
    <div className="rounded-md border border-white/10 bg-ink-900 p-6 shadow-velvet">
      <p className="text-xs uppercase tracking-[0.32em] text-gold-300">Private login</p>
      <h1 className="mt-3 font-display text-3xl text-cream-50">Access your Swavik account.</h1>
      <form className="mt-6 grid gap-4" onSubmit={sendOtp}>
        <input
          className="rounded-md border border-white/10 bg-ink-950 p-4 text-cream-50"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="private@email.com"
          required
        />
        <LuxuryButton disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Send Another Code' : 'Send Private Access Code'}
        </LuxuryButton>
        {status === 'sent' ? <p className="text-sm text-gold-300">Check your inbox for the SWAVIK access code.</p> : null}
        {devCode ? (
          <p className="rounded-md border border-gold-500/30 bg-ink-950 p-3 text-sm text-cream-100/70">
            Development code: <span className="font-semibold text-gold-300">{devCode}</span>
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
      </form>
      {status === 'sent' ? (
        <div className="mt-6 border-t border-white/10 pt-6">
          <OTPVerification email={email} />
        </div>
      ) : null}
    </div>
  );
}
