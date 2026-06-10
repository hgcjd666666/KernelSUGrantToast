import { Alert } from "@/components/Alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useKsu } from "@/hooks/useKsu";
import { CircleQuestionMark } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function CheckCompatEventSetting() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const { getBooleanConfig, setConfig } = useKsu();
    const [checkSuCompat, setCheckSuCompat] = useState(false);
    const [openDetailAlert, setOpenDetailAlert] = useState(false);

    useEffect(() => {
        getBooleanConfig("checkSuCompat").then(value => setCheckSuCompat(value === null ? false : value))
    }, []);
    function onSwitchChange() {
        setConfig("checkSuCompat", String(!checkSuCompat)).then(() => {
            setCheckSuCompat(!checkSuCompat);
        })
    }
    return (
        <>
            <Alert open={openDetailAlert} confirmText={getLang("text.ok")} description={getLang("advanced.suCompat.description.detail")} onConfirm={() => setOpenDetailAlert(false)} title={getLang("text.detail")} />
            <div className="flex flex-col items-center mt-2">
                <div className="flex space-x-2.5">
                    <Switch onClick={onSwitchChange} checked={checkSuCompat} id="checkSuCompat" />
                    <Label htmlFor="checkSuCompat">{getLang("advanced.suCompat.label")}
                        <Badge variant="ghost" onClick={(e) => {
                            //避免点击帮助按钮时触发click事件
                            e.preventDefault();
                            e.stopPropagation()
                            setOpenDetailAlert(true)
                        }}>
                            <CircleQuestionMark />
                        </Badge>
                    </Label>
                </div>
            </div>
        </>
    )
}