import {
  bookmarkTreeNodeIsOpen,
  bookmarkTreeNodeSetOpen,
  isNodeSessionsFolder,
  setSessionsFolderId,
} from "@src/lib/main/options-service";
import { createMemo, For, Match, Show, Switch } from "solid-js";
import BookmarkIcon from "~icons/material-symbols-light/bookmark-outline?width=24px&height=24px";
import FolderEmptyIcon from "~icons/material-symbols-light/folder-outline-rounded?width=24px&height=24px";
import FolderFullIcon from "~icons/material-symbols-light/folder-rounded?width=24px&height=24px";
import StarIconHollow from "~icons/material-symbols-light/kid-star-outline?width=24px&height=24px";
import StarIcon from "~icons/material-symbols-light/kid-star?width=24px&height=24px";

export function BookmarkTree(props: {
  tree: () => chrome.bookmarks.BookmarkTreeNode[];
  class?: string;
  depth?: number;
}) {
  //   createEffect(() => {
  //     console.log("BookmarkTree", props.tree());
  //   });
  const childDepth = createMemo(() => props.depth ?? 0 + 1);

  const renderNodeIcon = (node: chrome.bookmarks.BookmarkTreeNode) => {
    return (
      <Switch>
        <Match when={node.url === undefined && node.children?.length === 0}>
          <FolderEmptyIcon class="mb-[3px] inline" />
        </Match>
        <Match when={node.url === undefined && node.children?.length > 0}>
          <FolderFullIcon class="mb-[3px] inline" />
        </Match>
        <Match when={node.url !== undefined}>
          <BookmarkIcon class="mb-[3px] inline" />
        </Match>
      </Switch>
    );
  };

  const renderNode = (node: chrome.bookmarks.BookmarkTreeNode) => {
    if (node.children?.length > 0) {
      return (
        <details
          class="w-max"
          open={bookmarkTreeNodeIsOpen(node)}
          onToggle={(event: ToggleEvent) =>
            bookmarkTreeNodeSetOpen(node, event.newState === "open")
          }
        >
          <summary>
            <span
              classList={{
                "border-b-0 border-solid border-yellow-400 pb-1 pr-1 m-1 ml-0":
                  isNodeSessionsFolder(node.id),
              }}
            >
              {renderNodeIcon(node)}

              {node.title.length > 0 ? node.title : "Bookmarks"}

              <Show when={isNodeSessionsFolder(node.id)}>
                <StarIcon class="mx-1 mb-[3px] inline text-lg text-yellow-400" />
              </Show>
              <Show when={!isNodeSessionsFolder(node.id)}>
                <StarIconHollow
                  class="mx-1 mb-[3px] inline text-lg text-slate-400"
                  onClick={(click) => {
                    click.preventDefault();
                    click.stopPropagation();
                    setSessionsFolderId(node.id);
                  }}
                />
              </Show>
            </span>
          </summary>
          {/* Children of THIS <details> tag */}
          <div
            style={{
              "margin-left": `${childDepth()}rem`,
            }}
          >
            <BookmarkTree tree={() => node.children} depth={childDepth()} />
          </div>
        </details>
      );
    } else {
      return (
        <p
          style={{
            "margin-left": `${childDepth()}rem`,
          }}
        >
          {renderNodeIcon(node)}
          {node.title}
        </p>
      );
    }
  };

  return <For each={props.tree()}>{(node) => renderNode(node)}</For>;
}
