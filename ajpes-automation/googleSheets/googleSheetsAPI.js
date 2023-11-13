// Fetch the access token using the service account
function fetchAccessToken() {
  return new Promise((resolve, reject) => {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const payload = {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwtAssertion(),
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", tokenUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const accessToken = response.access_token;
        resolve(accessToken);
      } else {
        reject(new Error("Failed to fetch access token."));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Error fetching access token."));
    };

    xhr.send(new URLSearchParams(payload).toString());
  });
}

// Create the JWT assertion for authentication
function createJwtAssertion() {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: nowInSeconds,
    exp: nowInSeconds + 3600,
    scope: "https://www.googleapis.com/auth/spreadsheets",
  };

  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: serviceAccount.private_key_id,
  };

  const sJWT = KJUR.jws.JWS.sign(null, header, payload, serviceAccount.private_key);
  return sJWT;
}
