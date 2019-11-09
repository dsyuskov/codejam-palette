import '../scss/main.scss';
let selectedTool = localStorage.getItem('selectedTools') ? localStorage.getItem('selectedTools') : 'pensil';

let selectedColor = 'red';
let sizePixel = 512 / 32;

const canvas = document.getElementById("canvas");
  canvas.width = 512;
  canvas.height = 512;

const ctx = canvas.getContext('2d');  

//--------tools-------------
function selectTools(selectedItem) {
  tools.forEach((item) => {
    item.classList.remove('selected');
  });
  selectedItem.classList.add('selected');  
}

const tools = document.querySelectorAll('.tools__item');
  tools.forEach((item) => {
    const {type} = item.dataset;
    if ( type === selectedTool) {
      item.classList.add('selected');
    }

    item.addEventListener('click', () => {        
        selectTools(item);
        selectedTool = type;
        localStorage.setItem('selectedTools', selectedTool);
    });
});   











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
    if (color.length === 6) {
        canvas.fillStyle = hex2rgba(color);
    } else {
        canvas.fillStyle = `rgba(${color})`;
    }
    canvas.fillRect(startX, startY, sizePixel, sizePixel);
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
