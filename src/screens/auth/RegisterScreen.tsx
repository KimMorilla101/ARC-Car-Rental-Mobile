import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  return (
    <AuthLayout backLabel="Back to Login" title="Create Account" subtitle="Join ARC Ride and start your journey today.">
      <RegisterForm />
    </AuthLayout>
  );
}
