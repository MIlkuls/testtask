const clickedButtons = [];

const buttons = document.querySelectorAll('.survey_button')

buttons.forEach( (button) =>{
  button.addEventListener("click", function () {
    clickedButtons.push(this.textContent);
    console.log(clickedButtons.join(", "));
  });
});
