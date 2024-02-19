import type { Config } from "@netlify/functions"

const GAMESDB_ENDPOINT = 'https://api.thegamesdb.net/';
const GAMSEDB_PUBLIC_APIKEY =
  '868ff7ffc22bb9b7679d2502c134d1c47613a93cb757b34397448ca5faf4ab5a';

export default async (req: Request /* , context: Context */): Promise<Response> => {
  const { url, headers } = req;
  const path = url.split('/thegamesdb/')[1];
  const newUrl = `${GAMESDB_ENDPOINT}${path}&apikey=${GAMSEDB_PUBLIC_APIKEY}`;
  const responseGamesDb = await fetch(newUrl);
  const resHeaders = {};
  if (headers['origin'].includes) {
    resHeaders['Access-Control-Allow-Origin'] = headers['origin'];
  }
  return new Response(responseGamesDb.body, { status: 200, statusText: 'ok', headers: resHeaders });
}

export const config: Config = {
  path: "/thegamesdb/*"
};