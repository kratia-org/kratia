import { getOpenApiJson } from "@kratia/sdk/openapi";
import type { RequestHandler } from "@kratia/sdk/types";
import { join } from "path";
import { error } from "@kratia/sdk/error";
import { publicPath } from "@kratia/sdk/server";


export const onGet: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const openapi = await getOpenApiJson(url.host);
    await Bun.write(join(publicPath, `openapi.json`), JSON.stringify(openapi, null, 2));
    const openapijson = Bun.file(join(publicPath, `openapi.json`));
    if (!await openapijson.exists()) error(404, "OpenAPI JSON not found");
    return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>API Reference</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </head>
                <body>
                    <div id="app"></div>
                    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
                    <script type="text/javascript">
                        Scalar.createApiReference("#app", {
                            url:"https://${url.host}/openapi.json?format=json"
                        });
                    </script>
                </body>
                </html>
                `, {
        headers: {
            "Content-Type": "text/html",
        },
    });
}