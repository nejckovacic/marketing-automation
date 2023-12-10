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
