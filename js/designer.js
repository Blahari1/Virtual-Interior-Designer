/* ===========================================
   Virtual Interior Designer
   Part 1
=========================================== */

const furnitureContainer = document.getElementById("furnitureContainer");
const selectedName = document.getElementById("selectedName");

const libraryItems = document.querySelectorAll(".furniture-card");

let selectedFurniture = null;
let furnitureCounter = 0;
let highestZ = 1;

const MOVE_STEP = 10;
const ROTATE_STEP = 15;
const SCALE_STEP = 0.1;

const furnitureImages = {
  bed: "assets/furniture/bed.png",
  chair: "assets/furniture/chair.png",
  table: "assets/furniture/table.png",
  lamp: "assets/furniture/lamp.png",
  sofa: "assets/furniture/sofa.png",
  tv: "assets/furniture/tv.png",
  plant: "assets/furniture/plant.png",
  carpet: "assets/furniture/carpet.png",
};

let nextX = 80;
let nextY = 120;

/* ===========================================
   Add Furniture
=========================================== */

libraryItems.forEach((card) => {
  card.addEventListener("click", () => {
    addFurniture(card.dataset.type);
  });
});

function addFurniture(type) {
  furnitureCounter++;

  const furniture = document.createElement("div");

  furniture.className = "furniture";

  furniture.dataset.type = type;

  furniture.dataset.rotation = 0;

  furniture.dataset.scale = 1;

  furniture.dataset.id = furnitureCounter;

  furniture.style.position = "absolute";

  furniture.style.left = nextX + "px";

  furniture.style.top = nextY + "px";

  furniture.style.zIndex = highestZ++;

  const img = document.createElement("img");

  img.src = furnitureImages[type];

  img.draggable = false;

  furniture.appendChild(img);

  furnitureContainer.appendChild(furniture);
  const msg = document.querySelector(".canvas-message");

  if (msg) {
    msg.style.display = "none";
  }

  makeSelectable(furniture);

  makeDraggable(furniture);

  selectFurniture(furniture);

  nextX += 40;

  if (nextX > 450) {
    nextX = 80;

    nextY += 40;
  }
}
/* ===========================================
   Selection
=========================================== */

function clearSelection() {
  document.querySelectorAll(".furniture").forEach((item) => {
    item.classList.remove("selected");
  });
}

function selectFurniture(item) {
  clearSelection();

  selectedFurniture = item;

  item.classList.add("selected");

  selectedName.textContent = item.dataset.type.toUpperCase();
}

function makeSelectable(item) {
  item.addEventListener("click", (e) => {
    e.stopPropagation();

    selectFurniture(item);
  });
}

const roomCanvas = document.getElementById("roomCanvas");

roomCanvas.addEventListener("click", (e) => {
  if (e.target === roomCanvas || e.target.id === "roomImage") {
    clearSelection();

    selectedFurniture = null;

    selectedName.textContent = "None";
  }
});

/* ===========================================
   Drag
=========================================== */

function makeDraggable(item) {
  let dragging = false;

  let offsetX = 0;

  let offsetY = 0;

  item.addEventListener("mousedown", (e) => {
    dragging = true;

    selectFurniture(item);

    offsetX = e.clientX - item.offsetLeft;

    offsetY = e.clientY - item.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    let x = e.clientX - offsetX;

    let y = e.clientY - offsetY;

    const maxX = furnitureContainer.clientWidth - item.offsetWidth;

    const maxY = furnitureContainer.clientHeight - item.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));

    y = Math.max(0, Math.min(y, maxY));

    item.style.left = x + "px";

    item.style.top = y + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}
/* ===========================================
   Transform
=========================================== */

function updateTransform() {
  if (!selectedFurniture) return;

  const rotation = parseFloat(selectedFurniture.dataset.rotation);

  const scale = parseFloat(selectedFurniture.dataset.scale);

  selectedFurniture.style.transform = `rotate(${rotation}deg) scale(${scale})`;
}
/* ===========================================
   Move
=========================================== */

function move(dx, dy) {
  if (!selectedFurniture) return;

  let left = parseInt(selectedFurniture.style.left);

  let top = parseInt(selectedFurniture.style.top);

  left += dx;

  top += dy;

  const maxX = furnitureContainer.clientWidth - selectedFurniture.offsetWidth;

  const maxY = furnitureContainer.clientHeight - selectedFurniture.offsetHeight;

  left = Math.max(0, Math.min(left, maxX));

  top = Math.max(0, Math.min(top, maxY));

  selectedFurniture.style.left = left + "px";

  selectedFurniture.style.top = top + "px";
}

