import { useRouter } from 'expo-router';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  const router = useRouter();
  return (
    // Register can be opened from Welcome or from Login (which replaces itself), so "back" would not
    // always reach Login. Open Login directly instead.
    <AuthLayout backLabel="Back to Login" onBack={() => router.replace('/login')} title="Create Account" subtitle="Join ARC Ride and start your journey today.">
      <RegisterForm />
    </AuthLayout>
  );
}
