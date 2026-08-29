import { next } from '@vercel/functions';

// Protects every page on this site with a single shared username/password
// (HTTP Basic Auth). Change USERNAME / PASSWORD below and redeploy to update.
const USERNAME = 'recruiter1';
const PASSWORD = 'SupervanXpress2026';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      let decoded = '';
      try {
        decoded = atob(encoded);
      } catch (e) {
        decoded = '';
      }
      const sepIndex = decoded.indexOf(':');
      const user = sepIndex === -1 ? decoded : decoded.slice(0, sepIndex);
      const pass = sepIndex === -1 ? '' : decoded.slice(sepIndex + 1);

      if (user === USERNAME && pass === PASSWORD) {
        return next();
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="SVE Kurier FAQ", charset="UTF-8"',
    },
  });
}
