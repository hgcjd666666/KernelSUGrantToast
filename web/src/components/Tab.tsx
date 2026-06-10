import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageContext } from "@/contexts/LanguageContext";
import { useI18n } from "@/hooks/useI18n"
import type SupportedLangs from "@/locales/SupportedLangs";
import AboutPage from "@/pages/AboutPage/AboutPage";
import AdvancedPage from "@/pages/AdvancedPage/AdvancedPage";
import BasePage from "@/pages/BasePage/BasePage";
import IgnorePackagePage from "@/pages/IgnorePackagePage/IgnorePackagePage";
import { useContext } from "react";
interface TabProps {
    setLanguage: (language: keyof typeof SupportedLangs) => void;
}
export function Tab({setLanguage}:TabProps) {
    const languageContext = useContext(LanguageContext);
    const { getLang } = useI18n(languageContext);
    return (
        <Tabs defaultValue="base" className="w-full h-full">
            <TabsList variant="line">
                <TabsTrigger value="base">{getLang("tabs.base")}</TabsTrigger>
                <TabsTrigger value="ignorePackage">{getLang("tabs.ignorePackage")}</TabsTrigger>
                <TabsTrigger value="advanced">{getLang("tabs.advanced")}</TabsTrigger>
                <TabsTrigger value="about">{getLang("tabs.about")}</TabsTrigger>
            </TabsList>
            <TabsContent value="base">
                <BasePage setLanguage={setLanguage}/>
            </TabsContent>
            <TabsContent value="ignorePackage" className="min-h-0">
                <IgnorePackagePage/>
            </TabsContent>
            <TabsContent value="advanced">
                <AdvancedPage/>
            </TabsContent>
            <TabsContent value="about">
                <AboutPage/>
            </TabsContent>
        </Tabs>
    )
}