import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default function ForgotPasswordScreen() {
  return (
    <AuthLayout backLabel="Back to Login" title="Reset Password" subtitle="Enter the email you use for ARC Ride and we will send you a reset link.">
      <PasswordResetForm />
    </AuthLayout>
  );
}
