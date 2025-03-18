const ipcRenderer = require('electron').ipcRenderer;


// Example: Adding event listener to a button
const btn = document.getElementById("btn-udp");
const btnStop = document.getElementById("btn-stop");

if (btn) {
  btn.addEventListener("click", () => {
    alert("Server listening!");
    ipcRenderer.send('start-server', 'start');
    btn.style.display = "none";
    btnStop.style.display = "block";
  });
} else {
  console.error("Button not found!");
}

if (btnStop) {
  btnStop.addEventListener("click", () => {
    alert("Server stoped!");
    ipcRenderer.send('stop-server', 'stop');
    btnStop.style.display = "none";
    btn.style.display = "block";
  });
} else {
  console.error("Button not found!");
}