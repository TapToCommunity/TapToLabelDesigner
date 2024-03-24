import type { Config } from "@netlify/functions"

const ENDPOINT = process.env.ENDPOINT;
const APIKEY = process.env.APIKEY;

export default async (req: Request /* , context: Context */): Promise<Response> => {
  const { url } = req;
  const path = url.split('/thegamesdb/')[1];
  const newUrl = `${ENDPOINT}${path}&apikey=${APIKEY}`;
  const { body, status, statusText } = await fetch(newUrl);
  const origin = req.headers.get('Origin') ?? '';
  const respHeaders = {};
  if (origin.includes('//localhost')) {
    respHeaders['Access-Control-Allow-Origin'] = origin;
  }
  return new Response(body, { status, statusText, headers: respHeaders });
}

export const config: Config = {
  path: "/thegamesdb/*"
};