export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://mrtyping.onrender.com/api";

export const getTokens = () => {
  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");
  return { access, refresh };
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  let { access } = getTokens();

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (access) {
    headers.set("Authorization", `Bearer ${access}`);
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If access token expired
  if (response.status === 401 && access) {
    const { refresh } = getTokens();

    if (refresh) {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();

        setTokens(data.access, refresh);

        headers.set("Authorization", `Bearer ${data.access}`);

        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        clearTokens();
      }
    } else {
      clearTokens();
    }
  }

  return response;
};
