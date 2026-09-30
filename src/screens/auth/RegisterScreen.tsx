import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  return (
    <AuthLayout backLabel="Back" title="Create your account" subtitle="Join ARC Ride and make your next trip feel effortless.">
      <RegisterForm />
    </AuthLayout>
  );
}
