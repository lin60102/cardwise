import type { AppleSignInPayload } from "../services/api";

export interface AppleSignInButtonProps {
  loading?: boolean;
  separatorLabel: string;
  onSuccess: (payload: AppleSignInPayload) => Promise<void>;
  onError: (error: unknown) => void;
}

export function AppleSignInButton(_props: AppleSignInButtonProps) {
  return null;
}

