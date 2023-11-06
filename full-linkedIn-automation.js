class Person {
  constructor(
    firm,
    fullName,
    role,
    leadSource = "LI Sales Navigator",
    week = null,
    location,
    leadOwner = "Nejc",
    dealStatus,
    nextAction = "",
    notes = "",
    lastInteraction = new Date(),
    profileID,
    history = "",
    position = null,
    elements = []
  ) {
    this.firm = firm;
    this.fullName = fullName;
    this.name = fullName.split(" ")[0];
    this.role = role;
    this.leadSource = leadSource;
    this.week = week;
    this.location = location;
    this.leadOwner = leadOwner;
    this.dealStatus = dealStatus;
    this.nextAction = nextAction;
    this.notes = notes;
    this.lastInteraction = lastInteraction;
    this.profileID = profileID;
    this.history = history;
    this.position = position;
    this.elements = elements;
  }

  updateID(id) {
    this.profileID = id;
    this.updateElements();
    updatePersonOnGS(this);
  }

  updateStatus(status) {
    var now = new Date();
    this.lastInteraction = now;
    this.dealStatus = status;
    this.history += ", " + status;
    this.updateElements();
    updatePersonOnGS(this);
  }

  updateDesc(notes, nextAction) {
    this.notes = notes;
    this.nextAction = nextAction;
    this.updateElements();
    updatePersonOnGS(this);
  }

  updatePosition(position) {
    this.position = position;
    this.updateElements();
  }

  addElement(element) {
    this.elements.push(element);
  }

  clearElements() {
    this.elements = [];
  }

  updateElements(type = "any") {
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
  }

  removeElement(index) {
    this.elements;
  }
}

class People {
  constructor() {
    this.people = [];
    this.lastUpdatedTime = "";
  }

  setUpdateTime() {
    this.lastUpdatedTime = new Date();
  }

  //for messaging
  newPerson(firm, fullName, role, leadSource, week, location, leadOwner, dealStatus, nextAction, notes, lastInteraction, profileID, history, position, elements) {
    let p = new Person(firm, fullName, role, leadSource, week, location, leadOwner, dealStatus, nextAction, notes, lastInteraction, profileID, history, position, elements);
    this.people.push(p);
  }

  //when adding people to the list
  addContact(firm, fullName, role, location, dealStatus, profileID) {
    let p = new Person(firm, fullName, role, undefined, undefined, location, undefined, dealStatus, undefined, undefined, undefined, profileID, undefined, undefined, undefined);
    this.people.push(p);
    addContactToGS(p);
    manuallyUpdateProfile();
    manuallyColorUserRows();
  }

  ///not yet added
  checkDataAge() {
    var currTime = new Date();
    if ((currTime - this.lastUpdatedTime).getTime() > 60 * 1000 * 60 * 8) {
      //8 h
      this.people = [];
      loadGoogleSheetsPeople();
    }
  }

  findPersonWithID(id) {
    this.people.forEach((person) => {
      if (person.profileID == id) {
        return person;
      } else {
        console.log(id + " has not been found in the system.");
        //alert(id + " has not been found in the system.");
      }
    });
  }

  findPersonWithNameAndID(fullName, id, alert = true) {
    var person;
    this.people.forEach((p) => {
      if (p.fullName == fullName && (p.profileID == id || p.profileID == "noID")) {
        person = p;
      }
    });
    ///if no match
    if (person != null) {
      return person;
    } else {
      console.log("no exact match: " + fullName + " - " + id);
      var possibleMatches = [];
      this.people.forEach((person) => {
        if (person.fullName == fullName) {
          possibleMatches.push(person);
          console.log(person);
        }
      });
      //check if there are not multiple people with the same name
      if (possibleMatches.length == 1) {
        possibleMatches[0].updateID(id);
        return possibleMatches[0];
      } else if (possibleMatches.length > 1) {
        console.log("There are multiple matches for name " + fullName);
        if (alert) {
          sendAlert("There are multiple matches for name " + fullName, "alert" + fullName);
        }
        return null;
      }
      console.log(fullName + " with ID: " + id + " has not been found in the system.");
      return null;
    }
  }

