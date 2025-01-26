import { SessionQuicksaveOptions } from "@src/lib/main/session-quicksave-options";

export async function saveOptions(
  options: SessionQuicksaveOptions,
): Promise<void> {
  console.debug("Saving new options... : ", options);
  const syncItems = { options };
  await chrome.storage.sync.set(syncItems);

  const error = chrome.runtime.lastError;
  if (error) {
    console.debug("Error saving options: ", error);
  } else {
    console.debug("New options saved successfully");
  }
}

export async function readOptions(): Promise<
  SessionQuicksaveOptions | undefined
> {
  const syncItems = await chrome.storage.sync.get(["options"]);

  console.log(`chrome.storage.sync options: `, syncItems.options);

  if (chrome.runtime.lastError) {
    throw chrome.runtime.lastError;
  }

  const optionsParsed = SessionQuicksaveOptions.safeParse(syncItems.options);
  if (!optionsParsed.success) {
    throw optionsParsed.error;
  }

  const decodedOptions = optionsParsed.data;
  return decodedOptions;
}

export async function readOptionSessionsFolderId(): Promise<
  string | undefined
> {
  try {
    const options = await readOptions();
    if (options.sessionsFolderId) {
      return options.sessionsFolderId;
    }
  } catch (error) {
    console.error("Error while reading options: ", error);
  }
}
