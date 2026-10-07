import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginScreen() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your bookings and rentals.">
      <LoginForm />
    </AuthLayout>
  );
}
