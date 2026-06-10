import type BaseLang from "./zhCN"
const EnglishKeys: typeof BaseLang = {
  "text.save": "Save",
  "text.save.failed": "Save failed because of unknown error",
  "text.save.success": "Saved",
  "text.reboot.tip": "Reboot device to apply changes",
  "text.ok": "Confirm",
  "text.cancel": "Cancel",
  "text.detail": "Detail",


  "tabs.advanced": "Advanced",
  "tabs.ignorePackage": "Ignore List",
  "tabs.base": "Base",
  "tabs.about": "About",

  "language.label": "Language",
  "language.select": "Select Language",

  "toast.custom.title": "Custom Toast Message",
  "toast.custom.placeholder": "%s was granted Superuser rights",
  "toast.custom.description": "Must contain %s placeholder and less than 64 characters",
  "toast.save.reset.success": "Reset to default toast message",
  "toast.save.error.invalidLength": "Message length must less than 64 characters",
  "toast.save.error.missionPlaceholder": "Message must contain '%s' placeholder",

  "ignorePackage.tip": "Ignored applications will not be prompted for superuser rights",
  "ignorePackage.delete.confirm.title": "Confirm Remove",
  "ignorePackage.delete.confirm.description": "Confirm to remove this application from the ignore list?",
  "ignorePackage.add": "Add Application",
  "ignorePackage.add.dialog.description": "Click an application item to add",
  "ignorePackage.add.dialog.search.placeholder":"Filter by name or package name",
  "ignorePackage.add.exist": "This application is already in the list",

  "advanced.warning": "The advanced settings may cause performance issues or cause abnormal work",
  "advanced.searchDepth.reset.success": "Reset to default",
  "advanced.searchDepth.label": "Package Search Depth",
  "advanced.searchDepth.save.failed.invalid": "Invalid input, should be between 0 and 32",
  "advanced.searchDepth.description": "Input should be between 0 and 32",
  "advanced.searchDepth.description.detail": 'High search depth may cause performance issues, low search depth may cause some applications to be ignored\nUsually the default value is enough, but if you are sure that "Termux runs Codex and executes su"',

  "advanced.suCompat.label": "Check SuCompat event",
  "advanced.suCompat.description": "Only recommended when it cannot be prompted normally",
  "advanced.suCompat.description.detail": "Some systems or applications will only trigger this type of event (very few occurrences) Enabling this option may fix the problem of missing or invalid prompts but will increase performance overhead",

  "about.description":"Show a root granted toast like Magisk",
  "about.button.repository":"Project Repository",
  "about.otherProjects.title":"Other Projects",
  "about.otherProjects.description.kyouka":"A versatile browser extension that supports modifying web pages, intercepting calls, exporting data, and more",
  "about.otherProjects.description.connector.windows":"Cross-network file transfer and text/notification forwarding (Windows side)",
  "about.otherProjects.description.connector.android":"Cross-network file transfer and text/notification forwarding (Android side)",
  "about.otherProjects.description.ruru":"A branch of the most popular app list detector, increasing detection strength and supporting custom detection targets",

}
export default EnglishKeys;