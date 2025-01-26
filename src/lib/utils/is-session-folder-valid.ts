import { getBookmarkNode } from "../chrome-services/bookmark-service";

export async function isSessionFolderValid(sessionFolderId: string) {
  if (!sessionFolderId) return false;
  const sessionsFolderNode = await getBookmarkNode(sessionFolderId);
  return !!sessionsFolderNode;
}
