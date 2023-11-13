const customCSS = ':root {\n  --danger: #e9c2af;\n  --primary: #c4d7f2;\n  --success: #afdedc;\n  --secondary: #cfd6cd;\n}\n\np {\n  .primary {\n    background-color: var(--primary);\n  }\n\n  .secondary {\n    background-color: var(--secondary);\n  }\n\n  .clickable:hover {\n    cursor: pointer;\n  }\n}\n';

function addGlobalStyle() {
  var head, style;
  head = document.getElementsByTagName("head")[0];
  if (!head) {
    return;
  }
  style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = customCSS;
  head.appendChild(style);
}
