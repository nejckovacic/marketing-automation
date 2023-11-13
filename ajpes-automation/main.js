function addButtonToEachRow() {
  const table = document.querySelector("#tableRezultati > tbody");
  const rows = table.getElementsByTagName("tr");

  for (const row of rows) {
    let nameCell = row.querySelector("td:first-child a");
    let name = nameCell.textContent
      .replace("D.D.", "")
      .replace("d.d.", "")
      .replace("d.o.o.", "")
      .replace(",", "")
      .trim();

    let numberCell = row.querySelector("td:nth-child(0)");

    row.classList.add("clickable");
    numberCell.addEventListener("click", function () {
      copyToClipboard(name);
      //add new row to g-sheets
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
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = color.blue;
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.fontSize = "16px";
  button.style.zIndex = "1000";

  button.addEventListener("click", function () {
    addButtonToEachRow();
  });

  button.style.transition = "background-color 0.15s ease-in-out";

  button.addEventListener("mouseover", function () {
    button.style.backgroundColor = color.darkBlue;
  });

  button.addEventListener("mouseout", function () {
    button.style.backgroundColor = color.blue;
  });

  // Append the button to the body of the document
  document.body.appendChild(button);
  console.log("buttonAdded");
}

/////////////
//Pre-start declarations
/////////////
const color = {
  blue: "#2C6DC9",
  darkBlue: "#2980b9",
  green: "#25d16a",
  darkGreen: "#0c5429",
};

addGlobalStyle();

/////////////
//Start main
/////////////

addMainButton();