document.getElementById("moveUp").onclick = () => move(0, -MOVE_STEP);

document.getElementById("moveDown").onclick = () => move(0, MOVE_STEP);

document.getElementById("moveLeft").onclick = () => move(-MOVE_STEP, 0);

document.getElementById("moveRight").onclick = () => move(MOVE_STEP, 0);
/* ===========================================
   Rotate
=========================================== */

function rotate(angle) {
  if (!selectedFurniture) return;

  selectedFurniture.dataset.rotation =
    parseFloat(selectedFurniture.dataset.rotation) + angle;

  updateTransform();
}

document.getElementById("rotateLeft").onclick = () => rotate(-ROTATE_STEP);

document.getElementById("rotateRight").onclick = () => rotate(ROTATE_STEP);
/* ===========================================
   Resize
=========================================== */

function resize(scale) {
  if (!selectedFurniture) return;

  let current = parseFloat(selectedFurniture.dataset.scale);

  current += scale;

  current = Math.max(0.3, Math.min(current, 3));

  selectedFurniture.dataset.scale = current;

  updateTransform();
}

document.getElementById("increaseSize").onclick = () => resize(SCALE_STEP);

document.getElementById("decreaseSize").onclick = () => resize(-SCALE_STEP);
/* ===========================================
   Duplicate
=========================================== */

document.getElementById("duplicateBtn").onclick = () => {
  if (!selectedFurniture) return;

  addFurniture(selectedFurniture.dataset.type);
};
/* ===========================================
   Delete
=========================================== */

document.getElementById("deleteBtn").onclick = () => {
  if (!selectedFurniture) return;

  selectedFurniture.remove();

  selectedFurniture = null;

  selectedName.textContent = "None";
};
/* ===========================
   Theme
=========================== */

const themeBtn = document.getElementById("themeBtn");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light");

  themeBtn.innerHTML = "☀️";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.innerHTML = "☀️";

    localStorage.setItem("theme", "light");
  } else {
    themeBtn.innerHTML = "🌙";

    localStorage.setItem("theme", "dark");
  }
};

/* ===========================
   Clear Room
=========================== */

document.getElementById("clearRoomBtn").onclick = () => {
  furnitureContainer.innerHTML = "";

  selectedFurniture = null;

  selectedName.innerHTML = "None";

  furnitureCounter = 0;
};
/* ===========================
   New Room
=========================== */

document.getElementById("newRoomBtn").onclick = () => {
  if (confirm("Start a new room?")) {
    furnitureContainer.innerHTML = "";

    selectedFurniture = null;

    selectedName.innerHTML = "None";

    furnitureCounter = 0;

    roomWall.style.background = "#f3f3f3";

    roomFloor.style.background =
      "repeating-linear-gradient(90deg,#c9965b 0,#c9965b 70px,#b9854e 70px,#b9854e 140px)";
  }
};
function changeRoom(room) {
  const roomImage = document.getElementById("roomImage");

  switch (room) {
    case "Bedroom":
      roomImage.src = "assets/rooms/room.png";
      break;

    case "Living Room":
      roomImage.src = "assets/rooms/livingroom.png";
      break;

    case "Office":
      roomImage.src = "assets/rooms/office.png";
      break;

    default:
      roomImage.src = "";
  }

  roomImage.alt = room;
}
/* =============================
Keyboard Shortcuts
=============================*/

document.addEventListener("keydown",(e)=>{

if(!selectedFurniture)return;

switch(e.key){

case "ArrowUp":

move(0,-MOVE_STEP);

break;

case "ArrowDown":

move(0,MOVE_STEP);

break;

case "ArrowLeft":

move(-MOVE_STEP,0);

break;

case "ArrowRight":

move(MOVE_STEP,0);

break;

case "Delete":

selectedFurniture.remove();

selectedFurniture=null;

selectedName.textContent="None";

break;

case "r":

rotate(ROTATE_STEP);

break;

case "R":

rotate(-ROTATE_STEP);

break;

case "+":

resize(SCALE_STEP);

break;

case "-":

resize(-SCALE_STEP);

break;

}

});
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();

    document.getElementById("duplicateBtn").click();
  }
});
/* =============================
Download PNG
=============================*/

document.getElementById("downloadBtn").onclick=()=>{

const room=document.getElementById("roomCanvas");

html2canvas(room,{

backgroundColor:null,

scale:2

}).then(canvas=>{

const link=document.createElement("a");

link.download="MyInteriorDesign.png";

link.href=canvas.toDataURL("image/png");

link.click();

});

};