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

function readMinimalInfo(element) {
  var fullNameElement = element.querySelector('[data-anonymize="person-name"]');
  if (fullNameElement != null) {
    var fullName = fullNameElement.innerHTML?.trim();
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
}
