import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = packageJson.version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: packageJson.displayName ?? packageJson.name,
  version: `${major}.${minor}.${patch}.${label}`,
  description: packageJson.description,
  options_page: "src/pages/options/index.html",
  background: { service_worker: "src/pages/background/index.ts" },
  action: {
    // default_icon: {
    //   "16": "icons/icon-16.png",
    //   "48": "icons/icon-48.png",
    //   "128": "icons/icon-128.png",
    // },
    default_title: "Save current session",
    // default_popup: "src/pages/popup/index.html",
    // default_icon: "icons/icon-48.png",
  },
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "56": "icons/icon-56.png",
    "64": "icons/icon-64.png",
    "128": "icons/icon-128.png",
    "256": "icons/icon-256.png",
    "512": "icons/icon-512.png",
  },
  // content_scripts: [
  //   {
  //     matches: ["http://*/*", "https://*/*", "<all_urls>"],
  //     js: ["src/pages/content/index.tsx"],
  //   },
  // ],
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "assets/img/*",
        "assets/html/*",
      ],
      matches: ["*://*/*"],
    },
  ],
  permissions: ["bookmarks", "notifications", "storage", "tabs"],
  content_security_policy: {
    // default csp: script-src 'self'; object-src 'self';
    // extension_pages: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  },
}));

export default manifest;
