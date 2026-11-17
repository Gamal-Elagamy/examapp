"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import {
  userInfoStepSchema,
  type UserInfoStepData,
} from "../lib/schemas/register.schema";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "AE", name: "UAE", dialCode: "+971", flag: "🇦🇪" },
  { code: "KW", name: "Kuwait", dialCode: "+965", flag: "🇰🇼" },
  { code: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { code: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { code: "US", name: "USA", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "UK", dialCode: "+44", flag: "🇬🇧" },
];

interface StepUserInfoProps {
  initialValues: Partial<UserInfoStepData>;
  onNext: (data: UserInfoStepData) => void;
}

export function StepUserInfo({ initialValues, onNext }: StepUserInfoProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<UserInfoStepData>({
    resolver: zodResolver(userInfoStepSchema),
    defaultValues: {
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      username: initialValues.username || "",
      phone: initialValues.phone || "",
    },
  });

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSubmit(values: UserInfoStepData) {
    onNext(values);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-primary">
          Tell us more about you
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-foreground">
                    First name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmed" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Last name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Abdullah" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />
          </div>

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-foreground">
                  Username <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="user123" autoComplete="username" {...field} />
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          {/* Phone with Multi-Country Selector (Default Egypt) */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-sm font-medium text-foreground">
                  Phone <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                      {/* Country Selector Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-muted/40 hover:bg-muted/70 border-e border-input text-xs font-medium text-foreground select-none shrink-0 transition-colors cursor-pointer"
                        aria-label="Select country code"
                      >
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}({selectedCountry.dialCode})</span>
                        <ChevronDown className="size-3 text-muted-foreground" />
                      </button>

                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="1012345678"
                        className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        {...field}
                      />
                    </div>

                    {/* Country Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute inset-s-0 top-full mt-1.5 z-50 w-56 rounded-md border border-border bg-popover shadow-md py-1 max-h-48 overflow-y-auto">
                        {COUNTRIES.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs text-start hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer ${
                              selectedCountry.code === country.code
                                ? "bg-accent/50 font-semibold text-primary"
                                : "text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-base leading-none">{country.flag}</span>
                              <span>{country.name}</span>
                            </span>
                            <span className="text-muted-foreground">{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-accent/60 hover:bg-accent border border-primary/20 text-primary font-medium py-2.5 rounded-md text-sm transition-colors mt-2 cursor-pointer"
          >
            Next &gt;
          </Button>
        </form>
      </Form>
    </div>
  );
}
