"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createSubscription,
  cancelSubscription,
  getSubscriptionByUser,
  checkIsPremium,
} from "@/lib/services/subscription.service";

export async function subscribeAction(plan: "monthly" | "yearly") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const subscription = await createSubscription({
      userId: session.user.id,
      plan,
    });
    revalidateTag("subscriptions");
    return { success: true, subscription };
  } catch (err) {
    return { error: "Failed to create subscription" };
  }
}

export async function cancelSubscriptionAction(subscriptionId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const subscription = await cancelSubscription(subscriptionId);
    revalidateTag("subscriptions");
    return { success: true, subscription };
  } catch (err) {
    return { error: "Failed to cancel subscription" };
  }
}

export async function getSubscriptionAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", subscription: null };

  try {
    const subscription = await getSubscriptionByUser(session.user.id);
    return { subscription };
  } catch (err) {
    return { error: "Failed to fetch subscription", subscription: null };
  }
}

export async function checkPremiumAction() {
  const session = await auth();
  if (!session?.user?.id) return { isPremium: false };

  try {
    const isPremium = await checkIsPremium(session.user.id);
    return { isPremium };
  } catch (err) {
    return { isPremium: false };
  }
}
