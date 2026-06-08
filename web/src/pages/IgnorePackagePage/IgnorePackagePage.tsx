import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useContext } from "react";
import { CirclePlus } from "lucide-react"
import IgnoredPackagesTable from "./components/IgnoredPackagesTable";
import { Separator } from "@/components/ui/separator";
export default function IgnorePackagePage() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    return (
        <div className="flex flex-col h-full min-h-0 items-center text-center overflow-hidden">
            <FieldDescription className="text-center shrink-0">{getLang("ignorePackage.tip")}</FieldDescription>
            <Button className="w-[90%]">
                <CirclePlus />
                add app
            </Button>
            <Separator className="mt-3.5" />
            <div className="min-h-0 w-full">
                <IgnoredPackagesTable />
            </div>
        </div>
    )
}