import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/hooks/useI18n";
import type SupportedLangs from "@/locales/SupportedLangs";

interface LanguageSelectProps {
    languageContext: keyof typeof SupportedLangs;
    setLanguage: (language: keyof typeof SupportedLangs) => void;
}
export default function LanguageSelect({ languageContext, setLanguage }: LanguageSelectProps) {
    const { getLang } = useI18n(languageContext);
    return (
        <>
            <Label htmlFor="languageSelect">{getLang("language.label")}</Label>
            <Select value={languageContext} onValueChange={(value => {
                setLanguage(value as keyof typeof SupportedLangs);
                localStorage.setItem("language", value);
            })}>
                <SelectTrigger className="w-[90%] mt-1.5">
                    <SelectValue placeholder={getLang("language.select")} />
                </SelectTrigger>
                <SelectContent id="languageSelect">
                    <SelectGroup defaultValue="zh">
                        <SelectLabel>{getLang("language.select")}</SelectLabel>
                        <SelectItem value="zh">简体中文</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}