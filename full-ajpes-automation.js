class Company {
  constructor(
    name,
    fullName,
    contacted = false,
    area = "",
    country = "Slovenia",
    numberOfEmployees = "",
    money = "",
    source = "AJPES",
    position = ""
  ) {
    this.name = name;
    this.fullName = fullName;
    this.contacted = contacted;
    this.area = area;
    this.country = country;
    this.numberOfEmployees = numberOfEmployees;
    this.money = money;
    this.source = source;
    this.position = position;
  }

  updateContacted() {
    this.contacted = true;
    //TO DO this.updateElements();
    updateCompanyOnGS(this);
  }

  updatePosition(position) {
    this.position = position;
    //TO DO this.updateElements();
  }

  /* updateElements(type = "any") {
    for (let i = 0; i < this.elements.length; i++) {
      let currElement = this.elements[i];
      if (document.body.contains(currElement.element) && currElement.exists == true) {
        if (currElement.type == "userRow" && (type == "any" || type == "userRow")) {
          updateColor(this, this.elements[i].element);
        } else if (currElement.type == "userProfile" && (type == "any" || type == "userProfile")) {
          updateColor(this, this.elements[i].element);
          addStatsForExisting(this, currElement.element, false);
        } else if (currElement.type == "userChatProfile" && (type == "any" || type == "userChatProfile")) {
          updateColor(this, this.elements[i].element);
          addStatsForExisting(this, currElement.element);
          addButtonsForExisting(this);
        }
      } else {
        currElement.exists = false;
      }
    }
  } */
}

class Companies {
  constructor() {
    this.companies = [];
  }

  newCompany(
    name,
    fullName,
    contacted = false,
    area = "",
    country = "Slovenia",
    numberOfEmployees = "",
    money = "",
    source = "AJPES"
  ) {
    let c = new Company(name, fullName, contacted, area, country, numberOfEmployees, money, source);
    this.companies.push(c);

    return c
  }

  findCompany(foundFullName, foundName) {
    var company;
    this.companies.forEach((c) => {
      if (c.fullName == foundFullName || c.name == foundName) {
        company = c;
      }
    });
    ///if no match
    if (company != null) {
      return company;
    } else {
      console.log(" no match");
    }
  }

  get allCompanies() {
    return this.companies;
  }

  get numberOfCompanies() {
    return this.companies.length;
  }
}

function calculateTimeDifferenceISO(pastTimeIso, addHours = 0) {
  if (pastTimeIso == null || pastTimeIso == "") {
    return {
      days: "/",
      hours: "/",
      minutes: "/",
      filled: false,
    };
  }
  var currTimeTs = new Date();
  var pastTimeTs = new Date(pastTimeIso);

  pastTimeTs = pastTimeTs.setTime(pastTimeTs.getTime() + addHours * 60 * 60 * 1000);
  // get total seconds between the times
  var delta = Math.abs(pastTimeTs - currTimeTs) / 1000;
  var days = Math.floor(delta / 86400);
  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  var seconds = delta % 60;

  return {
    split: {
      days: days,
      hours: hours,
      minutes: minutes,
      filled: true,
    },
    days: Math.abs(pastTimeTs - currTimeTs) / 86400000,
    hours: Math.abs(pastTimeTs - currTimeTs) / 3600000,
  };
}

function updateColor(person, section) {
  var statusDetails = flows.getFlowPropertiesBasedOnName(person.dealStatus);
  var timeDiff = calculateTimeDifferenceISO(person.lastInteraction);

  if (
    statusDetails.nameShort != "Redirected" &&
    statusDetails.nameShort != "Lead Lost" &&
    statusDetails.nameShort != "Initial meeting done"
  ) {
    if (Number(statusDetails.waitTime) < timeDiff.hours) {
      section.style.backgroundColor = color.requiresAttention;
    } else {
      section.style.backgroundColor = color.waiting;
    }
  } else {
    section.style.backgroundColor = color.used; //rest to white
  }
}

function manuallyColorUserRows() {
  var allRows = document.querySelectorAll("tr.artdeco-models-table-row");
  if (allRows == null) {
    allRows = document.querySelectorAll(".conversation-list-item__link");
  }
  allRows.forEach((row) => {
    //read user info from page
    var userData = readMinimalInfo(row);

    //checks if user exists (false disables the alert)
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, false);

    if (person != null) {
      person.addElement({ type: "userRow", element: row, exists: true });
      person.updateElements("userRow");
    }
  });
}

///////////////////////////////////////////////

