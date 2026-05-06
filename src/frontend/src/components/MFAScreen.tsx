import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function MFAScreen({
  isDemoMode,
  onVerified,
  onCancel,
}: {
  isDemoMode: boolean;
  onVerified: () => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (code.length < 6) {
      setError("Please enter a 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isDemoMode) {
        onVerified();
      } else {
        if (code === "123456") {
          onVerified();
        } else {
          setError("Invalid code. Please try again.");
          setCode("");
          setLoading(false);
        }
      }
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background px-4"
      data-ocid="mfa.page"
    >
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="border border-border bg-card p-8 space-y-6">
          {/* Icon + Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 mx-auto">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Two-Factor Verification
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter the 6-digit verification code to continue.
              </p>
            </div>
          </div>

          {/* Demo hint — prominent */}
          {isDemoMode && (
            <div className="px-4 py-3 bg-primary/10 border border-primary/30 text-foreground text-sm font-medium text-center">
              <strong>Demo tip:</strong> enter any 6-digit code to continue
            </div>
          )}
          {!isDemoMode && (
            <div className="px-4 py-3 bg-primary/10 border border-primary/20 text-foreground text-sm font-medium text-center">
              <strong>Demo tip:</strong> use code <strong>123456</strong>
            </div>
          )}

          {/* OTP Input */}
          <div className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => {
                setCode(val);
                setError("");
              }}
              data-ocid="mfa.input"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p
                className="text-xs text-destructive font-medium text-center"
                data-ocid="mfa.error_state"
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              className="w-full"
              data-ocid="mfa.submit_button"
              onClick={handleVerify}
              disabled={loading || code.length < 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
            <button
              type="button"
              data-ocid="mfa.cancel_button"
              onClick={onCancel}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1 underline-offset-2 hover:underline"
            >
              Back to login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} MedUnite
        </p>
      </div>
    </div>
  );
}
