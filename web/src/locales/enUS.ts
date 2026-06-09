import type BaseLang from "./zhCN"
const EnglishKeys: typeof BaseLang = {
  "text.save": "Save",
  "text.save.failed": "Save failed because of unknown error",
  "text.save.success": "Saved",
  "text.reboot.tip": "Reboot device to apply changes",
  "text.ok": "Confirm",
  "text.cancel": "Cancel",


  "tabs.advanced": "Advanced",
  "tabs.ignorePackage": "Ignore List",
  "tabs.base": "Base",

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
}
export default EnglishKeys;