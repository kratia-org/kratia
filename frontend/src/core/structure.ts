const manifests = import.meta.glob('../routes/**/manifest.json');

export const getStructure = (app: string) => {
    let response: { apps: Record<string, any>[], modules: Record<string, any>[] } = { apps: [], modules: [] }
    for (const filePath in manifests) {
        const arrayManifestPath = filePath.split('/').slice(3);
        arrayManifestPath.pop();
        const manifest = manifests[filePath]().then((res: any) => res.default)
        let currentApp: Record<string, any> | undefined = response.apps.find((app: any) => app.id === arrayManifestPath[0])
        if (!currentApp) {
            currentApp = {
                id: arrayManifestPath[0],
                name: manifest.name || arrayManifestPath[0].charAt(0).toUpperCase() + arrayManifestPath[0].slice(1),
                icon: manifest.icon || '',
                description: manifest.description || ''
            }
            response.apps.push(currentApp)
        }
        if (arrayManifestPath.length === 1) {
            currentApp && Object.assign(currentApp, manifest)
            continue
        }
        if (arrayManifestPath[0] !== app) continue
        let currentModule: Record<string, any> | undefined = response?.modules.find((module: any) => module.id === arrayManifestPath[1])
        if (!currentModule) {
            currentModule = {
                id: arrayManifestPath[1],
                name: manifest.name || arrayManifestPath[1].charAt(0).toUpperCase() + arrayManifestPath[1].slice(1),
                icon: manifest.icon || '',
                description: manifest.description || '',
                pages: []
            }
            response.modules.push(currentModule)
        }
        if (arrayManifestPath.length === 2) {
            currentModule && Object.assign(currentModule, manifest)
            continue
        }
        let currentPage: Record<string, any> | undefined = currentModule?.pages.find((page: any) => page.id === arrayManifestPath[2])
        if (!currentPage) {
            currentPage = {
                id: arrayManifestPath[2],
                name: manifest.name || arrayManifestPath[2].charAt(0).toUpperCase() + arrayManifestPath[2].slice(1),
                icon: manifest.icon || '',
                description: manifest.description || ''
            }
            currentModule?.pages.push(currentPage)
        }
        if (arrayManifestPath.length === 3) {
            currentPage && Object.assign(currentPage, manifest)
            continue
        }
    }
    response.apps = sortByCustomIds(response.apps, ["dashboard"], "start");
    response.apps = sortByCustomIds(response.apps, ["platform", "system", "settings"], "end");
    response.modules = sortByCustomIds(response.modules, ["dashboard"], "start");
    response.modules = sortByCustomIds(response.modules, ["platform", "system", "settings"], "end");
    if (app === "signup" || app === "signin" || app === "recovery") {
        response.modules = response.apps.filter((app: any) => app.id === "signup" || app.id === "signin" || app.id === "recovery");
        response.apps = response.apps.filter((app: any) => app.id !== "signup" && app.id !== "signin" && app.id !== "recovery" && app.id !== "platform");
    } else {
        response.apps = response.apps.filter((app: any) => app.id !== "auth" && app.id !== "signup" && app.id !== "signin" && app.id !== "recovery");
    }
    return response

}

function sortByCustomIds(array: any[], ids: string[], position: "start" | "end" = "start"): any[] {

    const orderMap = new Map(ids.map((id, index) => [id, index]));

    const selected: any[] = [];
    const rest: any[] = [];

    for (const item of array) {
        if (orderMap.has(item.id)) {
            selected.push(item);
        } else {
            rest.push(item);
        }
    }

    selected.sort(
        (a, b) => (orderMap.get(a.id)! - orderMap.get(b.id)!)
    );

    return position === "start"
        ? [...selected, ...rest]
        : [...rest, ...selected];
}
