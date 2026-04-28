"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createCard } from "@/lib/services/card.service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function completeOnboardingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const addVisaCard = formData.get("addVisaCard") === "on";

  if (!phoneNumber) {
    return { error: "Phone number is required" };
  }

  try {
    // 1. Update user profile
    await db
      .update(users)
      .set({
        name: name || session.user.name,
        phone_number: phoneNumber,
      })
      .where(eq(users.id, session.user.id));

    // 2. Add card if requested
    if (addVisaCard) {
      const cardNumber = formData.get("cardNumber") as string;
      const expiryDate = formData.get("expiryDate") as string;
      const cardholderName = formData.get("cardholderName") as string;

      if (cardNumber && expiryDate) {
        const last4 = cardNumber.slice(-4) || "0000";
        const isVisa = cardNumber.startsWith("4");
        
        await createCard({
          userId: session.user.id,
          cardType: isVisa ? "Visa" : "Mastercard",
          last4,
          label: "رئيسية",
          cardholderName,
          expiryDate,
        });
      }
    }

  } catch (error) {
    console.error("Onboarding error:", error);
    return { error: "Failed to complete onboarding" };
  }

  // Redirect to dashboard on success
  redirect("/dashboard");
}
