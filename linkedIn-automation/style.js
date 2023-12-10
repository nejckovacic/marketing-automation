const customCSS = ':root {\n  --danger: #e9c2af;\n  --normal: #c4d7f2;\n  --success: #afdedc;\n  --secondary: #cfd6cd;\n}\n\nbody {\n  transition: background-color 0.15s ease-in-out;\n}\n\n.clickable {\n  filter: brightness(100%);\n}\n\n.clickable:hover {\n  cursor: pointer;\n  filter: brightness(80%);\n}\n\n.custom-button {\n  background-color: var(--normal);\n  filter: brightness(100%);\n\n  padding: 10px 20px;\n  background-color: var(--normal);\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n.bottom-left-btn {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 1000;\n}\n\n.custom-button:hover {\n  filter: brightness(70%);\n}\n\n.notice {\n  background-color: rgb(255, 100, 80);\n}\n';

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