function addButtonToEachRow() {
  const table = document.querySelector("#tableRezultati > tbody");
  if (!table) return;

  const rows = table.getElementsByTagName("tr");

  for (const row of rows) {
    let nameElement = row.querySelector("td:first-child a");
    if (!nameElement) continue;

    let fullName = nameElement.textContent.trim();
    let name = fullName
      .replace(/D\.D\.|d\.d\.|d\.o\.o\./g, "")
      .replace(",", "")
      .trim();

    let company = companies.findCompany(fullName, name);
    if (company) {
      row.classList.add("warning");
    } else {
      row.classList.add("info");
    }

    let nameCell = row.querySelector("td:nth-child(1)");
    if (!nameCell) continue;

    nameCell.classList.add("clickable");
    nameCell.addEventListener("click", () => handleRowClick(row, name, fullName));
  }
}

function handleRowClick(row, name, fullName) {
  copyToClipboard(name);
  row.classList.remove("warning", "info");
  row.classList.add("success");

  let company = companies.findCompany(fullName) || companies.findCompany(name);
  if (!company) {
    company = companies.newCompany(
      name,
      fullName,
      true,
      "",
      "Slovenia",
      row.querySelector("td:nth-child(3)").textContent,
      row.querySelector("td:nth-child(2)").textContent,
      "AJPES"
    );
    console.log("Adding company to Google Sheets", company);
    addCompanyToGS(company);
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  console.log("Text copied to clipboard");
  document.body.removeChild(textarea);
}

function addMainButton() {
  var button = document.createElement("button");
  button.id = "addButtons";
  button.textContent = "Add";
  button.classList.add("custom-button");
  button.classList.add("bottom-left-btn");
  button.addEventListener("click", function () {
    addButtonToEachRow();
  });
  document.body.appendChild(button);
  console.log("buttonAdded");
}

const customCSS = ':root {\n  --danger: #e9c2af;\n  --normal: #c4d7f2;\n  --success: #afdedc;\n  --secondary: #cfd6cd;\n}\n\nbody {\n  transition: background-color 0.15s ease-in-out;\n}\n\n.clickable {\n  filter: brightness(100%);\n}\n\n.clickable:hover {\n  cursor: pointer;\n  filter: brightness(80%);\n}\n\n.custom-button {\n  background-color: var(--normal);\n  filter: brightness(100%);\n\n  padding: 10px 20px;\n  background-color: var(--normal);\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n.bottom-left-btn {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 1000;\n}\n\n.custom-button:hover {\n  filter: brightness(70%);\n}\n\n.notice {\n  background-color: rgb(255, 100, 80);\n}\n';

function addGlobalStyle() {
  var head, style;
  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = customCSS;
  head.appendChild(style);
}

function loadGoogleSheetsData() {
  fetchAccessToken()
    .then((accessToken) => {
      const requestUrl = `https://sheets.googleapis.com/v4/spreadsheets/${gsCompanies.spreadsheetId}/values/${gsCompanies.cellRange}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", requestUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const values = response.values;
          parseValues(values);
        } else {
          console.error("Error reading rows:", xhr.status);
        }
      };

      xhr.onerror = function () {
        console.error("Error reading rows.");
      };

      xhr.send();
    })
    .catch((error) => {
      console.error(error);
    });
}

function parseValues(values) {
  for (let i = 0; i < values.length; i++) {
    companies.newCompany(
      values[i][0], //firm
      values[i][1], //firm names
      values[i][2], //contacted
      values[i][3], //area
      values[i][4], //country
      values[i][5], //numberOfEmployees
      values[i][6], //money
      values[i][7], //source
      i + 2 //position
    );
  }
}

function addCompanyToGS(company) {
  console.log(company);
  fetchAccessToken().then((accessToken) => {
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${gsCompanies.spreadsheetId}/values/${gsCompanies.sheetName}!A1:append?valueInputOption=USER_ENTERED`;

    const data = {
      values: [[company.name, company.fullName, company.contacted, "", "Slovenia", company.numberOfEmployees, company.money, "AJPES"]],
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", appendUrl, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("New row added successfully!");
        //upate position of the added user
        var newPosition = xhr.responseText.match(/updatedRange.+?!A(.+?):/)[1];
        company.updatePosition(newPosition);
      } else {
        console.error("Error adding new row:", xhr.status);
      }
    };

    xhr.onerror = function () {
      console.error("Error updating cell value.");
    };
    xhr.send(JSON.stringify(data));
  });
}

