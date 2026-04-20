import type { RequestHandler, RequestResponse } from "@kratia/sdk/types";
import { postAccount } from "./onPost";
import { error } from "@kratia/sdk/error";
import { getSystemAccounts } from "./onGet";

export const onGet: RequestHandler = async ({ query, json }) => {
    const response: RequestResponse = { status: 500 }
    const payload = query
    const result = await getSystemAccounts(payload as any)
    if (!result) throw error(400, "Account not found")
    response.status = 200;
    response.data = result.data;
    return json(response.status, response)
};

export const onPost: RequestHandler = async ({ body, json }) => {
    const response: RequestResponse = { status: 500 }
    const payload = await body()
    console.log(payload)
    const result = await postAccount(payload as any)
    if (!result) throw error(400, "Account not created")
    response.status = 200;
    response.data = result.data;
    return json(response.status, response)
};
