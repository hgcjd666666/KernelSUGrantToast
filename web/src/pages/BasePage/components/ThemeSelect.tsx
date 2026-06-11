import { useTheme } from "@/components/ThemeProvider";
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useContext } from "react";
export default function ThemeSelect() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const { setTheme, theme } = useTheme();
    return (
        <>
            <Label className="mt-3" htmlFor="themeSelect">{getLang("theme.label")}</Label>
            <Select value={theme} onValueChange={(value => {
                setTheme(value as typeof theme);
            })}>
                <SelectTrigger className="w-[90%] mt-1.5">
                    <SelectValue placeholder={getLang("theme.select")} />
                </SelectTrigger>
                <SelectContent id="themeSelect">
                    <SelectGroup>
                        <SelectLabel>{getLang("theme.select")}</SelectLabel>
                        <SelectItem value="system">{getLang("theme.system")}</SelectItem>
                        <SelectItem value="light">{getLang("theme.light")}</SelectItem>
                        <SelectItem value="dark">{getLang("theme.dark")}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}