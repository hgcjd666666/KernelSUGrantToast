import { FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useKsu } from "@/hooks/useKsu";
import { useContext, useEffect } from "react";

export default function CheckCompatEventSetting() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const {getBooleanConfig,setConfig}=useKsu();
    useEffect(() => {
        
    }, []);
    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex space-x-2.5">
                <Switch id="checkSuCompat" />
                <Label htmlFor="checkSuCompat">{getLang("advanced.suCompat.label")}</Label>
            </div>
            <FieldDescription className="text-center">{getLang("advanced.suCompat.description")}</FieldDescription>
        </div>
    )
}