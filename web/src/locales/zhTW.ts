import type BaseLang from "./zhCN"
const TraditionalChineseKeys: typeof BaseLang = {
    "text.save": "儲存",
    "text.save.success": "儲存成功",
    "text.save.failed": "由於未知異常，設定儲存失敗",
    "text.reboot.tip": "需要重新啟動裝置以套用變更",
    "text.ok": "確定",
    "text.cancel": "取消",
    "text.detail": "詳細資訊",
    "text.followSystem": "跟隨系統",

    "tabs.base": "基本",
    "tabs.ignorePackage": "忽略清單",
    "tabs.advanced": "進階",
    "tabs.about": "關於",

    "language.label": "語言",
    "language.select": "選擇語言",

    "theme.label": "主題模式",
    "theme.select": "選擇主題模式",
    "theme.light": "淺色",
    "theme.dark": "深色",

    "toast.custom.title": "自訂提示訊息",
    "toast.custom.placeholder": "已授予 %s 使用超級使用者的權限",
    "toast.custom.description": "須包含「%s」預留位置用於顯示應用程式名稱，且長度小於64個字元",
    "toast.save.reset.success": "已還原預設提示訊息",
    "toast.save.error.invalidLength": "訊息長度需小於64個字元",
    "toast.save.error.missionPlaceholder": "訊息需包含「%s」預留位置",

    "ignorePackage.tip": "清單中的應用程式發起提權時將不會提醒",
    "ignorePackage.delete.confirm.title": "確認移除",
    "ignorePackage.delete.confirm.description": "確定要將此應用程式從忽略清單中移除嗎？",
    "ignorePackage.add": "新增應用程式",
    "ignorePackage.add.dialog.description": "點選應用程式項目以新增",
    "ignorePackage.add.dialog.search.placeholder": "依應用程式名稱或套件名稱篩選",
    "ignorePackage.add.exist": "此應用程式已在清單中",


    "advanced.warning": "此頁面的設定若調整不當，可能影響效能或導致運作異常",
    "advanced.searchDepth.reset.success": "已還原預設值",
    "advanced.searchDepth.label": "應用程式套件搜尋深度",
    "advanced.searchDepth.save.failed.invalid": "輸入數值無效，應介於0-32之間",
    "advanced.searchDepth.description": "輸入值應介於0-32之間，預設值為1",
    "advanced.searchDepth.description.detail": '過高會影響效能，過低可能導致某些提權資料被忽略。通常保持預設值已經足夠，除非你特別在意像「在 Termux 裡執行的 Codex 中執行了 su」這種極端情況',

    "advanced.suCompat.label": "檢查 SuCompat 事件",
    "advanced.suCompat.description": "僅建議在無法正常顯示提示時啟用",
    "advanced.suCompat.description.detail": "部分系統或應用程式只會觸發此類型事件（極少出現這種情況），啟用後可能修復提示遺漏或失效，但會增加效能開銷",

    "about.description": "像 Magisk 一樣彈出授予超級使用者權限 Toast",
    "about.button.repository": "專案倉庫",
    "about.otherProjects.title": "其他專案",
    "about.otherProjects.description.kyouka": "支援修改網頁、攔截呼叫、資料匯出等功能的多功能瀏覽器擴充套件",
    "about.otherProjects.description.connector.windows": "在區域網路內讓手機和電腦互相傳輸檔案、轉發通知等（Windows 端）",
    "about.otherProjects.description.connector.android": "在區域網路內讓手機和電腦互相傳輸檔案和文字、轉發通知等（Android 端）",
    "about.otherProjects.description.ruru": "知名應用程式清單偵測器的分支，增加偵測強度並支援自訂偵測目標應用程式"
}
export default TraditionalChineseKeys;
