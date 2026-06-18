import type BaseLang from "./zhCN"
const EnglishKeys: typeof BaseLang = {
  "text.save": "Save",
  "text.save.failed": "Save failed due to an unknown error",
  "text.save.success": "Saved",
  "text.reboot.tip": "Reboot device to apply changes",
  "text.ok": "OK",
  "text.cancel": "Cancel",
  "text.detail": "Details",
  "text.followSystem": "Follow System",

  "tabs.ignorePackage": "Ignore List",
  "tabs.base": "Basic",
  "tabs.about": "About",

  "language.label": "Language",
  "language.select": "Select Language",

  "theme.label": "Theme",
  "theme.select": "Select Theme",
  "theme.dark": "Dark",
  "theme.light": "Light",

  "toast.custom.title": "Custom Toast Message",
  "toast.custom.placeholder": "%s was granted Superuser rights",
  "toast.custom.description": "Must contain the '%s' placeholder and be fewer than 64 characters",
  "toast.save.reset.success": "Default toast message restored",
  "toast.save.error.invalidLength": "Message length must be less than 64 characters",
  "toast.save.error.missionPlaceholder": "Message must contain '%s' placeholder",

  "ignorePackage.tip": "Requests from apps in this list will not trigger a superuser toast",
  "ignorePackage.delete.confirm.title": "Confirm Removal",
  "ignorePackage.delete.confirm.description": "Are you sure you want to remove this app from the ignore list?",
  "ignorePackage.add": "Add Application",
  "ignorePackage.add.dialog.description": "Click an app to add it",
  "ignorePackage.add.dialog.search.placeholder": "Filter by app name or package name",
  "ignorePackage.add.exist": "This application is already in the list",

  "about.description": "Show a root granted toast like Magisk",
  "about.button.repository": "Project Repository",
  "about.otherProjects.title": "Other Projects",
  "about.otherProjects.description.kyouka": "A versatile browser extension that supports modifying web pages, intercepting calls, exporting data, and more",
  "about.otherProjects.description.connector.windows": "Transfer files between phone and PC over a local network, forward notifications, and more (Windows side)",
  "about.otherProjects.description.connector.android": "Transfer files and text between phone and PC over a local network, forward notifications, and more (Android side)",
  "about.otherProjects.description.ruru": "A fork of a well-known app list detector, with stronger detection and support for custom target apps",
}
export default EnglishKeys;
