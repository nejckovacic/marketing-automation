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
