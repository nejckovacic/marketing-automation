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
