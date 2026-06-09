import { shellQuote } from "@/lib/utils";
import { exec, listPackages, getPackagesInfo } from "kernelsu"
import { useCallback } from "react"
export function useKsu() {
    //TODO 发布前移除mock
    const mock=!Reflect.has(window,"ksu");
    if (mock) {
        console.warn("ipc mocking!");
    }
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
        console.log(value);
        if (mock) return true
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config set ${configKey} ${shellQuote(value)}`)
        return result.errno === 0
    }, []);
    const deleteConfig = useCallback(async (configKey: string) => {
        if (mock) return true
        const result = await exec(`export KSU_MODULE=ksuGrantToast&&/data/adb/ksud module config delete ${configKey}`)
        return result.errno === 0 || (result.errno === 1 && result.stderr === `Error: Key '${configKey}' not found in config`)
    }, []);
    const listAllPackages = useCallback(async () => {
        if (mock) {
            const temp = [];
            for (let i = 0; i < 50; i++) {
                temp.push({
                    packageName: i.toString(),
                    name: "mocking" + i
                })
            }
            return temp;
        }
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
            const temp = [];
            for (let i = 0; i < 5; i++) {
                temp.push({
                    packageName: i.toString(),
                    name: "mocking:abc aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + i
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
        }).filter(info => info.name !== undefined)
    }, []);
    return { getStringConfig, getBooleanConfig, setConfig, deleteConfig, listAllPackages, getPackageInfo }
}