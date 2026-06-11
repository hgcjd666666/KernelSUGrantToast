import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/hooks/useI18n";
import type SupportedLangs from "@/locales/SupportedLangs";

interface LanguageSelectProps {
    languageContext: keyof typeof SupportedLangs;
    setLanguage: (language: keyof typeof SupportedLangs) => void;
}
export default function LanguageSelect({ languageContext, setLanguage }: LanguageSelectProps) {
    const { getLang ,resetLanguage} = useI18n(languageContext);
    return (
        <>
            <Label htmlFor="languageSelect">{getLang("language.label")}</Label>
            <Select value={languageContext} onValueChange={(value => {
                if (value==="system") {
                    resetLanguage(setLanguage)
                    return
                }
                setLanguage(value as keyof typeof SupportedLangs);
                localStorage.setItem("language", value);
            })}>
                <SelectTrigger className="w-[90%] mt-1.5">
                    <SelectValue placeholder={getLang("language.select")} />
                </SelectTrigger>
                <SelectContent id="languageSelect">
                    <SelectGroup>
                        <SelectLabel>{getLang("language.select")}</SelectLabel>
                        <SelectItem value="system">{getLang("text.followSystem")}</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁體中文</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}