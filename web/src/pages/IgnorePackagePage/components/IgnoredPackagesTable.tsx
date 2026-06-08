import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useKsu } from "@/hooks/useKsu";
import type { PackageInfo } from "@/types"
import { Trash } from "lucide-react";
import { useContext, useEffect, useState } from "react"
interface ApplicationProps {
    packageName: string,
    name: string,
}
function Application({ name, packageName }: ApplicationProps) {
    return (
        <div className="flex items-center min-w-0">
            <img src={`ksu://icon/${packageName}`} />
            <div className="ml-1 min-w-0 truncate">{name}</div>
        </div>
    )
}
export default function IgnoredPackagesTable() {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const { getStringConfig, getPackageInfo } = useKsu(true);
    const [packages, setPackages] = useState<PackageInfo[]>([]);
    useEffect(() => {
        (async () => {
            const list = await getStringConfig("ignorePackageNames")
            if (!list) return
            const splitPackage = list.split(";");
            setPackages(await getPackageInfo(splitPackage))
        })();
    }, []);
    return (
        <>
            <ScrollArea className="h-full w-full">
                <div className="mx-auto w-[91%]">
                    <Table className="table-fixed w-full">
                        {
                            packages.map((pkg) => (
                                <TableRow key={pkg.packageName}>
                                    <TableCell className="min-w-0">
                                        <Application name={pkg.name} packageName={pkg.packageName} />
                                    </TableCell>
                                    <TableCell className="text-right w-10 whitespace-nowrap">
                                        <Button variant="ghost" size="icon">
                                            <Trash color="red" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </Table>
                </div>
            </ScrollArea>
        </>
    )
}