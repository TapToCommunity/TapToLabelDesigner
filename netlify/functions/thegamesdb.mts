import type { Config } from "@netlify/functions"

const GAMESDB_ENDPOINT = 'https://api.thegamesdb.net/';
const GAMSEDB_PUBLIC_APIKEY =
  '868ff7ffc22bb9b7679d2502c134d1c47613a93cb757b34397448ca5faf4ab5a';

export default async (req: Request /* , context: Context */): Promise<Response> => {
  const { url } = req;
  const path = url.split('/thegamesdb/')[1];
  const newUrl = `${GAMESDB_ENDPOINT}${path}&apikey=${GAMSEDB_PUBLIC_APIKEY}`;
  const { body, status, statusText, headers: originalResHeaders } = await fetch(newUrl);
  const origin = req.headers.get('Origin') ?? '';
  if (origin.includes('//localhost')) {
    originalResHeaders.set('Access-Control-Allow-Origin', origin);
  }
  console.log(originalResHeaders);
  return new Response(body, { status, statusText, headers: originalResHeaders });
}

export const config: Config = {
  path: "/thegamesdb/*"
};