const binInput = document.getElementById("binary-input");
const resultText = document.getElementById("result");
const errorText = document.getElementById("error");
const button = document.getElementById("convert-button");

function check() {
  const inputValue = binInput.value;

  if (inputValue) {
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] == 0 || inputValue[i] == 1) {
        continue;
      }

      errorText.innerText = "There can only be 0s and 1s in binary.";
      button.disabled = true;
      return false;
    }
  }

  errorText.innerText = "";
  button.disabled = false;
  return true;
}

function convert() {
  if (!check()) return false;

  const inputValue = binInput.value;
  let dec = 0;
  let cur = 1;

  for (let i = inputValue.length - 1; i >= 0; i--) {
    dec += inputValue[i] * cur;
    cur *= 2;
  }

  resultText.innerText = "Result: " + dec;
  return dec;
}

function keypress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    convert();
  }
}
