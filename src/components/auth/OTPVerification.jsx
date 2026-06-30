import { useState } from 'react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { useAuth } from '@/context/AuthContext.jsx';

export function OTPVerification({ email }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const { loginWithEmail } = useAuth();

  async function verifyOtp(event) {
    event.preventDefault();
    setStatus('verifying');
    setError('');

    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(payload.error || 'Unable to verify this access code.');
      setStatus('idle');
      return;
    }

    loginWithEmail(email);
    setStatus('verified');
  }

  return (
    <form className="grid gap-4" onSubmit={verifyOtp}>
      <p className="text-sm leading-6 text-cream-100/62">Enter the private access code sent to {email}.</p>
      <input
        className="rounded-md border border-white/10 bg-ink-900 p-4 text-cream-50"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="6-digit code"
        required
      />
      <LuxuryButton disabled={status === 'verifying' || code.length < 6}>
        {status === 'verifying' ? 'Verifying...' : 'Verify Access'}
      </LuxuryButton>
      {status === 'verified' ? <p className="text-sm text-gold-300">Access verified. Welcome to Swavik.</p> : null}
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