  get allPeople() {
    return this.people;
  }

  get numberOfPeople() {
    return this.people.length;
  }
}

class Flows {
  constructor() {
    this.flows = [];
  }

  newFlow(id, name, nameShort, waitTime, outcomes) {
    let flow = {
      id: id,
      name: name,
      nameShort: nameShort,
      waitTime: waitTime,
      outcomes: outcomes,
    };

    this.flows.push(flow);
  }

  getFlowPropertiesBasedOnName(currentStatus) {
    return this.flows.find((flow) => flow.name === currentStatus);
  }

  getFlowPropertiesBasedOnNameShort(nameShort) {
    return this.flows.find((flow) => flow.nameShort === nameShort);
  }

  getAllFlows() {
    return this.flows;
  }
}

class Texts {
  constructor() {
    this.texts = [];
  }

  newText(id, name, buttonName, fullTexts) {
    let text = {
      id: id,
      name: name,
      buttonName: buttonName,
      fullTexts: fullTexts,
    };
    this.texts.push(text);
  }

  getText(name) {
    return this.texts.find((text) => text.name === name);
  }
}

//https://coolors.co/696d7d-f0f7ee-c4d7f2-afdedc-e9c2af
const color = {
  //red-ish
  requiresAttention: "#E9C2AF",
  //blue-ish
  waiting: "#C4D7F2",
  //green-ish
  success: "#AFDEDC",
  //super light green
  used: "#CFD6CD",
};
/*
const primary = "";
const secondary = "";
const info = "";
const warning = "";
const danger = "";
const neutral1 = "";
const neutral2 = "";
*/

