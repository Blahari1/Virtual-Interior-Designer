const canvas = document.getElementById("canvas");
const furnitureButtons = document.querySelectorAll(".item");
const selectedName = document.getElementById("selectedName");

let selectedFurniture = null;
let furnitureCounter = 0;

const MOVE_DISTANCE = 10;
const ROTATE_ANGLE = 15;

const furnitureImages = {
  bed: "assets/furniture/bed.png",
  sofa: "assets/furniture/sofa.png",
  chair: "assets/furniture/chair.png",
  table: "assets/furniture/table.png",
  tv: "assets/furniture/tv.png",
  lamp: "assets/furniture/lamp.png",
  plant: "assets/furniture/plant.png",
  painting: "assets/furniture/painting.png",
  window: "assets/furniture/window.png",
  carpet: "assets/furniture/carpet.png",
};
const wall = document.querySelector(".wall");
const floor = document.querySelector(".floor");

let nextX = 40;
let nextY = 40;
// --------------------
// Selection
// --------------------

function deselectAll() {
  document.querySelectorAll(".furniture").forEach((item) => {
    item.classList.remove("selected");
  });
}

function selectFurniture(element) {
  deselectAll();

  selectedFurniture = element;

  element.classList.add("selected");

  selectedName.innerText = element.dataset.type.toUpperCase();
}

// --------------------
// Add Furniture
// --------------------

function addFurniture(type) {
  furnitureCounter++;

  const furniture = document.createElement("div");

  furniture.className = "furniture";

  furniture.dataset.id = furnitureCounter;
  furniture.dataset.type = type;
  furniture.dataset.rotation = 0;

  furniture.style.left = nextX + "px";
  furniture.style.top = nextY + "px";

  nextX += 40;

  if (nextX > 500) {
    nextX = 40;

    nextY += 40;
  }

  const image = document.createElement("img");

  image.src = furnitureImages[type];
  image.alt = type;

  furniture.appendChild(image);

  furniture.addEventListener("click", () => {
    selectFurniture(furniture);
  });

  canvas.appendChild(furniture);

  selectFurniture(furniture);
}

furnitureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addFurniture(button.dataset.type);
  });
});

// --------------------
// Movement
// --------------------

function moveFurniture(dx, dy) {
  if (!selectedFurniture) return;

  let left = parseInt(selectedFurniture.style.left);

  let top = parseInt(selectedFurniture.style.top);

  left += dx;
  top += dy;

  const maxX = canvas.clientWidth - selectedFurniture.offsetWidth;

  const maxY = canvas.clientHeight - selectedFurniture.offsetHeight;

  if (left < 0) left = 0;
  if (top < 0) top = 0;

  if (left > maxX) left = maxX;
  if (top > maxY) top = maxY;

  selectedFurniture.style.left = left + "px";
  selectedFurniture.style.top = top + "px";
}

// --------------------
// Rotation
// --------------------

function rotateFurniture(angle) {
  if (!selectedFurniture) return;

  let rotation = parseInt(selectedFurniture.dataset.rotation);

  rotation += angle;

  selectedFurniture.dataset.rotation = rotation;

  selectedFurniture.style.transform = `rotate(${rotation}deg)`;
}

// --------------------
// Delete
// --------------------

function deleteFurniture() {
  if (!selectedFurniture) return;

  selectedFurniture.remove();

  selectedFurniture = null;

  selectedName.innerText = "None Selected";
}

// --------------------
// Buttons
// --------------------

document.getElementById("up").onclick = () => moveFurniture(0, -MOVE_DISTANCE);

document.getElementById("down").onclick = () => moveFurniture(0, MOVE_DISTANCE);

document.getElementById("left").onclick = () =>
  moveFurniture(-MOVE_DISTANCE, 0);

document.getElementById("right").onclick = () =>
  moveFurniture(MOVE_DISTANCE, 0);

document.getElementById("rotateLeft").onclick = () =>
  rotateFurniture(-ROTATE_ANGLE);

document.getElementById("rotateRight").onclick = () =>
  rotateFurniture(ROTATE_ANGLE);

document.getElementById("delete").onclick = deleteFurniture;

document.querySelectorAll(".color").forEach((button) => {
  button.addEventListener("click", () => {
    wall.className = "wall";

    if (button.classList.contains("white")) wall.classList.add("white");

    if (button.classList.contains("cream")) wall.classList.add("cream");

    if (button.classList.contains("blue")) wall.classList.add("blue");

    if (button.classList.contains("gray")) wall.classList.add("gray");

    if (button.classList.contains("green")) wall.classList.add("green");
  });
});
document.getElementById("floorSelect").addEventListener("change", function () {
  floor.className = "floor";

  floor.classList.add(this.value);
});
floor.classList.add("wood");
wall.classList.add("white");
