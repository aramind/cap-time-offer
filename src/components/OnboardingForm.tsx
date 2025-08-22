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
import { Separator } from "@radix-ui/react-separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { createEmployee } from "@/lib/actions/onboarding";

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
      const response = await createEmployee(
        data.department || undefined,
        user.id,
        data.invitationCode
      );

      if (response.success) {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      // setError
      console.error(`Error creating employee: ${error}`);
      setError(
        error instanceof Error ? error.message : "Failed to complete onboarding"
      );
    } finally {
      setIsSubmitting(false);
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
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground p-4",
                    accountType === "employee" &&
                      "bg-accent text-accent-foreground"
                  )}
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
          <Separator />
          {accountType === "employee" ? (
            <Form {...employeeForm}>
              <form
                onSubmit={employeeForm.handleSubmit(handleEmployeeSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={employeeForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employeeForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={employeeForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled className="bg-gray-100" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={employeeForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Engineering, Sales, etc"
                          className="bg-gray-100"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={employeeForm.control}
                  name="invitationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invitation Code</FormLabel>
                      {/* <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter the 6-digit code"
                          className="bg-gray-100"
                          maxLength={6}
                          pattern="[0-9]{6}"
                        />
                      </FormControl> */}
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter the 6-digit code"
                          className="bg-gray-100"
                          maxLength={6} // prevents typing more than 6 chars
                          onChange={(e) => {
                            // Only digits allowed
                            const digitsOnly = e.target.value.replace(
                              /\D/g,
                              ""
                            );
                            field.onChange(digitsOnly);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the 6-digi invitation code provided by your
                        company admin .
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing" : "Complete setup"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...adminForm}>
              <form
                onSubmit={adminForm.handleSubmit(handleAdminSubmit)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <h3 className="text-md font-medium mb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={adminForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="bg-gray-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled
                              className="bg-gray-100"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={adminForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-md font-medium mb-2">
                      Company Information
                    </h3>
                    <FormField
                      control={adminForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Company Name"
                              className="bg-gray-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="companyWebsite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Company Website"
                              className="bg-gray-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="companyLogo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Logo (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Company Logo URL"
                              className="bg-gray-100"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing" : "Complete setup"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingForm;
