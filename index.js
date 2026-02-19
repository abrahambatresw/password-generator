const characters = {
    alphabet: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
    numbers: ["0","1", "2", "3", "4", "5", "6", "7", "8", "9"],
    symbols: ["~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?","/"]
}

// DOM elements
const form = document.querySelector("form")
const passwordLengthInput = document.getElementById("password-length-input")
const includeNumbersInput = document.getElementById("include-numbers-input")
const includeSymbolsInput = document.getElementById("include-symbols-input")
let password = {}

document.querySelectorAll(".password-container").forEach((passwordContainer, index) => {
    password[index] = {
        string: "",
        textEl: passwordContainer.querySelector("p"),
        copyBtnEl: passwordContainer.querySelector("button"),
        tooltipEl: passwordContainer.querySelector(".tooltip")
    }
})

// password creation data
let formIsValid = false
let passwordLength = 16
let includeNumbers = true
let includeSymbols = true
const numOfPasswords = 2

// populate form
passwordLengthInput.value = passwordLength
includeNumbersInput.checked = includeNumbers
includeSymbolsInput.checked = includeSymbols

// hide copy buttons
Object.values(password).forEach(password => password.copyBtnEl.style.display = "none")

// function to update creation data
function updateData() {
    formIsValid = form.checkValidity()
    passwordLength = passwordLengthInput.value
    includeNumbers = includeNumbersInput.checked
    includeSymbols = includeSymbolsInput.checked
}

function getRandomArrayItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

function shuffle(array) {
    let randomIndex, currentPosition
    for (let i = array.length - 1; i > 0; i--) {
        randomIndex = Math.floor(Math.random() * (i + 1))
        currentPosition = array[i]
        array[i] = array[randomIndex]
        array[randomIndex] = currentPosition
    }
    return array
}

// password generation function
function generatePassword() {
    let password = ""
    let passwordArray = []
    let numberOfNumbers = 0
    let numberOfSymbols = 0

    // fill in the numbers in password array
    if (includeNumbers) {
        // the number of number is any number between 1 and 38% of the password length
        numberOfNumbers = Math.floor(Math.random() * (passwordLength * 0.38)) + 1
        for (let i = 0; i < numberOfNumbers; i++) {
            passwordArray.push(getRandomArrayItem(characters.numbers))
        }
    }
    
    // fill in the symbols in password array
    if (includeSymbols) {
        // the number of symbols is any number between 1 and 38% of the password length
        numberOfSymbols = Math.floor(Math.random() * (passwordLength * 0.38)) + 1
        for (let i = 0; i < numberOfSymbols; i++) {
            passwordArray.push(getRandomArrayItem(characters.symbols))
        }
    }
    
    // fill the remaining password array with alphabet    
    while (passwordArray.length != passwordLength) {
        passwordArray.push(getRandomArrayItem(characters.alphabet))
    }
    
    // shuffle and save as string
    password = shuffle(passwordArray).join("")
    return password
}

passwordLengthInput.addEventListener("focusout", () => {
    passwordLengthInput.reportValidity()
})

// listen for clicks on submit button
document.querySelector('input[type="submit"]').addEventListener("click", (e) => {
    e.preventDefault()
    form.reportValidity()
    updateData()
    if (formIsValid) {
        for (let i = 0; i < numOfPasswords; i++) {
            password[i].textEl.textContent = password[i].string = generatePassword()
            password[i].copyBtnEl.style.display = "flex"
        }
    }
})

// copy password when clicking on button
for (let i = 0; i < numOfPasswords; i++) {
    const currentPassword = password[i]
    currentPassword.copyBtnEl.addEventListener("mouseenter", () => currentPassword.tooltipEl.style.visibility = "visible")
    currentPassword.copyBtnEl.addEventListener("click", () => {
        navigator.clipboard.writeText(currentPassword.string)

        // update tooltip text
        currentPassword.tooltipEl.textContent = "Copied!"
        setTimeout(revertTooltipText, 700)
    })

    // upate tooltip text after leaving
    function revertTooltipText() {
        if (currentPassword.tooltipEl.style.visibility = "visible") {
            currentPassword.tooltipEl.textContent = "Copy password"
            currentPassword.tooltipEl.style.visibility = "hidden"
        }

    }
    currentPassword.copyBtnEl.addEventListener("mouseleave", () => revertTooltipText())
    currentPassword.copyBtnEl.addEventListener("focusout", () => revertTooltipText())
}