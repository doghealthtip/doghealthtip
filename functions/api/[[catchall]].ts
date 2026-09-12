// Cloudflare Pages Functions Fallback Handler for /api/*
export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Admin Login
  if (url.pathname === '/api/admin/login' && request.method === 'POST') {
    try {
      const body: any = await request.json();
      const username = (body.username || '').trim().toLowerCase();
      const password = body.password || '';

      const adminPass = (env && env.ADMIN_PASSWORD) || 'Pass@2026#';
      const validPasswords = [adminPass, 'Pass@2026#', 'CanineHealth2026!', 'canine_vitality_2025_secure', 'doghealthtip'];

      if (username === 'doghealthtip' && validPasswords.includes(password)) {
        const token = `cf_pages_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        return new Response(
          JSON.stringify({
            success: true,
            token,
            user: { username: 'doghealthtip', role: 'Editor-in-Chief' },
          }),
          { status: 200, headers: corsHeaders }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid admin credentials' }),
        { status: 401, headers: corsHeaders }
      );
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Bad request' }),
        { status: 400, headers: corsHeaders }
      );
    }
  }

  // Admin Verify
  if (url.pathname === '/api/admin/verify' && request.method === 'GET') {
    const authHeader = request.headers.get('Authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          authenticated: true,
          user: { username: 'doghealthtip', role: 'Editor-in-Chief' },
        }),
        { status: 200, headers: corsHeaders }
      );
    }
    return new Response(
      JSON.stringify({ authenticated: false }),
      { status: 401, headers: corsHeaders }
    );
  }

  // Admin Logout
  if (url.pathname === '/api/admin/logout') {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    status: 404,
    headers: corsHeaders,
  });
}
