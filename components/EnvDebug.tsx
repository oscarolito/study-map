'use client';

import { config, validateConfig } from '@/lib/config';

export function EnvDebug() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const validation = validateConfig();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <div>Firebase API Key: {config.firebase.apiKey ? '✅ Set' : '❌ Missing'}</div>
      <div>Firebase Auth Domain: {config.firebase.authDomain ? '✅ Set' : '❌ Missing'}</div>
      <div>Supabase URL: {config.supabase.url ? '✅ Set' : '❌ Missing'}</div>
      <div>Supabase Anon Key: {config.supabase.anonKey ? '✅ Set' : '❌ Missing'}</div>
      <div>Stripe Key: {config.stripe.publishableKey ? '✅ Set' : '❌ Missing'}</div>
      <div className="mt-2 text-gray-300">
        Node Env: {process.env.NODE_ENV}
      </div>
      <div className="mt-2">
        Status: {validation.isValid ? '✅ All Good' : '❌ Issues'}
      </div>
      {!validation.isValid && (
        <div className="mt-1 text-red-300 text-xs">
          Missing: {validation.missing.join(', ')}
        </div>
      )}
    </div>
  );
}