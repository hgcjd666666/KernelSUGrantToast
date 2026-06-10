import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n";
import { useKsu } from "@/hooks/useKsu";
import type { PackageInfo } from "@/types";
import { useContext, useEffect, useState } from "react";
import { ApplicationView } from "./ApplicationView";
import { Input } from "@/components/ui/input";
interface AddApplicationDialogProps {
    open: boolean
    onCancel: () => void
    onAddApplication: (pkgInfo: PackageInfo) => void
}
export default function AddApplicationDialog({ open, onAddApplication, onCancel }: AddApplicationDialogProps) {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    const [userPackages, setUserPackages] = useState<PackageInfo[]>([]);
    const [searchShowPackages, setSearchShowPackages] = useState<PackageInfo[]>([]);
    const { listAllPackages } = useKsu();
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        listAllPackages().then(value => {
            setUserPackages(value);
            setSearchShowPackages(value);
        });
    }, []);
    useEffect(() => {
        setSearchShowPackages(userPackages.filter(value => value.name.includes(searchValue) || value.packageName.includes(searchValue)));
    }, [searchValue]);
    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-h-[96vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>{getLang("ignorePackage.add")}</DialogTitle>
                    <DialogDescription>{getLang("ignorePackage.add.dialog.description")}</DialogDescription>
                </DialogHeader>
                <Input className="placeholder:text-sm" placeholder={getLang("ignorePackage.add.dialog.search.placeholder")} disabled={userPackages.length === 0} value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                <div className="max-h-[55vh] overflow-y-scroll no-scrollbar overscroll-none">
                    <Table className="table-fixed w-full">
                        <TableBody>
                            {
                                searchShowPackages.map((pkg) => (
                                    <TableRow key={pkg.packageName} onClick={() => onAddApplication(pkg)}>
                                        <TableCell className="min-w-0" onClick={() => { }}>
                                            <ApplicationView name={pkg.name} packageName={pkg.packageName} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>{getLang("text.cancel")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}