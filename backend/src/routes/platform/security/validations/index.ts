import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { postSecurityValidation } from "./onPost";
import { error } from "@kratia/sdk/error";

export const onPost: RequestHandler = async ({ body, json }) => {
    const response: RequestResponse = { status: 500 }
    const payload = await body()
    console.log(payload)
    const result = await postSecurityValidation(payload as any)
    if (!result) throw error(400, "Not validation success")
    response.status = 200;
    response.data = result.data;
    return json(response.status, response)
};