function sendAlert(message, type) {
  if (!alerts.includes(type)) {
    alerts.push(type);
    alert(message);
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
        button.style.cssText = "background-color: " + color.waiting + "; font-size:12px; border-radius: 6px; border-style: none; padding: 6px 10px; margin: 3px 2px;";
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

  if (statusDetails.nameShort != "Redirected" && statusDetails.nameShort != "Lead Lost" && statusDetails.nameShort != "Initial meeting done") {
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

  var location = element.querySelector("._lockup-links-container_sqh8tm").querySelector("div").textContent.trim().split(", ");

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

function readMinimalInfo(element) {
  var fullName = element.querySelector('[data-anonymize="person-name"]').innerHTML.trim();
  var imgUrl = element.querySelector('img[data-anonymize="headshot-photo"]').src;
  var id;
  if (imgUrl.includes("https:")) {
    id = imgUrl.match(/image\/(.+)\/profile/)[1];
  } else {
    id = null;
  }

  return {
    id: id,
    fullName: fullName,
    name: fullName.split(" ")[0],
  };
}

const customCSS = 'p {\n  color: red;\n  background-color: aqua;\n}\n';

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

function loadGoogleSheetsData(area) {
  fetchAccessToken()
    .then((accessToken) => {
      const requestUrl = `https://sheets.googleapis.com/v4/spreadsheets/${area.spreadsheetId}/values/${area.cellRange}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", requestUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const values = response.values;
          parseValues(area, values);
          updateAndDisplaySheetsStatus(area, values.length);
        } else {
          console.error("Error reading rows:", xhr.status);
          updateAndDisplaySheetsStatus(area, 0);
        }
      };

      xhr.onerror = function () {
        console.error("Error reading rows.");
        updateAndDisplaySheetsStatus(area, 0);
      };

      xhr.send();
    })
    .catch((error) => {
      console.error(error);
    });
}

function parseValues(area, values) {
  for (let i = 0; i < values.length; i++) {
    switch (area.name) {
      case "flows":
        flows.newFlow(
          values[i][0], //id
          values[i][1], //name
          values[i][2], //nameShort
          values[i][3], //waitTime
          (outcomes = [
            {
              target: values[i][4], //outcome-1-target
              text: values[i][5], //outcome-1-text
            },
            {
              target: values[i][6], //outcome-2-target
              text: values[i][7], //outcome-2-text
            },
            {
              target: values[i][8], //outcome-3-target
              text: values[i][9], //outcome-3-text
            },
            {
              target: values[i][10], //outcome-4-target
              text: values[i][11], //outcome-4-text
            },
            {
              target: values[i][12], //outcome-5-target
              text: values[i][13], //outcome-5-text
            },
            {
              target: values[i][14], //outcome-6-target
              text: values[i][15], //outcome-6-text
            },
            {
              target: values[i][16], //outcome-7-target
              text: values[i][17], //outcome-7-text
            },
          ])
        );
        break;

      case "texts":
        texts.newText(
          values[i][0], //id
          values[i][1], //name
          values[i][2], //buttonName
          (fullTexts = {
            slo: {
              subject: values[i][3], //subjectSLO
              content: values[i][4], //contentSLO
            },
            eng: {
              subject: values[i][5], //subjectENG
              content: values[i][6], //contentENG
            },
          })
        );

        break;

      case "people":
        people.newPerson(
          values[i][0], //firm
          values[i][1], //fullName
          values[i][2], //role
          values[i][3], //leadSource
          values[i][4], //week
          values[i][5], //location
          values[i][6], //leadowner
          values[i][7], //dealStatus
          values[i][8], //nextAction
          values[i][9], //notes
          values[i][10], //lastInteraction
          values[i][11], //profileID
          values[i][12] == null ? values[i][7] : values[i][12], //history
          i + 2 //position
        );
        break;

      default:
        console.log("No Area Found");
        break;
    }
  }
}

function updatePersonOnGS(person) {
  fetchAccessToken()
    .then((accessToken) => {
      var targetRange = "Mktg-leads!A" + person.position + ":M" + person.position;
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${areas.people.spreadsheetId}/values/${targetRange}?valueInputOption=USER_ENTERED`;

      const data = {
        values: [
          [
            person.firm,
            person.fullName,
            person.role,
            person.leadSource,
            person.week,
            person.location,
            person.leadOwner,
            person.dealStatus,
            person.nextAction,
            person.notes,
            person.lastInteraction,
            person.profileID,
            person.history,
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

function addContactToGS(person) {
  console.log(person);
  fetchAccessToken().then((accessToken) => {
    let currDate = new Date();
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${areas.people.spreadsheetId}/values/${areas.people.sheetName}!A1:append?valueInputOption=USER_ENTERED`;

    const data = {
      values: [
        [
          person.firm,
          person.fullName,
          person.role,
          "LI Sales Navigator",
          "",
          person.location,
          "Nejc",
          person.dealStatus,
          "",
          "",
          currDate.toISOString(),
          person.profileID,
          flows.getFlowPropertiesBasedOnNameShort("Connection request sent").name,
        ],
      ],
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
        person.updatePosition(newPosition);
        updateAndDisplaySheetsStatus(areas.people, areas.people.dataRetrieved + 1);
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

//displays status of the google sheets data over the page
function updateAndDisplaySheetsStatus(area, number) {
  area.dataRetrieved = number;

  let gsStatusDiv;
  gsStatusDiv = document.getElementById("gsStatus");
  if (gsStatusDiv == null) {
    gsStatusDiv = document.createElement("div");
  }

  gsStatusDiv.style.position = "fixed";
  gsStatusDiv.style.top = 0;
  gsStatusDiv.style.left = 0;
  gsStatusDiv.style.backgroundColor = color.waiting;
  gsStatusDiv.style.fontSize = "8px";
  gsStatusDiv.style.padding = "3px";
  gsStatusDiv.style.zIndex = "999999";
  gsStatusDiv.setAttribute("id", "gsStatus");

  gsStatusDiv.innerHTML =
    "<p style='font-size:14px'>Texts: <b>" +
    (areas.texts.dataRetrieved > 0 ? areas.texts.dataRetrieved : "Error") +
    "</b></p>" +
    "<p style='font-size:14px'>Flows: <b>" +
    (areas.flows.dataRetrieved > 0 ? areas.flows.dataRetrieved : "Error") +
    "</b></p>" +
    "<p style='font-size:14px'>People: <b>" +
    (areas.people.dataRetrieved > 0 ? areas.people.dataRetrieved : "Error") +
    "</b></p>";

  document.body.appendChild(gsStatusDiv);
}

"use strict";

// Google Sheets document and cell range
var serviceAccount;
var areas = {
  flows: {
    name: "flows",
    spreadsheetId: "1GaHllBY0F7SHE-UKJokuVBhHpJHb2g_FNv6PEbEkihM",
    sheetName: "leads-flow",
    cellRange: "leads-flow!A26:R47",
    dataRetrieved: 0,
  },
  texts: {
    name: "texts",
    spreadsheetId: "1GaHllBY0F7SHE-UKJokuVBhHpJHb2g_FNv6PEbEkihM",
    sheetName: "leads-flow",
    cellRange: "leads-flow!A3:G22",
    dataRetrieved: 0,
  },
  people: {
    name: "people",
    spreadsheetId: "1GaHllBY0F7SHE-UKJokuVBhHpJHb2g_FNv6PEbEkihM",
    sheetName: "Mktg-leads",
    cellRange: "Mktg-leads!A2:M2000",
    dataRetrieved: 0,
  },
};

//Initialize class
let texts = new Texts();
let flows = new Flows();
let people = new People();

//initialize alerts
var alerts = [];

//initialize variables
var activeSection;
var secondarySection;

//////Google sheets configuration
configureGoogleAuthVars();
loadGoogleSheetsData(areas.flows);
loadGoogleSheetsData(areas.texts);
loadGoogleSheetsData(areas.people);

///////////////////////////////////////
//////////Detect elements//////////////
///////////////////////////////////////

waitForKeyElements("#gsStatus:first", () => {
  ////Detect Inbox elements (.../sales/inbox/...)
  waitForKeyElements(".conversation-list-item__link", (cardElement) => {
    var userData = readMinimalInfo(cardElement[0]);
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id);
    if (person != null) {
      person.addElement({ type: "userRow", element: cardElement[0], exists: true });
      person.updateElements("userRow");
    }
  });

  ////Detect person details (.../sales/inbox/...) / (.../sales/list/people/...)
  waitForKeyElements(".conversation-insights__section:first", (insightElement) => {
    var userData = readChatUserInfo(insightElement[0]);
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id);
    if (person != null) {
      person.addElement({ type: "userChatProfile", element: insightElement[0], exists: true });
      person.updateElements("userChatProfile");
    } else {
      addButtonsAndStatsForNewChat(userData, insightElement[0]);
    }
  });

  ////Detect people details (.../sales/list/people/...)
  waitForKeyElements("section._header_sqh8tm:first", (profileElement) => {
    //read user info from page
    var userData = readUserInfo(profileElement[0]);
    //checks if user exists (false disables the alert)
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, false);

    if (person != null && !window.location.href.includes("/sales/lists/people/")) {
      person.addElement({ type: "userChatProfile", element: profileElement[0], exists: true });
      person.updateElements("userChatProfile");
    } else if (person != null) {
      person.addElement({ type: "userProfile", element: profileElement[0], exists: true });
      person.updateElements("userProfile");
    } else {
      addButtonsAndStatsForNew(userData, profileElement[0]);
    }
  });

  /////Color all user rows (.../sales/list/people/...)
  waitForKeyElements("tr.artdeco-models-table-row", (userRowElement) => {
    //read user info from page
    var userData = readMinimalInfo(userRowElement[0]);

    //checks if user exists (false disables the alert)
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, false);

    if (person != null) {
      person.addElement({ type: "userRow", element: userRowElement[0], exists: true });
      person.updateElements("userRow");
    }
  });
});
