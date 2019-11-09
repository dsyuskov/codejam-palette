import '../scss/main.scss';

let canvasWidth = 512;
let canvasHeight = 512;
let pixelCount = 16;
let pixelSize = canvasWidth / pixelCount;
let image = [];
//let currentTool = localStorage.getItem('currentTool') ? localStorage.getItem('currentTool') : 'pensil';
let currentTool = 'pensil';
let unSelectTools = unSelectPensil;

let currentColor = localStorage.getItem('currentColor') ? localStorage.getItem('currentColor') : '#000000';
let prevColor = localStorage.getItem('prevColor') ? localStorage.getItem('prevColor') : '#ffffff';
let currentColorElement;
let prevColorElement;

let isDrawing = false;

const canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

const ctx = canvas.getContext('2d');  
canvasClear();

//--------tools-------------
function selectTool(item) {
  document.querySelector(`.tools__item--${currentTool}`).classList.remove('selected');
  item.classList.add('selected');
  
  unSelectTools();  
  currentTool = item.dataset.type;
  localStorage.setItem('currentTool', currentTool);

  switch(item.dataset.type) {
    case 'paint-bucket': {   
      selectPaintBucket();
      unSelectTools = unSelectPaintBucket; 
      break;
    }
    case 'choose-color': {      
      selectChooseColor();
      unSelectTools = unSelectChooseColor; 
      break;
    }
    case 'pensil': {      
      selectPensil();
      unSelectTools = unSelectPensil; 
      break;
    }
    case 'move': {      
      selectMove();
      unSelectTools = unSelectMove;
      break;
    }
    case 'transform': {      
      selectTransform();
      unSelectTools = unSelectTransform; 
      break;
    }
    default: {
      selectPensil();
      unSelectTools = unSelectPensil; 
    }
  }  
}

document.querySelectorAll('.tools__item').forEach((item) => {   
    item.addEventListener('click', () => selectTool(item)); 
    if (item.dataset.type === currentTool) {
      item.classList.add('selected');
      selectPensil();
    }
});
//--------colors------------
const currentColorInput = document.getElementById('current-color');
currentColorInput.addEventListener('change', (item) => {
  changeColor(item.target.value)
});

function selectColor(item) {  
  if (item.firstChild !== null) {
    switch(item.dataset.color) {
      case 'current': {                
        currentColorInput.click();
        currentColorElement.style.backgroundColor = currentColor;   
        break;
      }
      case 'prev': {        
        let cur = currentColor;
        currentColor = prevColor;
        prevColor = cur;
        currentColorElement.style.backgroundColor = currentColor;
        prevColorElement.style.backgroundColor = prevColor;
        break;
      }
      default: {
        changeColor(item.dataset.color);        
      }
    }
  }
}

document.querySelectorAll('.colors__item').forEach((item) => {   
  item.addEventListener('click', () => selectColor(item));
  
  if (item.firstChild !== null) {
    switch(item.dataset.color) {
      case 'current': {                
        currentColorElement = item.firstChild;        
        item.firstChild.style.backgroundColor = currentColor;
        break;
      }
      case 'prev': {        
        prevColorElement = item.firstChild;
        item.firstChild.style.backgroundColor = prevColor;
        break;
      }
      default: {
        item.firstChild.style.backgroundColor = item.dataset.color;
      }
    }
  }
});

function selectPaintBucket() {
  console.log('paint-bucket');
}

function unSelectPaintBucket() {
  console.log('paint-bucket');
}

function selectChooseColor(){
  canvas.addEventListener('mousedown', chooseColor);  
}

function unSelectChooseColor(){
  canvas.removeEventListener('mousedown', chooseColor);
}

function selectPensil() {    
  canvas.addEventListener('mousedown', startPensil);  
  canvas.addEventListener('mousemove', drawPensil);  
  canvas.addEventListener('mouseup', stopPensil);
  canvas.addEventListener('mouseout', stopPensil);
}
function unSelectPensil() {    
  canvas.removeEventListener('mousedown', startPensil);  
  canvas.removeEventListener('mousemove', drawPensil);  
  canvas.removeEventListener('mouseup', stopPensil);
  canvas.removeEventListener('mouseout', stopPensil);
}

function selectMove(){
  save();
}
function unSelectMove(){}

function selectTransform(){  
}
function unSelectTransform(){}
//-----------chooce-color----------
function chooseColor(event){
  let {x, y} = getPos(event);
  changeColor( image[x][y]);  
}
function changeColor(color) {  
  if (currentColor !== color) {
    prevColor = currentColor;
    currentColor = color;
    localStorage.setItem('currentColor', currentColor);
    localStorage.setItem('prevColor', prevColor);
    currentColorElement.style.backgroundColor = currentColor;
    prevColorElement.style.backgroundColor = prevColor;    
  }  
}

//------------pensil----------
let lastX = 0;
let lastY = 0;

function startPensil(event) {
  let {x, y} = getPos(event);
  drawPixel(ctx, x, y, pixelSize, currentColor);
  lastX = x;
  lastY = y;
  isDrawing = true;
}

function drawPensil(event) {
  let {x, y} = getPos(event);
  if (isDrawing) {
    drawLine(lastX, lastY, x,y);
  }  
  lastX = x;
  lastY = y;     
}

function stopPensil() {
  isDrawing = false;  
}



function save() {  
  canvasClear(pixelCount);  
}

function canvasClear() {
  for (let i = 0; i <= pixelCount; i++){
    image[i] = [];
    for (let j = 0; j <= pixelCount; j++){
      image[i][j] = '#ffffff';
      drawPixel(ctx, i, j, pixelSize, '#ffffff')
    }
  }
}

save();

document.querySelectorAll('.panel__item').forEach(item => {
    item.addEventListener('click', () => {
        const { type, url } = item.dataset;

        switch (type) {
            case 'color':
                fetch(url).then(response => response.json()).then(data => drawImage(canvas, data));
                break;

            case 'image':
                const img = new Image();
                img.onload = function () {
                    canvas.drawImage(img, 0, 0, 512, 512);
                }
                img.src = url;
                break;

            default:
                break;
        }
    });
});

const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
};

function getPos(event) {
  let x = Math.floor(event.offsetX / pixelSize);
  let y = Math.floor(event.offsetY / pixelSize);
  return {x, y};
}

function drawPixel(canvas, x, y, pixelSize, color) {  
  image[x][y] = color;
  canvas.fillStyle = color;
  canvas.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

function drawLine(x1, y1, x2, y2) {
  let deltaX = Math.abs(x2 - x1);
  let deltaY = Math.abs(y2 - y1);
  let signX = x1 < x2 ? 1 : -1;
  let signY = y1 < y2 ? 1 : -1;
  let error = deltaX - deltaY;
  
  while(x1 != x2 || y1 != y2) {      
    drawPixel(ctx, x1, y1, pixelSize, currentColor);
    let error2 = error * 2;
    if(error2 > -deltaY) {
      error -= deltaY;
      x1 += signX;
    }
    if(error2 < deltaX) {
      error += deltaX;
      y1 += signY;
    }
  }
}

function drawImage(canvas, dataArray) {
    let sizePixel = 0;
    let x = 0;
    let y = 0;

    sizePixel = 512 / dataArray.length;

    for (let row of dataArray) {
        for (let cell of row) {
            drawPixel(canvas, x, y, sizePixel, cell);
            x += sizePixel;
        }
        y += sizePixel;
        x = 0;
    }
}
