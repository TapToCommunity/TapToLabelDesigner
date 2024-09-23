import type { Config } from "@netlify/functions"

export default async (req: Request /* , context: Context */): Promise<Response> => {
  const { url } = req;
  const parsedUrl = new URL(url);
  const destination = parsedUrl.searchParams.get('imageUrl');
  if (destination) {
    const origin = req.headers.get('Origin') ?? '';
    const respHeaders = {};
    if (origin.includes('//localhost') || origin.includes('//deploy-preview')) {
      respHeaders['Access-Control-Allow-Origin'] = origin;
      respHeaders['Cache-Control'] = 'Netlify-CDN-Cache-Control: public, max-age=86400';
    }
    const { body, status, statusText } = await fetch(destination);
    return new Response(body, { status, statusText, headers: respHeaders });
  }
}

export const config: Config = {
  path: "/imageProxy"
};