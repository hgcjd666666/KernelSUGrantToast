import { shellQuote } from "@/lib/utils";
import { exec, listPackages, getPackagesInfo } from "kernelsu"
import { useCallback } from "react"
export function useKsu(mock = false) {
    const getStringConfig = useCallback(async (configKey: string) => {
        if (mock) return "mocking"
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config get ${configKey}`)
        if (result.errno !== 0) return null;
        return result.stdout
    }, []);
    const getBooleanConfig = useCallback(async (configKey: string) => {
        if (mock) return true
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config get ${configKey}`)
        if (result.errno !== 0) return null;
        return result.stdout === "true"
    }, []);
    const setConfig = useCallback(async (configKey: string, value: string) => {
        if (mock) return true
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config set ${configKey} ${shellQuote(value)}`)
        return result.errno === 0
    }, []);
    const deleteConfig = useCallback(async (configKey: string) => {
        if (mock) return true
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config delete ${configKey}`)
        return result.errno === 0
    }, []);
    const listAllPackages = useCallback(async () => {
        if (mock) return [{ packageName: "com.mocking.1", name: "mocking" }, { packageName: "com.mocking.2", name: "mocking2" }]
        const packages = listPackages("user")
        const packagesInfo = getPackagesInfo(packages);
        return packagesInfo.map(info => {
            return {
                packageName: info.packageName,
                name: info.appLabel
            }
        })
    }, []);
    const getPackageInfo = useCallback(async (packages: string[]) => {
        if (mock) {
            const temp=[];
            for (let i = 0; i < 5; i++) {
                temp.push({
                    packageName: "mocking:"+i,
                    name: "mocking:abc aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+i
                })
            }
            return temp;
        }
        const packagesInfo = getPackagesInfo(packages);
        return packagesInfo.map(info => {
            return {
                packageName: info.packageName,
                name: info.appLabel
            }
        })
    }, []);
    return { getStringConfig, getBooleanConfig, setConfig, deleteConfig, listAllPackages ,getPackageInfo}
}