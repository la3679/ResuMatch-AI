import { Lock, LogIn } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface RequireAuthPromptProps {
  title?: string;
  description?: string;
}

/** Shown in place of auth-only content when the user is signed out. */
export function RequireAuthPrompt({
  title = 'Sign in to continue',
  description = 'Sign in with Google to save and revisit your analyses, applications, and cover letters.',
}: RequireAuthPromptProps) {
  const { signIn } = useAuth();
  const { notify } = useToast();

  const handleSignIn = async () => {
    try {
      await signIn();
      notify('Signed in successfully.', 'success');
    } catch {
      notify('Sign-in was cancelled or failed.', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-slate-200 bg-white">
      <div className="p-4 rounded-2xl bg-brand-50 text-brand-600 mb-4">
        <Lock className="w-8 h-8" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-md">{description}</p>
      <Button className="mt-6" leftIcon={<LogIn className="w-4 h-4" />} onClick={handleSignIn}>
        Sign in with Google
      </Button>
    </div>
  );
}
