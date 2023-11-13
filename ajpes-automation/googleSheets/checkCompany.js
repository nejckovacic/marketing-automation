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
