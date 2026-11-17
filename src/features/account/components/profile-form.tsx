"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, ChevronDown, Check, Loader2, X } from "lucide-react";
import { useProfile } from "../hooks/use-profile";
import { getClientUpdateUserProfile } from "../lib/apis/account.api";
import type { IUser } from "@/shared/lib/types/user";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
];

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Invalid phone number"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialUser?: IUser;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
  const { data: user = initialUser } = useProfile({ initialData: initialUser });

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  // Email Change Popover state
  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);
  const emailPopoverRef = useRef<HTMLDivElement | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (emailPopoverRef.current && !emailPopoverRef.current.contains(event.target as Node)) {
        setIsEmailPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || "",
        }
      : undefined,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      await getClientUpdateUserProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      });
      setFeedbackMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setFeedbackMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Row 1: First name & Last name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="block text-xs font-mono text-muted-foreground select-none">
            First name
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstName")}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="lastName" className="block text-xs font-mono text-muted-foreground select-none">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastName")}
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Username (Strictly disabled as requested) */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-xs font-mono text-muted-foreground select-none">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={user?.username || ""}
          disabled
          className="w-full px-4 py-2.5 rounded-lg border border-border/80 bg-slate-100 text-sm font-mono text-muted-foreground cursor-not-allowed select-none opacity-90"
        />
      </div>

      {/* Row 3: Email (Strictly readOnly as requested, with Popover on Change button) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between relative" ref={emailPopoverRef}>
          <label htmlFor="email" className="block text-xs font-mono text-muted-foreground select-none">
            Email
          </label>

          {/* Change Button Trigger */}
          <button
            type="button"
            onClick={() => setIsEmailPopoverOpen((prev) => !prev)}
            className="text-xs text-primary hover:underline font-mono inline-flex items-center gap-1 cursor-pointer select-none"
          >
            <Pencil className="size-3" />
            <span>Change</span>
          </button>

          {/* Change Email Popover Dropdown */}
          {isEmailPopoverOpen && (
            <div className="absolute inset-e-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-border bg-popover p-4 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-1">
              <div className="flex items-center justify-between pb-2 border-b border-border/70 mb-3">
                <span className="text-xs font-bold text-foreground font-mono">Change Email</span>
                <button
                  type="button"
                  onClick={() => setIsEmailPopoverOpen(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                Email verification will be required to update your registered email address.
              </p>
              <div className="pt-3">
                <input
                  type="email"
                  placeholder="new-email@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-border text-xs text-foreground bg-white focus:outline-hidden focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEmailPopoverOpen(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Change email request initiated.");
                    setIsEmailPopoverOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-md text-xs font-mono bg-primary text-white font-medium hover:bg-primary-hover shadow-2xs"
                >
                  Send OTP
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Read-Only Email Input */}
        <input
          id="email"
          type="email"
          readOnly
          {...register("email")}
          className="w-full px-4 py-2.5 rounded-lg border border-border/80 bg-slate-50/70 text-sm text-foreground focus:outline-hidden cursor-default select-all"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Row 4: Phone with Country Code Selector */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-xs font-mono text-muted-foreground select-none">
          Phone
        </label>
        <div className="relative flex items-center rounded-lg border border-border bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
          {/* Country Selector Dropdown */}
          <div className="relative shrink-0" ref={countryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
              aria-label="Select country code"
              className="flex items-center gap-1.5 px-3 py-2.5 border-e border-border text-xs font-mono text-foreground hover:bg-slate-50 transition-colors select-none cursor-pointer"
            >
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span>{selectedCountry.code}({selectedCountry.dialCode})</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute inset-s-0 top-full mt-1 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg z-50 animate-in fade-in-50">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsCountryDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                      selectedCountry.code === c.code
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.name}</span>
                    </div>
                    {selectedCountry.code === c.code && <Check className="size-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone Number Input */}
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="1012345678"
            className="flex-1 px-4 py-2.5 bg-transparent text-sm text-foreground focus:outline-hidden"
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      {/* Bottom Action Buttons: Delete My Account & Save Changes */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
        <button
          type="button"
          onClick={() => {
            if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              alert("Account deletion request submitted.");
            }
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-destructive bg-red-50 hover:bg-red-100 transition-colors cursor-pointer select-none"
        >
          Delete My Account
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
