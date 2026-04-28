"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createReceivePreference,
  updateReceivePreference,
  deleteReceivePreference,
  getReceivePreferencesByUser,
} from "@/lib/services/receive-preference.service";

export async function addReceivePreferenceAction(data: {
  method: string;
  iban?: string;
  phone?: string;
  accountName?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const preference = await createReceivePreference({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("receive-preferences");
    return { success: true, preference };
  } catch (err) {
    return { error: "Failed to add receive preference" };
  }
}

export async function updateReceivePreferenceAction(
  id: string,
  data: { method?: string; iban?: string; phone?: string; accountName?: string }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const preference = await updateReceivePreference(id, data);
    revalidateTag("receive-preferences");
    return { success: true, preference };
  } catch (err) {
    return { error: "Failed to update receive preference" };
  }
}

export async function deleteReceivePreferenceAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const preference = await deleteReceivePreference(id);
    revalidateTag("receive-preferences");
    return { success: true, preference };
  } catch (err) {
    return { error: "Failed to delete receive preference" };
  }
}

export async function getReceivePreferencesAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", preferences: [] };

  try {
    const preferences = await getReceivePreferencesByUser(session.user.id);
    return { preferences };
  } catch (err) {
    return { error: "Failed to fetch receive preferences", preferences: [] };
  }
}
