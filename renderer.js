const ipcRenderer = require('electron').ipcRenderer;


// Example: Adding event listener to a button
const btn = document.getElementById("btn-udp");
if (btn) {
  btn.addEventListener("click", () => {
    alert("Server listening!");
    ipcRenderer.send('start-server', 'start');
  });
} else {
  console.error("Button not found!");
}
