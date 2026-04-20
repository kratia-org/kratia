import { toJsonSchema } from "@valibot/to-json-schema";
import { Glob } from "bun";
import { readFileSync } from "fs";
import { join } from "path";
import { valPagination } from "./database";

export const getOpenApiJson = async (host: string) => {
  try {
    const packageJson = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
    const glob = new Glob("src/routes/**/*.{ts,md}");
    const files = [...glob.scanSync(".")]; // Listamos todos los .ts y .md
    const api: Record<string, any> = {
      openapi: "3.1.0",
      info: {
        title: packageJson.name,
        version: packageJson.version,
        description: "",
      },
      servers: [{ url: `https://${host}` }],
      "x-tagGroups": [],
      tags: [],
      paths: {},
    };
    // --- Leer README.md ---
    try {
      api.info.description = readFileSync(join(process.cwd(), "README.md"), "utf8");
    } catch {
      console.warn("⚠️ No se pudo leer kratia/README.md");
    }
    for (const file of files) {
      const fileArray = file.split("/").slice(2);
      const arrayPath = fileArray.filter(p => !(p.startsWith('(') && p.endsWith(')')))
      const fileName = arrayPath.pop();
      const isMd = fileName?.endsWith(".md");
      const isTs = fileName?.endsWith(".ts");

      if (arrayPath[0] === undefined) continue;

      let xTag = "/" + arrayPath[0];




      if (xTag === "/introduction" && isMd) {
        try {
          const content = readFileSync(file, "utf8");
          api.info.description = (api.info.description || "") + "\n\n" + content;
        } catch {
          console.warn("⚠️ No se pudo leer kratia/README.md");
        }
        continue;
      };


      if (!isTs) continue;


      if (!fileName || arrayPath.length < 1) continue;

      let xTagGroup = api["x-tagGroups"].find((g: any) => g.name === xTag);
      if (!xTagGroup) {
        xTagGroup = { name: xTag, tags: [] };
        api["x-tagGroups"].push(xTagGroup);
      }

      // --- x-tagGroup ---
      const fullTag = "/" + (arrayPath[1] + "/" + arrayPath[2] ?? "");
      let tagObj = api.tags.find((t: any) => t.name === fullTag);
      if (!tagObj && fullTag !== "/") {
        tagObj = { name: fullTag, description: "" };
        api.tags.push(tagObj);
        xTagGroup.tags.push(fullTag);
      }

      // --- Markdown ---
      if (isMd) {
        try {
          tagObj.description = readFileSync(file, "utf8");
        } catch { }
        continue;
      }

      const endpoint = "/" + arrayPath.join("/");

      if (!api.paths[endpoint]) api.paths[endpoint] = {};


      const endpointMethods = ["onGet", "onPost", "onPut", "onDelete", "onPatch"] as const;

      // --- Archivos TypeScript ---
      const indexModule = await import(join(process.cwd(), file));
      for (const endpointMethod of endpointMethods) {
        if (typeof indexModule[endpointMethod] === "function") {
          const method = endpointMethod.slice(2).toLowerCase(); // 'onGet' -> 'get'
          const segment = arrayPath[2] ?? "";
          api.paths[endpoint][method] = {
            summary: "/" + segment,
            tags: [fullTag],
          };
        }
      };


      const methodMatch = endpointMethods.find(endpointMethod => fileName === endpointMethod + ".ts") || "";

      if (methodMatch) {
        const method = methodMatch.slice(2).toLowerCase(); // 'onGet' -> 'get'

        let pager: any = {};

        if (method === "get") {
          pager = toJsonSchema(valPagination);
        }

        const methodModule = await import(join(process.cwd(), file));

        // ... dentro del bloque donde ya tienes `module` cargado
        let parameters: any[] = [];



        // lee la exportación `query` del módulo (si existe)
        const querySchema = method === "get" ?
          {
            type: "object",
            properties: { ...pager.properties, ...methodModule.query.properties },
            required: [...pager.required, ...methodModule.query.required]
          }
          :
          methodModule.query
          ??
          null;


        if (querySchema && typeof querySchema === "object") {
          const requiredFields: string[] = Array.isArray(querySchema.required) ? querySchema.required : [];
          const props = querySchema.properties && typeof querySchema.properties === "object"
            ? querySchema.properties
            : {};

          for (const [name, schema] of Object.entries(props)) {
            parameters.push({
              name,
              in: "query",
              required: requiredFields.includes(name),
              schema,
            });
          }
        }



        // lee la exportación `parameters` del módulo (si existe)
        const paramsSchema = methodModule.params ?? null;

        if (paramsSchema && typeof paramsSchema === "object") {
          const requiredFields: string[] = Array.isArray(paramsSchema.required) ? paramsSchema.required : [];
          const props = paramsSchema.properties && typeof paramsSchema.properties === "object"
            ? paramsSchema.properties
            : {};

          for (const [name, schema] of Object.entries(props)) {
            parameters.push({
              name,
              in: "path",
              required: requiredFields.includes(name),
              schema,
            });
          }
        }
        const bodySchema = methodModule.body || null;

        const response = {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "OK" },

        };



        const pagination = {
          pagination: {
            type: "object",
            properties: {
              total: { type: "integer", example: 10 },
              pages: { type: "integer", example: 1 }
            }
          }
        };

        const data = {
          data: {
            type: "array",
            items: methodModule.response || {}
          }
        };

        const responseSchema = method === "get" ? {
          ...response,
          ...pagination,
          ...data
        } : {
          ...response,
          ...data
        };



        if (!api.paths[endpoint][method]) {
          const segment = arrayPath[2] ?? "";
          api.paths[endpoint][method] = {
            summary: "/" + segment,
            tags: [fullTag],
          };
        }


        api.paths[endpoint][method] = {
          ...api.paths[endpoint][method],
          description: `${method.toUpperCase()} ${endpoint}`,
          parameters: parameters.length > 0 ? parameters : undefined,
          requestBody: bodySchema ? {
            content: {
              "application/json": {
                schema: bodySchema,
              },
            },
          }
            : undefined,
          responses: {
            200: {
              description: "Successful Response",
              content: {
                "application/json": {
                  schema: {
                    "type": "object",
                    "properties": responseSchema,
                  },
                },
              },
            },
          }
        };

      };
    };
    return api;
  } catch (error) {
    console.error("❌ Error capturado:", error);
  }
}
