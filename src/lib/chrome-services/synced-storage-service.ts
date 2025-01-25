import { SessionQuicksaveOptions } from "@src/lib/models/session-quicksave-options";

export async function saveOptions(
  options: SessionQuicksaveOptions,
): Promise<void> {
  const jsonObject = JSON.stringify(options);
  console.debug("Saving new options... : ", jsonObject);
  await chrome.storage.sync.set(jsonObject);

  const error = chrome.runtime.lastError;
  if (error) {
    console.debug("Error saving options: ", error);
  } else {
    console.debug("New options saved successfully");
  }
}

export async function readOptions(): Promise<SessionQuicksaveOptions> {
  const items = await chrome.storage.sync.get();

  if (chrome.runtime.lastError) {
    throw chrome.runtime.lastError;
  }

  const optionsParsed = SessionQuicksaveOptions.safeParse(items);
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
