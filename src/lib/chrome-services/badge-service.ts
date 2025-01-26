import delay from "delay";

export async function badgeOkNotification(timeout = 2000) {
  await chrome.action.setBadgeBackgroundColor(
    { color: "#00A63E" }, // tailwind green-600
  );
  await chrome.action.setBadgeText({ text: "Ok" });

  if (timeout > 0) {
    await delay(timeout);
    clearBadge();
  }
}

export async function badgeErrNotification(timeout = 2000) {
  await chrome.action.setBadgeBackgroundColor(
    { color: "#E7000B" }, // tailwind red-600
  );
  await chrome.action.setBadgeText({ text: "Err" });

  if (timeout > 0) {
    await delay(timeout);
    clearBadge();
  }
}

export async function clearBadge() {
  await chrome.action.setBadgeText({ text: "" });
}
