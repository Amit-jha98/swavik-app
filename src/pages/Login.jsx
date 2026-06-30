import { MagicLinkForm } from '@/components/auth/MagicLinkForm';

export function Login() {
  return (
    <main className="grid min-h-svh place-items-center bg-ink-950 px-6 text-cream-50">
      <div className="w-full max-w-md">
        <MagicLinkForm />
      </div>
    </main>
  );
}
