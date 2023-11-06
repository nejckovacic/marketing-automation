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
