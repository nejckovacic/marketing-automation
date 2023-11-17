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

//Add global style
addGlobalStyle();

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
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, cardElement[0]);
    if (person != null) {
      person.addElement({ type: "userRow", element: cardElement[0], exists: true });
      person.updateElements("userRow");
    }
  });

  ////Detect person details (.../sales/inbox/...) / (.../sales/list/people/...)
  waitForKeyElements(".conversation-insights__section:first", (insightElement) => {
    var userData = readChatUserInfo(insightElement[0]);
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, insightElement[0]);
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
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, profileElement[0]);

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
    if (userData == null) {
      return null;
    }
    //checks if user exists (false disables the alert)
    var person = people.findPersonWithNameAndID(userData.fullName, userData.id, userRowElement[0]);

    if (person != null) {
      person.addElement({ type: "userRow", element: userRowElement[0], exists: true });
      person.updateElements("userRow");
    }
  });
});
