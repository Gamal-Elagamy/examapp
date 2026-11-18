"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Pencil, ChevronDown, Check, Loader2, Camera } from "lucide-react";
import { useProfile } from "../hooks/use-profile";
import { getClientUpdateUserProfile } from "../lib/apis/account.api";
import { accountKeys } from "../lib/apis/account.key";
import { getClientUploadFile } from "@/shared/lib/apis/upload.api";
import { ChangeEmailDialog } from "./change-email-dialog";
import { DeleteAccountDialog } from "./delete-account-dialog";
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
  const queryClient = useQueryClient();
  const { update: updateSession } = useSession();
  const { data: user = initialUser } = useProfile({ initialData: initialUser });

  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  // Email Change Modal Dialog state
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);

  // Delete Account Modal Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Profile Photo Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Derive photo during render: local temporary selection -> uploaded temp URL -> saved user profile photo
  const displayPhoto = localPreviewUrl || uploadedPhotoUrl || user?.profilePhoto || null;

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
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

  // Handle Photo Selection & Upload via /api/upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(localUrl);

    setIsUploadingPhoto(true);
    setFeedbackMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await getClientUploadFile(formData);
      setUploadedPhotoUrl(res.url);
      setFeedbackMessage({
        type: "success",
        text: "Photo uploaded! Click Save Changes to update your account.",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo";
      setFeedbackMessage({ type: "error", text: msg });
      setLocalPreviewUrl(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    setFeedbackMessage(null);
    try {
      let formattedPhone = values.phone.trim();
      if (formattedPhone.startsWith("+20")) {
        formattedPhone = "0" + formattedPhone.slice(3).trim();
      } else if (/^[1-9][0-9]{9}$/.test(formattedPhone)) {
        formattedPhone = "0" + formattedPhone;
      }

      const payload = await getClientUpdateUserProfile({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: formattedPhone,
        ...(uploadedPhotoUrl ? { profilePhoto: uploadedPhotoUrl } : {}),
      });

      // Update query cache immediately so both Profile page and AppSidebar update instantly
      if (payload?.user) {
        queryClient.setQueryData(accountKeys.profile(), payload.user);
        setLocalPreviewUrl(null);
        setUploadedPhotoUrl(null);
        updateSession?.({ user: payload.user });
      }

      queryClient.invalidateQueries({ queryKey: accountKeys.profile() });
      setFeedbackMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setFeedbackMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChangeSuccess = (updatedUser: IUser) => {
    queryClient.setQueryData(accountKeys.profile(), updatedUser);
    queryClient.invalidateQueries({ queryKey: accountKeys.profile() });
    setValue("email", updatedUser.email);
    updateSession?.({ user: updatedUser });
    setFeedbackMessage({
      type: "success",
      text: "Email updated successfully!",
    });
  };

  return (
    <>
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

      {/* Profile Photo Uploader Section */}
      <div className="flex items-center gap-5 pb-5 border-b border-border/60">
        <div className="relative group">
          <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden flex items-center justify-center text-primary font-bold text-xl shadow-xs">
            {displayPhoto ? (
              <Image
                src={displayPhoto}
                alt="Profile avatar"
                width={80}
                height={80}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <span>{(user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase()}</span>
            )}
          </div>

          {/* Uploading Spinner */}
          {isUploadingPhoto && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}

          {/* Camera Upload Badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPhoto}
            aria-label="Change profile photo"
            className="absolute bottom-0 inset-e-0 size-7 rounded-full bg-primary text-white border-2 border-white shadow-xs flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Camera className="size-3.5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="space-y-0.5">
          <span className="text-sm font-bold text-foreground block">Profile Photo</span>
          <p className="text-xs text-muted-foreground font-mono">
            Click the camera icon to upload a new picture.
          </p>
        </div>
      </div>

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

      {/* Row 2: Username (Strictly disabled) */}
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

      {/* Row 3: Email (Strictly readOnly with Modal Dialog on Change button) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="email" className="block text-xs font-mono text-muted-foreground select-none">
            Email
          </label>

          {/* Change Button Trigger */}
          <button
            type="button"
            onClick={() => setIsChangeEmailModalOpen(true)}
            className="text-xs text-primary hover:underline font-mono inline-flex items-center gap-1 cursor-pointer select-none"
          >
            <Pencil className="size-3" />
            <span>Change</span>
          </button>
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
          onClick={() => setIsDeleteDialogOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-destructive bg-red-50 hover:bg-red-100 transition-colors cursor-pointer select-none"
        >
          Delete My Account
        </button>

        <button
          type="submit"
          disabled={isSaving || isUploadingPhoto}
          className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>

    {/* Change Email Multi-Step Modal Dialog rendered outside the form */}
    {isChangeEmailModalOpen && (
      <ChangeEmailDialog
        isOpen={isChangeEmailModalOpen}
        onClose={() => setIsChangeEmailModalOpen(false)}
        onSuccess={handleEmailChangeSuccess}
        currentEmail={user?.email}
      />
    )}

    {/* Delete Account Modal Dialog */}
    {isDeleteDialogOpen && (
      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    )}
  </>
);
}