function configureGoogleAuthVars() {
  serviceAccount = {
    type: "service_account",
    project_id: "linkedinautomation-393307",
    private_key_id: "c4f73d14c8580439b963d4ac9622efd5ccddc511",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDWRTeRb/J9nLE\n7mU666L5OBA7M9EBJD7aDakHfXw50e+R29swgW4jMf7zbHURW52QXCYz/hm8Wm3f\nn14oFs95o9FcQ9m6K9gEM05M4W7X0u/i0UdiFYOmo4m26ZdmuGB8AwmpLzAFwQBC\n4ZBXvVbMhh4ss3ejfJnrGBTfQ4NPOch0CU/yXyEo7uPrEqvqZOnSpFWZNxemUixq\nCUXAYfOVWvWoU06v0YCsdRicCYChB8+3PiARBebpD2sV+CM7G2GXxPU/CrfqArvL\nZBTnTLXN/USm284N/veeGgzrUPZpPTvvALvdKYW+4QGGDEJ2tuLr9xbZvPGjHCXj\npxEvrkdPAgMBAAECggEAEzZYKJIojiboW7jsiNJy+VrLsd7jP97+NXjhdmSfipo8\nmxZJ5Ofd2qVIo0036Eif4vpFIZjslAs6wiMM4hl4N0jmxtG/gKFeQe9/1GzZd219\n/UtC34EpLQLpgO1RYB9jEd9EnHiRGwfDzFAd35s2BbBtGE1gR1pyUt5P8zNTHz/u\nBnrykT7wx1gWCKxQ+2BBa717EZNRGWnTyx+74kASZSERaDH3Vc2Re+bcbRx710Rw\nypr51AbS9Fm6n50vumq3BUwDWDXdwoO2aZIcxD08dG2F915XBkZfNVb3QpPLM/SL\nosevL4I1U34A1Sx8uRFUYCBlsMnEA74wqPwhOonC3QKBgQDtxvaCHWfI8j01jYS6\nz6ueO52g+Tlh67kobPn2unbb60rEFAHFYU09x7z4vMoE1jaDTtG1WjgwTDPly/ZW\n23dwe3//DRHU75g4SZWlRiv6QNmV78vSaHWdmXZVwGeXlMEbJJYiOsa5nA+cEYtD\nWn8ZYEhUaa5+UmH/AdmX1//EMwKBgQDSUa8royPd+KkWS9OUnT8ShBCfadxH0jFi\nUeAu86ZlICUu2Sd5Y5xMhrGjMxNb8td9+UNZ+RYUYQ4pY4NnOoG1LRGPvBT32sMg\na5BDujqzQ4D2qvniZslqtgL0VMCCfI9eHyQpiyKuCrxpmTrhD8jCR2/ao2SqWAHY\nl3WmWxP0dQKBgE1UgeM7MP+3WJTMG7itxYDGnrM1mqXwBd3R41GMvw8y7LPsVc8d\noANRrHGw5HrCOCRoQ+eZGeELR22a8di5s5SPdcc7NutrqLPVqqd/tNnEsX8D5+Pc\nOTQyLrwgwRAZPtxW/8TOHMdMq/7z7bjP+7oDCEL7w9YtcNWAgoXRp8rlAoGAaEaB\nkCQhi1NXGivcKinQdLCvwSnuQlmvjGzFtuGslSTb6p9V1/SQMMzzU9Pl/Eepmda1\nEu3RiacZK2Iga1TxrE89DsOUrdJzviY2b63snqaQUTwyCpMlt9eoHVXL4KY7OtI7\nzrEiL6I5Ci4jqCR4SAK9LWynY2GhAK8PcLxlZ2UCgYEAmesXvs4trLA3BI1hRx4G\nkYd8f1aVXZcv6n6wDhMNMI3vcK2ed1Ndq0IM7lyo7Byis/S1lQQMoYAvS2C2W3tV\nnUzYBW36bc1XQh2xUzUA3wnFxSie0uxo2q4xMAqZU/9T1ydXP78lK5F4CUQ5a00p\n4D2zwVF3ky626dICKyHnAmA=\n-----END PRIVATE KEY-----\n",
    client_email: "googlesheetseditor@linkedinautomation-393307.iam.gserviceaccount.com",
    client_id: "115746319455079936696",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/googlesheetseditor%40linkedinautomation-393307.iam.gserviceaccount.com",
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

"use strict";
/////////////
//Pre-start declarations
/////////////
addGlobalStyle();

// Google Sheets document and cell range

var gsCompanies = {
  spreadsheetId: "1GaHllBY0F7SHE-UKJokuVBhHpJHb2g_FNv6PEbEkihM",
  sheetName: "Mktg-companies",
  cellRange: "Mktg-companies!A2:H2001",
};

let companies = new Companies();

//////Google sheets configuration
var serviceAccount;
configureGoogleAuthVars();
loadGoogleSheetsData();

/////////////
//Start main
/////////////
addMainButton();
