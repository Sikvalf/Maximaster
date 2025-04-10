const submitbutton = document.getElementById("submit");
submitbutton.onclick = function(event){
  if (!checkData()) { 
    event.preventDefault(); 
  } else {
    alert ("Форма отправлена");
  }
};
function checkData() {
      let fioInput = document.getElementById("fio");
      let fio = fioInput.value;
      let phoneInput = document.getElementById("phone");
      let phone = phoneInput.value;
      let emailInput = document.getElementById ("email");
      let email = emailInput.value;
      let commentInput = document.getElementById("comment");
      let comment = commentInput.value; 
      if (fio.trim() === "") {
          alert("ФИО - обязательное поле");
          fioInput.focus();
          return false;
      }
      if (phone.trim() === "") {
          alert("Телефон - обязательное поле");
          phoneInput.focus();
          return false;
      }
      const lettersOnly = /^[а-яА-ЯёЁ\s]+$/;
      const numbersOnly = /^[0-9]+$/;

      if (!lettersOnly.test(fio)) {
          alert("ФИО должно содержать только буквы и пробелы");
          fioInput.value = "";
          fioInput.focus();
          return false;
      }
      if (!numbersOnly.test(phone)) {
          alert("Номер телефона должен содержать только числа");
          phoneInput.value = "";
          phoneInput.focus();
          return false;
      }
      if (email.indexOf("@") === -1) {
      alert("Email должен содержать символ @");
      emailInput.focus();
      return false;
      }
      if (comment.length > 500) { 
      alert("Ваш комментарий более 500 символов");
      commentInput.focus();
      return false;
    }
      return true;
  }