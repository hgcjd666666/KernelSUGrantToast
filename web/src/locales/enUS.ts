import type BaseLang from "./zhCN"
const EnglishKeys: typeof BaseLang = {
  "text.save": "Save",
  "text.save.failed": "Save failed due to an unknown error",
  "text.save.success": "Saved",
  "text.reboot.tip": "Reboot device to apply changes",
  "text.ok": "OK",
  "text.cancel": "Cancel",
  "text.detail": "Details",


  "tabs.advanced": "Advanced",
  "tabs.ignorePackage": "Ignore List",
  "tabs.base": "Basic",
  "tabs.about": "About",

  "language.label": "Language",
  "language.select": "Select Language",

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
  "ignorePackage.add.dialog.search.placeholder":"Filter by app name or package name",
  "ignorePackage.add.exist": "This application is already in the list",

  "advanced.warning": "Improper settings on this page may affect performance or cause malfunctions",
  "advanced.searchDepth.reset.success": "Reset to default",
  "advanced.searchDepth.label": "Package Search Depth",
  "advanced.searchDepth.save.failed.invalid": "Invalid input, should be between 0 and 32",
  "advanced.searchDepth.description": "Enter a value between 0 and 32. Default: 1",
  "advanced.searchDepth.description.detail": "Setting this too high may hurt performance, while setting it too low may cause some privilege-escalation data to be ignored. The default value is usually sufficient unless you care about edge cases such as running 'su' from Codex inside Termux.",

  "advanced.suCompat.label": "Check SuCompat events",
  "advanced.suCompat.description": "Only recommended if prompts are not shown properly",
  "advanced.suCompat.description.detail": "Some systems or apps trigger only this type of event, though this is rare. Enabling it may fix missing or non-functional prompts, but it also increases overhead.",

  "about.description":"Show a root granted toast like Magisk",
  "about.button.repository":"Project Repository",
  "about.otherProjects.title":"Other Projects",
  "about.otherProjects.description.kyouka":"A versatile browser extension that supports modifying web pages, intercepting calls, exporting data, and more",
  "about.otherProjects.description.connector.windows":"Transfer files between phone and PC over a local network, forward notifications, and more (Windows side)",
  "about.otherProjects.description.connector.android":"Transfer files and text between phone and PC over a local network, forward notifications, and more (Android side)",
  "about.otherProjects.description.ruru":"A fork of a well-known app list detector, with stronger detection and support for custom target apps",

}
export default EnglishKeys;