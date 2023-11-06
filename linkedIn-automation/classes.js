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
