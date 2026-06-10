const ChineseKeys = {
    "text.save": "保存",
    "text.save.success": "保存成功",
    "text.save.failed": "由于未知异常,配置保存失败",
    "text.reboot.tip":"需要重启设备以应用更改",
    "text.ok": "确定",
    "text.cancel": "取消",
    "text.detail":"详情",

    "tabs.base": "基础",
    "tabs.ignorePackage": "忽略列表",
    "tabs.advanced": "高级",
    "tabs.about": "关于",

    "language.label": "语言",
    "language.select": "选择语言",

    "toast.custom.title": "自定义提示消息",
    "toast.custom.placeholder": "%s 已被授予超级用户权限",
    "toast.custom.description": "须带有%s占位符用于显示应用名且长度小于64字符",
    "toast.save.reset.success": "已恢复默认提示消息",
    "toast.save.error.invalidLength": "消息长度需小于64字符",
    "toast.save.error.missionPlaceholder": "消息需带有'%s'占位符",

    "ignorePackage.tip":"在列表中的应用发起提权将不会提醒",
    "ignorePackage.delete.confirm.title":"确认移除",
    "ignorePackage.delete.confirm.description":"确认将此应用从忽略列表中移除?",
    "ignorePackage.add":"添加应用",
    "ignorePackage.add.dialog.description":"点击应用项以添加",
    "ignorePackage.add.dialog.search.placeholder":"根据应用名或包名过滤",
    "ignorePackage.add.exist":"此应用已在列表中",


    "advanced.warning":"该页面设置调整不当可能影响性能或导致工作异常",
    "advanced.searchDepth.reset.success":"已恢复默认值",
    "advanced.searchDepth.label":"应用包搜索深度",
    "advanced.searchDepth.save.failed.invalid":"输入数值无效 应为0-32之间",
    "advanced.searchDepth.description":"输入应为0-32之间 默认值1",
    "advanced.searchDepth.description.detail":'过高影响性能 过低可能导致某些提权数据被忽略 通常保持默认已经够用.除非比较在意如"Termux里运行的Codex里执行了su"这种极端情况',

    "advanced.suCompat.label":"检查SuCompat事件",
    "advanced.suCompat.description":"仅建议在无法正常提示时启用",
    "advanced.suCompat.description.detail":"部分系统或应用只会触发该类型事件(极少出现这种情况) 开启后可能修复提示遗漏或失效 但会增加性能开销"
}
export default ChineseKeys;