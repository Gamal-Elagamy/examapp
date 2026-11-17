"use client";

import { useState } from "react";
import { StepProgress } from "./step-progress";
import { StepEmail } from "./step-email";
import { StepOtp } from "./step-otp";
import { StepUserInfo } from "./step-user-info";
import { StepPassword } from "./step-password";
import { useOtpTimer } from "../hooks/use-otp-timer";
import { useRegisterMutation } from "../hooks/use-register-mutation";
import type { UserInfoStepData, PasswordStepData } from "../lib/schemas/register.schema";

interface RegistrationState {
  email: string;
  code: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
}

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shouldFocusEmail, setShouldFocusEmail] = useState<boolean>(false);
  const [formData, setFormData] = useState<RegistrationState>({
    email: "",
    code: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
  });

  const { remainingSeconds, canResend, startTimer } = useOtpTimer(60);
  const { mutate: register, isPending: isRegistering } = useRegisterMutation();

  function handleEmailNext(email: string) {
    setFormData((prev) => ({ ...prev, email }));
    setShouldFocusEmail(false);
    setCurrentStep(2);
  }

  function handleEditEmail() {
    setShouldFocusEmail(true);
    setCurrentStep(1);
  }

  function handleOtpNext(code: string) {
    setFormData((prev) => ({ ...prev, code }));
    setCurrentStep(3);
  }

  function handleUserInfoNext(values: UserInfoStepData) {
    setFormData((prev) => ({ ...prev, ...values }));
    setCurrentStep(4);
  }

  function handlePasswordComplete(values: PasswordStepData) {
    register({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      phone: formData.phone,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
        Create Account
      </h2>

      {/* 4-Step Progress Indicator */}
      <StepProgress currentStep={currentStep} />

      {/* Multi-Step Screens */}
      {currentStep === 1 && (
        <StepEmail
          initialEmail={formData.email}
          autoFocusInput={shouldFocusEmail}
          onNext={handleEmailNext}
          onTimerStart={() => startTimer(60)}
        />
      )}

      {currentStep === 2 && (
        <StepOtp
          email={formData.email}
          remainingSeconds={remainingSeconds}
          canResend={canResend}
          onResendCode={() => startTimer(60)}
          onEditEmail={handleEditEmail}
          onNext={handleOtpNext}
        />
      )}

      {currentStep === 3 && (
        <StepUserInfo
          initialValues={formData}
          onNext={handleUserInfoNext}
        />
      )}

      {currentStep === 4 && (
        <StepPassword
          isPending={isRegistering}
          onComplete={handlePasswordComplete}
        />
      )}
    </div>
  );
}
