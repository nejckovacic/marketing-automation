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
  }

  findPersonWithName(fullName) {
    var company;
    this.companies.forEach((c) => {
      if (c.fullName == fullName) {
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

function addStatsForExisting(person, element, addBtns = true) {
  var statusDetails = flows.getFlowPropertiesBasedOnName(person.dealStatus);
  var waitInteraction = false;

  //calculate the time of first interaction and next planned interaction
  var difLastInt = calculateTimeDifferenceISO(person.lastInteraction);
  var difNextInt = calculateTimeDifferenceISO(person.lastInteraction, statusDetails.waitTimeH);

  //checks if there is already a status section and if not creates a new one
  var statusSection;
  if (!element.parentElement.innerHTML.includes('id="statusSection"')) {
    statusSection = document.createElement("section");
    statusSection.setAttribute("id", "statusSection");
    element.after(statusSection);
  } else {
    statusSection = element.parentElement.querySelector("#statusSection");
  }
  //Adding general status information of the person
  statusSection.innerHTML =
    '<div style="margin-top: 5px; padding:8px">' +
    '   <div id="currentUserStatus" style="width:65%; display: inline-block;">' +
    '      <button id="currentUserStatusBtn" style="text-align: left; font-weight: bold; font-size:14px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;"> ▽ ' +
    person.dealStatus +
    "</button>" +
    "   </div>" +
    '   <p id="position" style="width:20%; display: inline-block; text-align: right; color:#696D7D;"><a href="https://docs.google.com/spreadsheets/d/1GaHllBY0F7SHE-UKJokuVBhHpJHb2g_FNv6PEbEkihM/edit#gid=883336729" target="_blank">' +
    person.position +
    "</a></p>" +
    '   <p id="lastInteraction" style="text-align: center; color:#696D7D;">Last: ' +
    difLastInt.split.days +
    "d, " +
    difLastInt.split.hours +
    "h and " +
    difLastInt.split.minutes +
    "m ago</p>" +
    '   <p id="nextInteraction" style="display: none; text-align: center; color:#696D7D;">Planned: ' +
    difNextInt.split.days +
    "d, " +
    difNextInt.split.hours +
    "h and " +
    difNextInt.split.minutes +
    "m</p>" +
    '   <p contentEditable="true" id="userNotes" style="color:#696D7D;">' +
    person.notes +
    "</p>" +
    '   <p contentEditable="true" id="nextAction" style="color:#696D7D;">' +
    person.nextAction +
    "</p>" +
    '   <button id="updateDesc" style="display: none; background-color: #AFDEDC; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 12px 2px 0 0;">Update</button>' +
    "</div>" +
    '<hr style="margin:2px">' +
    (addBtns ? '<div id="buttonsArea" style="text-align:center"></div>' : "") +
    '<hr style="margin:2px">';

  //check if second timer should be display (not displayed if is = 00:00:00)
  if (waitInteraction) {
    document.getElementById("nextInteraction").style.display = "block";
  }

  if (statusDetails.hasOwnProperty("waitTimeH")) {
    document.getElementById("lastInteraction").style.display = "block";
  }

  ///Adding the button to update the description
  document.getElementById("userNotes").addEventListener("input", function () {
    document.getElementById("updateDesc").style.display = "block";
  });
  document.getElementById("nextAction").addEventListener("input", function () {
    document.getElementById("updateDesc").style.display = "block";
  });
  document.getElementById("updateDesc").addEventListener("click", function () {
    person.updateDesc(document.getElementById("userNotes").innerHTML, document.getElementById("nextAction").innerHTML);
  });

  //Adding dropdown menu
  var userStatusChange = document.getElementById("currentUserStatus");
  var userStatusChangeBtn = document.getElementById("currentUserStatusBtn");
  userStatusChange.addEventListener("mouseenter", () => {
    userStatusChangeBtn.style.backgroundColor = color.waiting;
    dropdownToggle(true, person);
  });

  userStatusChange.addEventListener("mouseleave", () => {
    userStatusChangeBtn.style.backgroundColor = "";
    dropdownToggle(false, person);
  });
}

function dropdownToggle(display, person) {
  var button = document.getElementById("currentUserStatus");
  var dropdown = document.getElementById("statusesDropdown");

  if (dropdown != null) {
    if (display) {
      dropdown.style.display = "block";
    } else {
      dropdown.style.display = "none";
    }
  } else {
    if (display) {
      dropdown = document.createElement("div");
      dropdown.style.backgroundColor = "rgba(188, 188, 188, 0.9)";
      dropdown.style.borderRadius = "5px";
      dropdown.style.display = "block";
      dropdown.style.textAlign = "center";
      //dropdown.style.width = "100%";
      dropdown.style.zIndex = "9999";
      dropdown.style.position = "absolute";
      dropdown.setAttribute("id", "statusesDropdown");
      const allFlows = flows.getAllFlows();
      allFlows.forEach((flow) => {
        var btn = document.createElement("button");
        btn.setAttribute("id", "changeStatusTo" + flow.id);
        btn.style.backgroundColor = color.waiting;
        btn.style.fontWeight = "bold";
        btn.style.fontSize = "12px";
        btn.style.borderRadius = "6px";
        btn.style.borderStyle = "none";
        btn.style.padding = "6px 10px";
        btn.style.margin = "3px 2px";
        btn.innerHTML = flow.name;
        dropdown.append(btn);

        btn.addEventListener("mouseenter", () => {
          btn.style.backgroundColor = "";
        });

        btn.addEventListener("mouseleave", () => {
          btn.style.backgroundColor = color.waiting;
        });

        btn.addEventListener("click", () => {
          person.updateStatus(flow.name);
          manuallyColorUserRows();
          manuallyUpdateProfile();
        });
      });
      button.append(dropdown);
    }
  }
}

function addButtonsForExisting(person) {
  var statusDetails = flows.getFlowPropertiesBasedOnName(person.dealStatus);

  //checks which language should be selected
  var language = "eng";
  if (person.location.includes("Slovenia") || person.location.includes("Slovenija")) {
    language = "slo";
  }

  //creates buttons to send messages
  var buttonsArea = document.getElementById("buttonsArea");
  if (statusDetails.hasOwnProperty("outcomes")) {
    buttonsArea.innerHTML = "";
    for (let n = 0; n < statusDetails.outcomes.length; n++) {
      const outcome = statusDetails.outcomes[n];
      if (outcome.target != null) {
        let btnText = outcome.text.split(" ").slice(1).join(" ");
        let button = document.createElement("button");
        button.id = "button_" + n; // use a unique id
        button.style.cssText =
          "background-color: " +
          color.waiting +
          "; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;";
        button.innerHTML = btnText;

        button.addEventListener("click", function () {
          generateMessage(language, outcome, person);
        });
        buttonsArea.appendChild(button);
      }
    }
  } else {
    //reactivate old chat button
    buttonsArea.innerHTML =
      '<button id="reactivated" style="background-color: ' +
      color.waiting +
      '; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;">Chatting</button>';
    document.getElementById("reactivated").addEventListener("click", function () {
      generateMessage(language, flows.getFlowPropertiesBasedOnNameShort("Chatting"), person);
    });
  }
}

function addButtonsAndStatsForNewChat(personInfo, element) {
  //checks if there is already a status section and if not creates a new one
  var statusSection;
  if (!element.parentElement.innerHTML.includes('id="statusSection"')) {
    statusSection = document.createElement("section");
    statusSection.setAttribute("id", "statusSection");
    element.after(statusSection);
  } else {
    statusSection = element.parentElement.querySelector("#statusSection");
  }

  statusSection.innerHTML =
    '<hr style="margin:2px">' +
    '<div id="buttonsArea" style="text-align:center">' +
    //connect button
    '<button id="addPerson" style="background-color: ' +
    color.success +
    '; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;">Add person</button>' +
    "</div>" +
    '<hr style="margin:2px">';

  document.getElementById("addPerson").addEventListener("click", function () {
    people.addContact(
      personInfo.firm,
      personInfo.fullName,
      personInfo.occupation,
      personInfo.location,
      flows.getFlowPropertiesBasedOnNameShort("Chatting").name,
      personInfo.profileID
    );
  });
}

function addButtonsAndStatsForNew(minPerson, element) {
  //checks if there is already a status section and if not creates a new one
  var statusSection;
  if (!element.parentElement.innerHTML.includes('id="statusSection"')) {
    statusSection = document.createElement("section");
    statusSection.setAttribute("id", "statusSection");
    element.after(statusSection);
  } else {
    statusSection = element.parentElement.querySelector("#statusSection");
  }

  //Adding general status information of the person
  statusSection.innerHTML =
    '<hr style="margin:2px">' +
    '<div id="buttonsArea" style="text-align:center">' +
    //connect button
    '<button id="connectBtn" style="background-color: ' +
    color.success +
    '; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;">Connect</button>' +
    //connect knowledgeable button
    "</div>" +
    '<hr style="margin:2px">';

  document.getElementById("connectBtn").addEventListener("click", function () {
    tryConnecting(minPerson, element);
  });
}

function tryConnecting(personInfo, element) {
  //events
  var clickEvent = new Event("click", {
    bubbles: true,
    cancelable: true,
  });
  var inputEvent = new Event("input", {
    bubbles: true,
    cancelable: true,
  });

  //checks which language should be selected
  var language = "eng";
  if (personInfo.location.includes("Slovenia") || personInfo.location.includes("Slovenija")) {
    language = "slo";
  }

  //clicks on ... menu button
  element.querySelector('[aria-label="Open actions overflow menu"]').dispatchEvent(clickEvent);

  //waits for menu to show
  waitForKeyElements('button:has(> div:contains("Connect")):first', (conButton) => {
    conButton[0].dispatchEvent(clickEvent);
    waitForKeyElements("#connect-cta-form__invitation:first", (textAreaElement) => {
      //create button to change language
      if (document.getElementById("langChangeBtn") == null) {
        const langChange = document.createElement("div");
        langChange.innerHTML =
          '<button id="langChangeBtn" style="background-color: ' +
          color.waiting +
          '; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;">Change language</button>';
        document.getElementById("connect-cta-form__invitation").after(langChange);
        document.getElementById("langChangeBtn").addEventListener("click", function () {
          if (language == "eng") {
            language = "slo";
          } else {
            language = "eng";
          }
          var textArea = textAreaElement[0];
          var template = texts.getText("1 Request");
          var message = template.fullTexts[language].content.replace("[name]", personInfo.name);
          textArea.focus();
          textArea.value = message;
          textArea.dispatchEvent(inputEvent);
        });
      }

      var textArea = textAreaElement[0];
      var template;
      template = texts.getText("1 Request");
      var message = template.fullTexts[language].content.replace("[name]", personInfo.name);
      textArea.focus();
      textArea.value = message;
      textArea.dispatchEvent(inputEvent);
    });
  });
  people.addContact(
    personInfo.firm,
    personInfo.fullName,
    personInfo.occupation,
    personInfo.location,
    flows.getFlowPropertiesBasedOnNameShort("Connection request sent").name,
    personInfo.profileID
  );
}

function generateMessage(language, outcome, person) {
  var targetArea = document.getElementsByName("message")[0];
  var subjectArea = document.querySelector('[placeholder="Subject (required)"]');
  var text = texts.getText(outcome.text);
  if (text.fullTexts[language].content != null) {
    var template = text.fullTexts[language].content;
    console.log(template);
    var message = template.replace("[name]", person.name);
    console.log(message);
    //input event
    var inputEvent = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    if (subjectArea != null) {
      var subject = text.fullTexts[language].subject;
      subjectArea.focus();
      subjectArea.value = subject;
      subjectArea.dispatchEvent(inputEvent);
    }
    targetArea.focus();
    targetArea.value = message;
    targetArea.dispatchEvent(inputEvent);
  } else {
    console.log("just status update");
  }
  console.log("start update");
  person.updateStatus(outcome.target);
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

function manuallyUpdateProfile() {
  var allProfiles = document.querySelectorAll("section._header_sqh8tm");
  if (allProfiles == null) {
    allProfiles = document.querySelectorAll(".conversation-insights__section:first");
  }
  allProfiles.forEach((profile) => {
    //read user info from page
    var userData = readUserInfo(profile);

    //checks if user exists (false disables the alert)
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, false);

    if (person != null && !window.location.href.includes("/sales/lists/people/")) {
      person.addElement({ type: "userChatProfile", element: profile, exists: true });
      person.updateElements("userChatProfile");
    } else if (person != null) {
      person.addElement({ type: "userProfile", element: profile, exists: true });
      person.updateElements("userProfile");
    } else {
      addButtonsAndStatsForNew(userData, profile);
    }
  });
}

////////////////add users///////////////
function readUserInfo(element) {
  var fullName = element.querySelector('a[data-anonymize="person-name"]').innerHTML.trim();
  var imgUrl = element.querySelector('img[data-anonymize="headshot-photo"]').src;
  var headline = element.querySelector('[data-anonymize="headline"]').innerHTML.trim();
  var occupation = "";
  var firm,
    id = "";

  occupation = document.getElementById("profile-card-section").querySelector('[data-anonymize="job-title"]').innerHTML;
  firm = document.getElementById("profile-card-section").querySelector('[data-anonymize="company-name"]').innerHTML;
  if (occupation == "") {
    if (headline.search(" at ") > 0) {
      occupation = headline.split(" at ")[0].trim();
      firm = headline.split(" at ")[1].trim();
    } else if (headline.search(" @ ") > 0) {
      occupation = headline.split(" @ ")[0].trim();
      firm = headline.split(" @ ")[1].trim();
    }
  }

  var location = element
    .querySelector("._lockup-links-container_sqh8tm")
    .querySelector("div")
    .textContent.trim()
    .split(", ");

  if (imgUrl.includes("https:")) {
    id = imgUrl.match(/image\/(.+)\/profile/)[1];
  } else {
    id = null;
  }

  return {
    id: id,
    fullName: fullName,
    name: fullName.split(" ")[0],
    occupation: occupation,
    firm: firm,
    location: location[location.length - 1],
  };
}

function readChatUserInfo(element) {
  var fullName = element.querySelector('span[data-anonymize="person-name"]').innerHTML.trim();
  var imgUrl = element.querySelector('img[data-anonymize="headshot-photo"]').src;
  var headline = element.querySelector('[data-anonymize="headline"]').innerHTML.trim();
  var occupation = "";
  var firm,
    id = "";

  if (occupation == "") {
    if (headline.search(" at ") > 0) {
      occupation = headline.split(" at ")[0].trim();
      firm = headline.split(" at ")[1].trim();
    } else if (headline.search(" @ ") > 0) {
      occupation = headline.split(" @ ")[0].trim();
      firm = headline.split(" @ ")[1].trim();
    }
  }

  var location = element.querySelector('[data-anonymize="location"]').innerHTML.trim().split(", ");

  if (imgUrl.includes("https:")) {
    id = imgUrl.match(/image\/(.+)\/profile/)[1];
  } else {
    id = null;
  }

  return {
    id: id,
    fullName: fullName,
    name: fullName.split(" ")[0],
    occupation: occupation,
    firm: firm,
    location: location[location.length - 1],
  };
}

///////////////////////////////////////////////

function addButtonToEachRow() {
  const table = document.querySelector("#tableRezultati > tbody");
  const rows = table.getElementsByTagName("tr");

  for (const row of rows) {
    let nameElement = row.querySelector("td:first-child a");
    let fullName = nameElement.textContent;
    let name = fullName.replace("D.D.", "").replace("d.d.", "").replace("d.o.o.", "").replace(",", "").trim();

    var company = companies.findPersonWithName(fullName);
    if (company != null) {
      console.log(company);
      row.classList.add("warning");
      //ce je ze kontaktirana pol druga barva TO DO
    } else {
      row.classList.add("info");
      company = {
        name: name,
        fullName: fullName,
      }; //tuki rabm narest dejanski company from class
      console.log(company);
      addCompanyToGS(company);
    }

    let nameCell = row.querySelector("td:nth-child(1)");
    nameCell.classList.add("clickable");
    nameCell.addEventListener("click", function () {
      copyToClipboard(name);
      try {
        row.classList.remove("warning");
        row.classList.remove("info");
      } catch (e) {}
      row.classList.add("success");
    });
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
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";

  button.addEventListener("click", function () {
    addButtonToEachRow();
  });

  // Append the button to the body of the document
  document.body.appendChild(button);
  console.log("buttonAdded");
}

const customCSS = ':root {\n  --danger: #e9c2af;\n  --normal: #c4d7f2;\n  --success: #afdedc;\n  --secondary: #cfd6cd;\n}\n\nbody {\n  transition: background-color 0.15s ease-in-out;\n}\n\n.clickable {\n  filter: brightness(100%);\n}\n\n.clickable:hover {\n  cursor: pointer;\n  filter: brightness(80%);\n}\n\n.custom-button {\n  background-color: var(--normal);\n  filter: brightness(100%);\n\n  padding: 10px 20px;\n  background-color: var(--normal);\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n.custom-button:hover {\n  filter: brightness(70%);\n}\n\n.notice {\n  background-color: rgb(255, 100, 80);\n}\n';

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
          console.log(values);
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
      values[i][1], //firm
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

function updateCompanyOnGS(company) {
  fetchAccessToken()
    .then((accessToken) => {
      var targetRange = gsCompanies.sheetName + "!A" + company.position + ":H" + company.position;
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${gsCompanies.spreadsheetId}/values/${targetRange}?valueInputOption=USER_ENTERED`;

      const data = {
        values: [
          [
            company.name,
            company.fullName,
            company.contacted,
            company.area,
            company.country,
            company.numberOfEmployees,
            company.money,
            company.source,
          ],
        ],
      };

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", updateUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("Cells updated successfully!");
        } else {
          console.error("Error updating cell value:", xhr.status);
        }
      };

      xhr.onerror = function () {
        console.error("Error updating cell value.");
      };

      xhr.send(JSON.stringify(data));
    })
    .catch((error) => {
      console.error(error);
    });
}

function addCompanyToGS(company) {
  console.log(company);
  fetchAccessToken().then((accessToken) => {
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${gsCompanies.spreadsheetId}/values/${gsCompanies.sheetName}!A1:append?valueInputOption=USER_ENTERED`;

    const data = {
      values: [[company.name, company.fullName, "FALSE", "", "Slovenia", "", "", "AJPES"]],
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
    private_key_id: "ffb201069683175b94cc9e0ddb37ddf2f4cc0b4f",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgVUQXBmsGwK1j\n7bQwDS+y1DLbo53isnQIiGPPVR4x8JRbhpuhhvv53zHVHm3D+bABjWQZYEc+mEFj\nLptVRib1gSk/dabx0BxdXZhW6Qu069UTnrdtpPamHeYac5nrcx0/hnbz0DA9gagu\nO2nvc/H/0CLMWFwJl9s/VfNKbOpt7QxxdVA/vlnXX/bA5RshF0wz9X6aH1nsHH+C\nPoyk66ljaaVtri668Ph8cHI6qyneK3sdvyx3xFt1i9KbGGmOLDWHo2xtVKO77155\nvqj/6+7DfOtuOUzwMXlSPQNfR6VQacktNDExheRiExw/NOflGTi3ucBcuEjJ3BNB\nShRQjM5zAgMBAAECggEAQVAaqaqCpMCOoXtugHiOqrGIejKfmX6KiANPbWFGKJ/R\nP6uI8Hb1ZGeIfEGmA0ROb4NyeGfg/d22HToaKtWl/zJ7ZA+AT1cwhtQev6C1lSDQ\nrupj3HVryGW7m6Dl3aUKEButj0qKrDOKGDM5x0KbHVNjKY0BCSNkO9u+fN37bYWS\nn5L9NaAwWyEQ4gBY9HTMfoKza56mGtRF/UCjAQRm0t2PuT1gWNyEqlkMbYgGBEtW\nGOa6C4/Pm27WytfrrkxqmsjGqQB40LhzsP599tVtVV6/RjCqA5FIXu/CxPgwlf/9\nqlrNAEL0q0C72y1g54JyomS04sjIpVkW2CD0kSQdAQKBgQDaB2tRMwiCErxqbIee\nhA0wYuj3mRJ3cfC+8vWuCOtqdDKXgBT3JJl6c/ZqV6y3YbAJlT3pjPTkVfGoDu+R\nlhd0GEa5OOdRI4jJyjwimUrGuhm0kr9dLvRi39ixcQLSXzo72JT4CILK4Wbqw7je\ntvr/OriV+ZO6yCU709yRd53OgQKBgQC8QYnXE5ANaoHGd7LjPN9yf8AwcythcRsH\n0h/MCeNYiOVPs5y/+HzHfKHRbywsHlLSAb3TnSZUz7OdDcwXyEnBZQzY7i+IQ3ya\nXh2q1hlVuws83stzkukvB/r/C5LQ+/BuJzGnp5uTkdysuOQMR0uvYMy9RK5xFbDb\nJ9AZeNDK8wKBgAm2AOKp+jwI55l54gR+bzPzg9rbV4Y4bfejTKwGu62PJV24F7b2\nS1u35IbSBuBYGoYivpIzdAjjhxLsL2F1pO/H0QaY8Tyc74/FUS5dU4ZMba6sRpe4\n6quourcUiIKkOSzHNcNiZajxpyrXstlAnydVDzmm1xyfo4Dpq85S3JWBAoGANV/L\niewk+njJBJEpad33aEoqHlJ46S6dQFFl7H6dM5vUkA1XkuIL1q9SXcPMXVHXn20Y\n+edjV8ZvoUapJ9EEgE17IAIf/d1MdaPbe3UqR7E5VW/BdSog7NGxayBH5vKXT1PT\nczpFFMjVLS9akNSh875ZLgxL/QnuU6RtDtu/LtsCgYEAw0v0nBDsR/SAv9wQRftc\nsEUhBqFlYeyDGCgT0YAivnz13QGCxoZX5vJ0Cdat8mOQ8GSLQ5OhzkqWczMpmh/n\nr4a+ZNiXWDwcdglgsbeiXg09FdjiqTeV4w5BMrIxMamBoF8w7mKtjzxWLwWTrjDf\nGSM2hn+fnNZz5CGXn68znLs=\n-----END PRIVATE KEY-----\n",
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
