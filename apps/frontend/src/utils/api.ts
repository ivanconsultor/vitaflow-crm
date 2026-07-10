export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("gsd_token");
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Se o token expirar ou for invalido, limpa e redireciona
    localStorage.removeItem("gsd_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  return response;
}
