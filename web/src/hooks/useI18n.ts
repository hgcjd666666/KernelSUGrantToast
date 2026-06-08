import { useCallback, useEffect } from "react";
import type BaseKeys from "@/locales/zhCN";
import SupportedLangs from "@/locales/SupportedLangs";
type SupportedLangsType = keyof typeof SupportedLangs;
export function useI18n(currentLanguage: SupportedLangsType, setContextLanguage?: (language: SupportedLangsType) => void) {
    useEffect(() => {
        //从存储获取
        const storageLang = localStorage.getItem("language");
        if (storageLang && storageLang !== "system" && Reflect.has(SupportedLangs, storageLang)) {
            setContextLanguage?.(storageLang as keyof typeof SupportedLangs);
            document.documentElement.lang = storageLang;
            return
        }
        //获取设备语言
        const deviceLang = navigator.language.toLowerCase().split("-")[0];
        if (Reflect.has(SupportedLangs, deviceLang)) {
            setContextLanguage?.(deviceLang as keyof typeof SupportedLangs);
        }
    }, []);
    const getLang = useCallback((key: keyof typeof BaseKeys) => {
        if (Reflect.has(SupportedLangs, currentLanguage)) {
            return SupportedLangs[currentLanguage][key] ?? "Unknown translate key";
        } else {
            console.log("fall back",currentLanguage,key);
            return SupportedLangs.zh[key] ?? "Unknown translate key";
        }
    }, [currentLanguage]);
    return { getLang }
}