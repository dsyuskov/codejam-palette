function setHotKey(keyCode) {    
  switch(keyCode) {
    case 'KeyB': {
      console.log(keyCode);
      selectPaintBucket()
      break;
    }
    default:
  }
}
document.addEventListener('keydown', (event) => setHotKey(event.code));