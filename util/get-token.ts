export async function getAccessToken() {
  const tokenRes = await fetch(
    `https://idm.stackspot.com/${process.env.STACKSPOT_REALM}/oidc/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.STACKSPOT_CLIENT_ID!,
        client_secret: process.env.STACKSPOT_CLIENT_SECRET!,
      }),
    }
  );
  if (!tokenRes.ok) return null;
  const { access_token } = await tokenRes.json();
  return access_token;
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenRes = await fetch(
    `https://idm.stackspot.com/${process.env.STACKSPOT_REALM}/oidc/oauth/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.STACKSPOT_CLIENT_ID!,
        client_secret: process.env.STACKSPOT_CLIENT_SECRET!,
      }),
    }
  );
  if (!tokenRes.ok) return null;
  return tokenRes.json(); // retorna access_token, refresh_token, expires_in, etc.
}
