import { Button } from "@/components/ui/button";
import { FieldDescription } from "@/components/ui/field";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useContext, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react"
import IgnoredPackagesTable from "./components/IgnoredPackagesTable";
import { Separator } from "@/components/ui/separator";
import AddApplicationDialog from "./components/AddApplicationDialog";
import { useKsu } from "@/hooks/useKsu";
import type { PackageInfo } from "@/types";
import { toast } from "sonner";
export default function IgnorePackagePage() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const { getStringConfig, getPackageInfo, setConfig } = useKsu();
    const [showAddApplicationDialog, setShowAddApplicationDialog] = useState(false);
    const [ignorePackages, setIgnorePackages] = useState<PackageInfo[]>([]);

    useEffect(() => {
        (async () => {
            const rawList = await getStringConfig("ignorePackageNames");
            if (!rawList) return;
            const splitPackage = rawList.split(";");
            getPackageInfo(splitPackage).then(setIgnorePackages);
        })();
    }, []);
    return (
        <>
            <AddApplicationDialog open={showAddApplicationDialog} onCancel={() => setShowAddApplicationDialog(false)} onAddApplication={async (pkgInfo) => {
                if(ignorePackages.some(pkg => pkg.packageName === pkgInfo.packageName)){
                    toast.warning(getLang("ignorePackage.add.exist"))
                    return
                }
                const newIgnoredPackages = [...ignorePackages, pkgInfo];
                setIgnorePackages(newIgnoredPackages);
                const result = await setConfig("ignorePackageNames", newIgnoredPackages.map(item => item.packageName).join(";"));
                result ? toast.success(getLang("text.save.success"), { description: getLang("text.reboot.tip") }) : toast.error(getLang("text.save.failed"));
                setShowAddApplicationDialog(false);
            }} />
            <div className="flex flex-col h-full min-h-0 items-center text-center overflow-hidden">
                <FieldDescription className="text-center shrink-0">{getLang("ignorePackage.tip")}</FieldDescription>
                <Button className="w-[90%]" onClick={()=>setShowAddApplicationDialog(true)}>
                    <CirclePlus />
                    {getLang("ignorePackage.add")}
                </Button>
                <Separator className="mt-3.5" />
                <div className="min-h-0 w-full">
                    <IgnoredPackagesTable ignoredPackages={ignorePackages} setIgnorePackages={setIgnorePackages} />
                </div>
            </div>
        </>
    )
}