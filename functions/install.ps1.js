const INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/gorse-io/gorse/master/cmd/gorse-cli/install.ps1";

const SCRIPT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=3600",
  "X-Content-Type-Options": "nosniff",
};

export async function onRequestGet() {
  const response = await fetch(INSTALL_SCRIPT_URL, {
    cf: {
      cacheEverything: true,
      cacheTtl: 3600,
    },
  });

  if (!response.ok) {
    return new Response("failed to load install script\n", {
      status: 502,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(response.body, {
    status: 200,
    headers: SCRIPT_HEADERS,
  });
}

export async function onRequestHead() {
  return new Response(null, {
    status: 200,
    headers: SCRIPT_HEADERS,
  });
}
