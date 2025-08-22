"use server";

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { success } from "zod";

export async function createEmployee(
  department: string | undefined,
  clerkId: string,
  invitationCode: string
) {
  try {
    const user = await (await clerkClient()).users.getUser(clerkId);

    if (!user || !user.firstName || !user.lastName) {
      throw new Error("User not found");
    }

    const code = await prisma.code.findFirst({
      where: {
        code: invitationCode,
        used: false,
      },
    });

    if (!code) {
      throw new Error("Invalid invitation code");
    }

    await (
      await clerkClient()
    ).users.updateUserMetadata(user.id, {
      publicMetadata: {
        onboardingCompleted: true,
        role: "EMPLOYEE",
        companyId: code.companyId,
        // companyName: code.companyName,
      },
    });

    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: "EMPLOYEE",
        department: department || null,
        companyId: code.companyId,
      },
    });

    await prisma.code.update({
      where: {
        id: code.id,
      },
      data: {
        used: true,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}
