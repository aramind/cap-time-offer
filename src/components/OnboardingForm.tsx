"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const employeeSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(55, { message: "First name cannot exceed 55 characters" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(55, { message: "Last name cannot exceed 55 characters" }),

  email: z
    .email({ message: "Invalid email" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  department: z.string().optional(),

  invitationCode: z
    .string()
    .length(6, { message: "Invitation code must be 6 characters long" }),
});

const adminSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(55, { message: "First name cannot exceed 55 characters" }),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(55, { message: "Last name cannot exceed 55 characters" }),

  email: z
    .email({ message: "Invalid email" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  companyName: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name cannot exceed 100 characters" }),

  companyWebsite: z
    .url({ message: "Invalid website URL" })
    .optional()
    .or(z.literal("")),

  companyLogo: z
    .url({ message: "Invalid URL for company logo" })
    .optional()
    .or(z.literal("")),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;
type AdminFormValues = z.infer<typeof adminSchema>;

interface OnboardingFormProps {
  userEmail: string;
  firstName: string;
  lastName: string;
}

const OnboardingForm = ({
  userEmail,
  firstName,
  lastName,
}: OnboardingFormProps) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [accountType, setAccountType] = useState<"admin" | "employee">(
    "employee"
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const employeeForm = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName,
      lastName,
      email: userEmail,
      department: "",
      invitationCode: "",
    },
  });

  const adminForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName,
      lastName,
      email: userEmail,
      companyName: "",
      companyWebsite: "",
      companyLogo: "",
    },
  });

  const handleEmployeeSubmit = async (data: EmployeeFormValues) => {
    if (!user) {
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // await responser from server action
    } catch (error) {
      // setError
    }
  };

  const handleAdminSubmit = async (data: AdminFormValues) => {
    if (!user) {
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      // await responser from server action
    } catch (error) {
      // setError
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Complete your account setup
        </CardTitle>
        <CardDescription>
          Welcome to TimeOffer! Let&apos;s get you onboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup
              defaultValue="employee"
              value={accountType}
              onValueChange={(value) =>
                setAccountType(value as "admin" | "employee")
              }
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="employee"
                  id="employee"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="employee"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground p-4"
                >
                  <span>Employee</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="admin"
                  id="admin"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="admin"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground p-4"
                >
                  <span>Business Admin</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
