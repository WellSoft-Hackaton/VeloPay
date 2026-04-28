"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getNotificationsByUser,
  getUnreadCount,
} from "@/lib/services/notification.service";

export async function createNotificationAction(data: {
  type: string;
  title: string;
  message?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const notification = await createNotification({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("notifications");
    return { success: true, notification };
  } catch (err) {
    return { error: "Failed to create notification" };
  }
}

export async function markNotificationReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const notification = await markNotificationRead(notificationId);
    revalidateTag("notifications");
    return { success: true, notification };
  } catch (err) {
    return { error: "Failed to mark notification as read" };
  }
}

export async function markAllReadAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await markAllNotificationsRead(session.user.id);
    revalidateTag("notifications");
    return { success: true };
  } catch (err) {
    return { error: "Failed to mark all notifications as read" };
  }
}

export async function deleteNotificationAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const notification = await deleteNotification(notificationId);
    revalidateTag("notifications");
    return { success: true, notification };
  } catch (err) {
    return { error: "Failed to delete notification" };
  }
}

export async function getNotificationsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", notifications: [] };

  try {
    const notifications = await getNotificationsByUser(session.user.id);
    return { notifications };
  } catch (err) {
    return { error: "Failed to fetch notifications", notifications: [] };
  }
}

export async function getUnreadCountAction() {
  const session = await auth();
  if (!session?.user?.id) return { count: 0 };

  try {
    const count = await getUnreadCount(session.user.id);
    return { count };
  } catch (err) {
    return { count: 0 };
  }
}
