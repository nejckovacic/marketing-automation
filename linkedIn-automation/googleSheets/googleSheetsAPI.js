function configureGoogleAuthVars() {
  serviceAccount = {
    type: "service_account",
    project_id: "linkedinautomation-393307",
    private_key_id: "45f846f468f89b36b57281af23bfb0e75889253c",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCl0PdBMPsrONkA\nJU4GonvY/DfwZy3BRD8SGrKsSRf2WjqpcQsUhL0rI5zYjSHKMnJE74OmH2DKwebn\nJyGEd1ATMXHGow6NqL0JzHa9VuaFkCD/8wr4A96tYdoGZ+UxT2t2yr3Cv6O+naff\n6COOEYvc2kfo12FwoxzN0fOtVTVyH6YwjxLc1APDoWHWjp0EpS+zdShzBhNyLTok\nO1k2G212fXtmGwdSLGm/m5TcfSXa8NcxRJ3Jsof/ozqBeZakGjeOlDpOvJdWvBZQ\nnRa9XtwUEja86Ihu3xibk4SC5AyeEwI7MBHs1vpf/yCX3SF5CnMunURzHYM+lKQx\ngikIXMiNAgMBAAECggEABj7fOUzjgQbEoa1GCZjwKkWhw8PXJNrxtzhbN4MPTH+s\nivpPjQfM6kWOoFd8iNWqmS8eWdD/v9Na46UFLayizv5DR1SX9T0AVdCmPk56I1jA\n7XMVnC7lIcm4QRqDtv5DUXekeyPlwoXEr3nacPz3NCvinoISUQBL0vLQB1zYxQId\npoZ85ROVGMTUz+gBZLJFJSbTN03W93qA+6heybwk3Nw7a7+4yP6U0nnH++vq+RC8\nmUgHsoNgSI6rGFeJwHmxjZvbp7uCrenfmRlmgwn4insVPvHobIyEP/g0SNvR0SsL\nTCwcCCU4DnDgcZPs6vhK6RgQvx4n5QP33P0RNLPvkQKBgQDOaZuERoNQQ/bvLSoS\nPOWx4g/B02TuDqDlrhTNY3KKsD/pMmLiYzWbCORhGjWE3pQ2byZH0hcnV7cqviLU\nHYNR/X/0Y9We8CsvPPLKAl3UUdjkeIef4chKV6cLsAgaXr1yySdFLkElDPFzTXcG\niXH7fM9FyKWFhlw9F2stLiiNSQKBgQDNpq8rsjb2xJYc7Gf8NueXLq7xUWCCOadZ\neXwBkilDvV0e4dP8ad7RggWbzrwaOH1vIftjjF3ZRhRwhTRsWBUoHXSW2e3S+GyN\nX5QllmW4oq8pF7eEX/uahGHXcxNBbcHisxFwKOkWvyyyew0FiAXJbVxZSVuFtpND\nLAnK+n51JQKBgD5v04r/iVkONfPDRaaepRxZtUp8F1urMSBIuCIoos0w4yQ3CZJR\nUDXFSs/UjbvTWCHfHUU8V6Se89kKCp7/DmoOtFXInSWmoGl5ljdk390JpQH3M485\nTMywFueCJ/FSFxxRnH9grnP2plKqbAaeLMxVxJznRKpPKjeQjersu3eBAoGBAJLG\nIkN3gE8C43hlKZoSvZtjECzfPZfz+gKb9+tPG/Bi2HFQD/IYxZSVzdbz58B3DN8i\nS78y0VBe+fuMtmuVOhRVYX7Ar0JhV2hXDO7+tj7erVEQwkPSFUqkrQgN83JBGZ3o\n28tHB4TakNYZiKOn/ylRyhVXi+CU++l3Js4dld+ZAoGAO0hy7Gpsa8WGsS0Y2T31\nO/d90IJXxJ3j2/k56af9oW72LyuYAHLmCauTwLacby9+1xFhIyaV0S0DjKPC+jWT\nacX28J5yUiRYNgfks9S0ceP10kuqXPdYPXh4kOH2CfIf/XQ6JBJW4y2UQ4/PyNOx\nfdSnvw0xm2qPGw995G1zS80=\n-----END PRIVATE KEY-----\n",
    client_email: "googlesheetseditor@linkedinautomation-393307.iam.gserviceaccount.com",
    client_id: "115746319455079936696",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/googlesheetseditor%40linkedinautomation-393307.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };
}

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
