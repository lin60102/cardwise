type StoredTokenReader = () => Promise<string | null>;

let apiAuthToken: string | null | undefined;

export function setApiAuthToken(token: string | null) {
  apiAuthToken = token;
}

export async function getApiAuthToken(readStoredToken: StoredTokenReader) {
  if (apiAuthToken !== undefined) {
    return apiAuthToken;
  }

  return readStoredToken();
}

export function resetApiAuthTokenForTests() {
  apiAuthToken = undefined;
}

