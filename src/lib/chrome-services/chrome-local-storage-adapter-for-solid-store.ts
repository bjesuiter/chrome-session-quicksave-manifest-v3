import { AsyncStorage } from "@solid-primitives/storage";

const rawAdapter = {
  // CAUTION: Throws on errors!
  getItem: async (key: string): Promise<string | null> => {
    const syncItems = await chrome.storage.local.get([key]);
    console.debug(`Read ${key} from chrome.storage.local: `, syncItems[key]);
    if (chrome.runtime.lastError) {
      console.error(
        `Error reading key "${key}" from chrome.storage.local: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    return syncItems[key];
  },
  setItem: async (key: string, value: string): Promise<unknown> => {
    console.debug(
      `Write key "${key}" to chrome.storage.local with value:`,
      value,
    );
    await chrome.storage.local.set({ [key]: value });
    if (chrome.runtime.lastError) {
      console.error(
        `Error writing key "${key}" to chrome.storage.local: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    return;
  },
  removeItem: async (key: string): Promise<void> => {
    console.debug(`Remove key "${key}" from chrome.storage.local`);

    await chrome.storage.local.remove([key]);
    if (chrome.runtime.lastError) {
      console.error(
        `Error removing key "${key}" from chrome.storage.local: `,
        chrome.runtime.lastError,
      );
      throw chrome.runtime.lastError;
    }
    return;
  },
};

export const ChromeLocalStorageAdapterForSolidStore = () => {
  return rawAdapter satisfies AsyncStorage;
};
