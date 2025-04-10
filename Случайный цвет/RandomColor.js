const randomcolorButton = document.getElementById("randomcolor"); 
  randomcolorButton.onclick = function(event) { 
    changeColor(); 
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function changeColor() {
    const colorBox = document.getElementById('color-box');
    colorBox.style.backgroundColor = getRandomColor();

    let width = document.getElementById("Weight").value;
    let height = document.getElementById("Height").value;

    if (!isNaN(width) && width > 0) {
      colorBox.style.width = width + "px";
    } else {
      alert("Некорректный ввод ширины");
      document.getElementById("Weight").value = "100"; 
    }

    if (!isNaN(height) && height > 0) {
      colorBox.style.height = height + "px";
    } else {
      alert("Некорректный ввод высоты");
      document.getElementById("Height").value = "100"; 
    }
  }