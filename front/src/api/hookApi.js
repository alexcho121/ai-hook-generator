const hookApi_baseUrl =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  );

async function hookApi_request(hookApi_path, hookApi_options = {}) {
  const hookApi_response = await fetch(`${hookApi_baseUrl}${hookApi_path}`, {
    headers: {
      "Content-Type": "application/json",
      ...hookApi_options.headers,
    },
    ...hookApi_options,
  });

  if (!hookApi_response.ok) {
    const hookApi_errorText = await hookApi_response.text();
    throw new Error(hookApi_errorText || "API request failed");
  }

  if (hookApi_response.status === 204) {
    return null;
  }

  return await hookApi_response.json();
}

export async function hookApi_generateHooks(
  hookApi_userInput,
  hookApi_selectedPlatforms = [],
  hookApi_previousHistoryIds = []
) {
  return await hookApi_request("/api/hooks/generate", {
    method: "POST",
    body: JSON.stringify({
      input: hookApi_userInput,
      platforms: hookApi_selectedPlatforms,
      previousHistoryIds: hookApi_previousHistoryIds,
    }),
  });
}

export async function hookApi_recordCopy(hookApi_historyId) {
  if (!hookApi_historyId) {
    return null;
  }

  return await hookApi_request(`/api/history/${hookApi_historyId}/copy`, {
    method: "POST",
  });
}
