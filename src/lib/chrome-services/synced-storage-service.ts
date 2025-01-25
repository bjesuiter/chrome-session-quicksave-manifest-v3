import { SessionQuicksaveOptions } from "@src/lib/models/session-quicksave-options";

export function saveOptions(options: SessionQuicksaveOptions): Promise<void> {
	return new Promise((resolve, reject) => {
		const jsonObject = JSON.stringify(options);
		console.debug("Saving new options... : ", jsonObject);
		chrome.storage.sync.set(jsonObject, () => {
			const error = chrome.runtime.lastError;
			if (error) {
				console.debug("Error saving options: ", error);
				reject(error);
			} else {
				console.debug("New options saved successfully");
				resolve();
			}
		});
	});
}

export function readOptions(): Promise<SessionQuicksaveOptions> {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get((items) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
				return;
			}
			const optionsParsed = SessionQuicksaveOptions.safeParse(items);
			if (!optionsParsed.success) {
				reject(optionsParsed.error);
				return;
			}
			const decodedOptions = optionsParsed.data;
			resolve(decodedOptions);
		});
	});
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
