// DOM Elements
const display = document.getElementById('display');
const clearBtn = document.getElementById('clear');
const negateBtn = document.getElementById('negate');
const acBtn = document.getElementById('ac');
const equalsBtn = document.getElementById('equals');

// Number and operator buttons
const sevenBtn = document.querySelector('[data-value="7"]');
const eightBtn = document.querySelector('[data-value="8"]');
const nineBtn = document.querySelector('[data-value="9"]');
const divideBtn = document.querySelector('[data-value="/"]');

const fourBtn = document.querySelector('[data-value="4"]');
const fiveBtn = document.querySelector('[data-value="5"]');
const sixBtn = document.querySelector('[data-value="6"]');
const multiplyBtn = document.querySelector('[data-value="*"]');

const oneBtn = document.querySelector('[data-value="1"]');
const twoBtn = document.querySelector('[data-value="2"]');
const threeBtn = document.querySelector('[data-value="3"]');
const subtractBtn = document.querySelector('[data-value="-"]');

const zeroBtn = document.querySelector('[data-value="0"]');
const decimalBtn = document.querySelector('[data-value="."]');
const addBtn = document.querySelector('[data-value="+"]');

// All buttons with data-value for easier iteration if needed
const valueButtons = document.querySelectorAll('[data-value]');

// Calculator state
let currentInput = '';
let previousValue = null;
let operation = null;

// Update display
function updateDisplay() {
  if (currentInput !== '') {
    display.value = currentInput;
  } else if (previousValue !== null) {
    display.value = previousValue.toString();
  } else {
    display.value = '0';
  }
}

// Calculator functions
function appendValue(value) {
  if (value >= '0' && value <= '9') {
    // Number
    if (currentInput.length < 8) {
      currentInput += value;
      updateDisplay();
    }
  } else if (value === '.') {
    // Decimal
    if (!currentInput.includes('.') && currentInput.length < 8) {
      if (currentInput === '') {
        currentInput = '0';
      }
      currentInput += value;
      updateDisplay();
    } else if (currentInput.includes('.') && currentInput.split('.')[1].length < 3 && currentInput.length < 8) {
      currentInput += value;
      updateDisplay();
    }
  } else {
    // Operator
    if (currentInput !== '' || previousValue !== null) {
      if (previousValue !== null && operation !== null) {
        calculate();
      } else if (currentInput !== '') {
        previousValue = parseFloat(currentInput);
      }
      operation = value;
      currentInput = '';
    }
  }
}

function clearLast() {
  if (currentInput !== '') {
    currentInput = '';
  } else {
    operation = null;
  }
  updateDisplay();
}

function clearAll() {
  currentInput = '';
  previousValue = null;
  operation = null;
  updateDisplay();
}

function negateNumber() {
  if (currentInput !== '') {
    if (currentInput.startsWith('-')) {
      currentInput = currentInput.slice(1);
    } else {
      currentInput = '-' + currentInput;
    }
  } else if (previousValue !== null) {
    previousValue = -previousValue;
  }
  updateDisplay();
}

function calculatePercent() {
  if (currentInput !== '') {
    let current = parseFloat(currentInput);
    currentInput = (current / 100).toString();
  } else if (previousValue !== null) {
    previousValue = previousValue / 100;
  }
  updateDisplay();
}

function calculate() {
  if (previousValue !== null && currentInput !== '' && operation !== null) {
    let current = parseFloat(currentInput);
    let result;
    switch (operation) {
      case '+':
        result = previousValue + current;
        break;
      case '-':
        result = previousValue - current;
        break;
      case '*':
        result = previousValue * current;
        break;
      case '/':
        if (current === 0) {
          display.value = 'ERR';
          return;
        }
        result = previousValue / current;
        break;
      default:
        return;
    }
    if (Math.abs(result) > 99999999 || Math.abs(result) < 0.0000001) {
      display.value = 'ERR';
    } else {
      previousValue = result;
      currentInput = '';
      operation = null;
      updateDisplay();
    }
  }
}

function calculateResult() {
  if (previousValue !== null && currentInput !== '' && operation !== null) {
    calculate();
  } else if (currentInput !== '') {
    previousValue = parseFloat(currentInput);
    currentInput = '';
    updateDisplay();
  }
}

// Initialize
updateDisplay();