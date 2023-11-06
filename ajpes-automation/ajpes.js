"use strict";

const color = {
  blue: "#3498db",
  darkBlue: "#2980b9",
  green: "#25d16a",
  darkGreen: "#0c5429",
};

addMainButton();

function parseEachRow() {
  const table = document.querySelector("#tableRezultati > tbody");
  const rows = table.getElementsByTagName("tr");

  for (const row of rows) {
    const nameElement = row.querySelector("td:first-child a");
    const name = nameElement.textContent
      .replace("D.D.", "")
      .replace("d.d.", "")
      .replace("d.o.o.", "")
      .replace(",", "")
      .trim();
    const copyButton = createCopyButton(name);
    nameElement.insertAdjacentElement("afterend", copyButton);
  }
}

function createCopyButton(text) {
  const copyButton = document.createElement("button");
  copyButton.textContent = "C";
  copyButton.style.marginLeft = "5px";
  copyButton.style.marginBottom = "5px";
  copyButton.style.padding = "6px 12px";
  copyButton.style.backgroundColor = color.blue;
  copyButton.style.color = "#fff";
  copyButton.style.border = "none";
  copyButton.style.borderRadius = "5px";
  copyButton.style.cursor = "pointer";
  copyButton.style.fontSize = "11px";

  copyButton.addEventListener("click", function () {
    copyToClipboard(text);
    copyButton.style.backgroundColor = color.green;
  });

  return copyButton;
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

  // Set the button's id and text content
  button.id = "addButtons";
  button.textContent = "Add";

  // Apply styles to the button
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
    parseEachRow();
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
