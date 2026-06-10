import type BaseLang from "../../locales/zhCN";
type LangKey = keyof typeof BaseLang;
const Projects: {
    title: string,
    description: LangKey,
    url: string
}[] = [
    {
        title: "Kyouka",
        description: "about.otherProjects.description.kyouka",
        url: "https://github.com/NativeStar/Kyouka"
    },
    {
        title: "SuishoConnector-Windows",
        description: "about.otherProjects.description.connector.windows",
        url: "https://github.com/NativeStar/SuishoConnector-Windows"
    },
    {
        title:"SuishoConnector-Android",
        description:"about.otherProjects.description.connector.android",
        url:"https://github.com/NativeStar/SuishoConnector-Android"
    },
    {
        title:"Ruru Custom",
        description:"about.otherProjects.description.ruru",
        url:"https://github.com/NativeStar/Ruru"
    }
] as const;
export default Projects;