export default function setHotKey(keyCode) {    
  switch(keyCode) {
    case 'KeyP': {      
      return 'pensil';      
    }
    case 'KeyB':{
      return 'paint-bucket';      
    }
    case 'KeyC': {
      return 'select-color';
    }
    default:
  }
}