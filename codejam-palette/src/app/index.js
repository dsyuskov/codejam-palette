import '../scss/main.scss';
let canvasWidth = 512;
let canvasHeight = 512;
let pixelSize = 32;

//let currentTool = localStorage.getItem('currentTool') ? localStorage.getItem('currentTool') : 'pensil';
let currentTool = 'pensil';
let unSelectTools = unSelectPensil;

let currentColor = 'blue';
let prevColor = 'green';

let isDrawing = false;

const canvas = document.getElementById("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

const ctx = canvas.getContext('2d');  

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
      selectPaintBucket();
      unSelectTools = unSelectPaintBucket; 
      break;
    }
    case 'pensil': {      
      selectPensil();
      unSelectTools = unSelectPensil; 
      break;
    }
    case 'move': {      
      selectPaintBucket();
      unSelectTools = unSelectPaintBucket;
      break;
    }
    case 'transform': {      
      selectPensil();
      unSelectTools = unSelectPensil; 
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

let lastX = 0;
let lastY = 0;

function selectPaintBucket() {
  console.log('paint-bucket');
}

function unSelectPaintBucket() {
  console.log('paint-bucket');
}

function selectChooseColor(){}
function unSelectChooseColor(){}

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

function selectMove(){}
function unSelectMove(){}

function selectTransform(){}
function unSelectTransform(){}


function startPensil(event) {
  let startX = Math.floor(event.offsetX / pixelSize) * pixelSize;
  let startY = Math.floor(event.offsetY / pixelSize) * pixelSize;
  drawPixel(ctx, startX, startY, pixelSize, currentColor);
  lastX = startX;
  lastY = startY;
  isDrawing = true;
}

function drawPensil(event) {
  let startX = Math.floor(event.offsetX / pixelSize) * pixelSize;
  let startY = Math.floor(event.offsetY / pixelSize) * pixelSize;
  if (isDrawing) {
    drawLine(lastX, lastY, startX, startY);
  }  
  lastX = startX;
  lastY = startY;   
}

function stopPensil() {
  isDrawing = false;  
}








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

function drawPixel(canvas, startX, startY, sizePixel, color) {
  canvas.fillStyle = color;
  canvas.fillRect(startX, startY, sizePixel, sizePixel);
}

function drawLine(x1, y1, x2, y2) {
  
  var deltaX = Math.abs(x2 - x1);
  var deltaY = Math.abs(y2 - y1);
  var signX = x1 < x2 ? 1 : -1;
  var signY = y1 < y2 ? 1 : -1;
  //
  var error = deltaX - deltaY;
  //
  drawPixel(ctx, x2, y2, pixelSize, currentColor);
  while(x1 != x2 || y1 != y2) 
 {      
      drawPixel(ctx, x1, y1, pixelSize, currentColor);
      var error2 = error * 2;
      //
      if(error2 > -deltaY) 
      {
          error -= deltaY;
          x1 += signX;
      }
      if(error2 < deltaX) 
      {
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
