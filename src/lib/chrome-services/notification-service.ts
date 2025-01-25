import delay from "delay";

async function basicNotification(
  title: string,
  message: string,
  iconUrl: string,
) {
  const notification = {
    type: "basic",
    iconUrl: iconUrl,
    title,
    message,
  } satisfies chrome.notifications.NotificationOptions;

  const notificationId = (await chrome.notifications.create(
    undefined,
    notification,
  )) as unknown as string;

  if (chrome.runtime.lastError) {
    console.error(
      "Error creating notification",
      chrome.runtime.lastError.message,
    );
    throw new Error(
      "Error creating notification" + chrome.runtime.lastError.message,
    );
  }

  return notificationId;
}

/**
 * Chrome Docs for NotificationOptions
 * @param {*} text
 * @returns {Promise<string>} resolves with the id of the notification
 */
export async function showSimpleNotification(
  title: string,
  message: string,
): Promise<string> {
  return basicNotification(
    title,
    message,
    chrome.runtime.getURL("icons/icon-512.png"),
  );
}

export async function showError(title: string, message: string) {
  return basicNotification(
    title,
    message,
    chrome.runtime.getURL("assets/img/error.png"),
  );
}

export async function badgeOkNotification(timeout = 2000) {
  await chrome.action.setBadgeBackgroundColor(
    { color: "#00A63E" }, // tailwind green-600
  );
  await chrome.action.setBadgeText({ text: "Ok" });

  await delay(timeout);
  clearBadge();
}

export async function badgeErrNotification(timeout = 2000) {
  await chrome.action.setBadgeBackgroundColor(
    { color: "#E7000B" }, // tailwind red-600
  );
  await chrome.action.setBadgeText({ text: "Err" });

  await delay(timeout);
  clearBadge();
}

export async function clearBadge() {
  await chrome.action.setBadgeText({ text: "" });
}
