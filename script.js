//--------- css style----------//

const keyboard = document.querySelectorAll('.keyboard div');
keyboard.forEach(key => key.style['grid-area'] = `${key.className.split(" ")[1]}`);


//------- input -------//
    
//press keyboard
function pressKey(event) {
    let key = event.key;
    if (/[0123456789+*-.=/]/.test(key)) {
        read(key);
    }
}

window.addEventListener('keypress', pressKey);

function keyMap(key) {
    switch(key) {
        case 'Backspace': return 'DEL';
        case 'Delete': return 'AC';
        case 'Enter': return '='
        default: return null; 
    }
}

function downKey(event) {
    let key = event.key;
    key = keyMap(key);
    if(key) {
        read(key);
    }
}
window.addEventListener('keydown', downKey);

//click button
function clickButton(event) {
    const key = this.id;
    read(key);
}

keyboard.forEach(key => key.addEventListener('click', clickButton));

//-------- eval -------//
    
let result = undefined;
let operator = undefined;
let buffer = '';

/*
    计算过程有四种状态: 初始状态，读取操作数A，读取操作符，读取操作数B；
*/

function checkState() {
    if (!operator && !buffer) {
        return "Init"
    }
    if (!operator && buffer) {
        return "OpA"
    }
    if (operator && !buffer) {
        return "OpC"
    }
    if (operator && buffer) {
        return "OpB"
    }
}

function read(str) {
    switch(true) {
        case str === 'AC':
            initialize();
            break;

        case /[0123456789\.]/.test(str):
            pushBuffer(str);
            break;

        case /[/*+-]/.test(str):
            setOp(str);
            break;
            
        case str === '=':
            equal();
            break;
        
        case str === 'DEL':
            backspace();
            break;
        
        case str === 'NEG':
            negative();
            break;

        default:
            break;
    }
    display();

}

function initialize() {
    result = undefined;
    operator = undefined;
    buffer = '';
}


function setOp(str) {
    switch(checkState()){
        case "OpB":
            equal();
        case "OpA": 
        case "OpC": 
            result = +buffer;
            operator = str;
            buffer = '';
            break;
        default: 
            break;
    }
}

function equal() {
    switch(checkState()){
        case "OpA": 
            buffer = '' + (+buffer);
            break;
        case "OpC": 
            operator = undefined;
            buffer = '' + result;
            break;
        case "OpB":
            buffer = '' + operate(operator, result, buffer);
            operator = undefined;
            break;
        default: 
            break;
    }
}

function pushBuffer(str) {
    if (str === '.' && Array.from(buffer).some(char => char ===".")) {
        return;
    }
    if(str === '.' && buffer == "") {
        buffer += '0';
    }
    buffer += str;
}

function backspace() {
    switch(checkState()){
        case "OpC": 
            operator = undefined;
            buffer = '';
            buffer += result;
            break;
        case "OpA": 
        case "OpB":
            buffer = buffer.slice(0, -1);
            break;
        default: 
            break;
    }
}

function negative() {
    switch(checkState()){
        case "OpC": 
            buffer += -result;
            break;
        case "OpB":
        case "OpA": 
            buffer = '' + (-(+buffer));
            break;
        default: 
            break;
    }
    
}

//------- calculate -------//

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(str, a, b) {
    let operator;
    switch(str) {
        case '+':
            operator = add;
            break;
        case '-':
            operator = subtract;
            break;
        case '*':
            operator = multiply;
            break;
        case '/':
            operator = divide;
            break;
        default:
            operator = null;
    }
    if(operator && b){
        return operator(a, b);
    }
    return a;
}

//------- output -------//
    
const screen = document.querySelector('.display');

function lightOP() {
    const OP = document.getElementById(operator);
    OP.classList.add('light');    
}

function unlight() {
    const OP = document.getElementsByClassName('light');
    for (let op of OP) {
        op.classList.remove('light');    
    }
}

function display() {
    let output = '';
    unlight();
    switch(checkState()){
        case 'Init':
            output = '0';
            break;
        case "OpC": 
            lightOP();
            output = result;
            break;
        case "OpA": 
        case "OpB":
            output = buffer;
            break;
        default: 
            break;
    }
    screen.textContent = output;
    // displayAll();
}


//---------- debug -------------//

// const infomation = document.createElement('div');
// document.querySelector('body').appendChild(infomation);
// infomation.style.cssText = 'align-self: start; color:white';

// function displayAll() {
//     const record = document.createElement('p');
//     record.textContent = `first: ${result}; op: ${operator};  buffer: ${buffer}`;
//     infomation.appendChild(record);
// }

//----------- initialize --------//

display()