import axios from "axios";
import * as v from "valibot";

export const valUUID = v.object({
  uuid: v.nullable(v.pipe(v.string(), v.uuid()))
});

export type UUID = v.InferInput<typeof valUUID>;


export const api = axios.create({
  baseURL: "https://api.kratia.org",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

export const docker = axios.create({
  baseURL: "http://localhost",
  socketPath: "/var/run/docker.sock",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});
