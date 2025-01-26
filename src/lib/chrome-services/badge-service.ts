import delay from "delay";

async function setBadge({ text, color, timeout = 2000 }) {
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeText({ text });

  if (timeout > 0) {
    await delay(timeout);
    clearBadge();
  }
}

export async function setOkBadge(timeout = 2000) {
  return setBadge({
    text: "Ok",
    color: "#00A63E", // tailwind green-600
    timeout,
  });
}

export async function setErrBadge(timeout = 2000) {
  return setBadge({
    text: "Err",
    color: "#E7000B", // tailwind red-600
    timeout,
  });
}

export async function setWarningBadge(timeout = 2000) {
  return setBadge({
    text: "!",
    color: "#FFE020", // tailwind yellow-300
    timeout,
  });
}

export async function setInfoBadge(timeout = 2000) {
  return setBadge({
    text: "i",
    color: "#165DFB", // tailwind blue-600
    timeout,
  });
}

// Exmaples & Debugging - note: only works one at a time!
// setOkBadge(0);
// setErrBadge(0);
// setWarningBadge(0);
// setInfoBadge(0);

export async function badgeOkNotification(timeout = 2000) {
  return setBadge({
    text: "Ok",
    color: "#00A63E", // tailwind green-600
    timeout,
  });
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
