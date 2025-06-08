// Select all to whom you want to apply JS
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
// initial display without js apply
let password="";
let passwordLength=10;
let checkCount=0;
// set strength circle color to grey
setIndicator("#ccc");
handleSlider();// iska work h ki password length ko UI par reflect krana

// set password length
function handleSlider(){
    // iska kaam 10 par slider ko set krna hai and show karna h
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    // backgroundsize =width% height%
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))  +"% 100%";
}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    // add shadow in Indicator
    indicator.style.boxShadow=`0px 0px 12px 1px  ${color}`;
}
function getRndInteger(min,max)
{
    // we required random integer from min to max
  return Math.floor(Math.random()*(max-min+1))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));// this function fetch string from integer
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));// this function fetch string from integer
}
const symbols = "!@#$%^&*()_+{}[]<>?/|~`-=";
function generateSymbol(){
const index = getRndInteger(0, symbols.length - 1);
  return symbols.charAt(index);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}
// CopyContent
async function copyContent(){
    try{
           await  navigator.clipboard.writeText(passwordDisplay.value);
           copyMsg.innerText="copied";
}
    
    catch(e)
    {
    copyMsg.innerText="failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    setTimeout(()=>
    {
        copyMsg.classList.remove("active")
    },2000);
}
// shuffle kai liye fisher yates method
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
 function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkBox)=>{
        if(checkBox.checked)
            checkCount++;
    });
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
 }
// all check boxes behave same after eventlistner so use for each loop before use query selector all on checkbox to select it
allCheckBox.forEach((checkBox)=>{
  checkBox.addEventListener('change',handleCheckBoxChange)
})
// event listener on slider
inputSlider.addEventListener('input', (event) => {
    passwordLength = event.target.value;
    handleSlider();
}); 

// event listener on copy btn
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)// agar value exists karege password mai too hee copy karoge soo
    copyContent();// this function must using API and promises for any copy 

});
// generate password eventlistener
generateBtn.addEventListener('click',()=>{
    // when we click genearte pass first we see that  atleat 1 checkbox check how we know that to know this first apply
    // eventlistener on checkbox 
// here checkbox count update 
if(checkCount==0)
    return ;
if(passwordLength<checkCount)
{
    passwordLength=checkCount
    handleSlider();
}
// lets start journey to find new password so to remove old password
password="";
// if(uppercaseCheck.checked){
//     password+=generateUppercase();
// }
// if(lowercaseCheck.checked){
//     password+=generateLowercase();
// }
// if(numbersCheck.checked){
//     password+=generateRandomNumber();
// }
// if(symbolsCheck.checked){
//     password+=generateSymbol();
// }
// In upper problem is that we add 4 to password length for remaining other six we need array of random num,uppercase, lowercase
// symbol to fill it so avoid above logic use this

let funcArr=[];
if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
}
if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
}
if(numbersCheck.checked){
    funcArr.push(generateRandomNumber);
}
if(symbolsCheck.checked){
    funcArr.push(generateSymbol);
}
// compulsory (4) addition using this function
for(let i=0;i<funcArr.length;i++)
{
password+=funcArr[i]();
}
// extra 6 addition also by this function 
for(let i=0;i<passwordLength-funcArr.length;i++)
{
    let randindex=getRndInteger(0,funcArr.length-1);
    console.log("randindex"+randindex);
    password+=funcArr[randindex]();
}

// shuffle the password
password=shufflePassword(Array.from(password));
passwordDisplay.value=password;

calcStrength();
});
