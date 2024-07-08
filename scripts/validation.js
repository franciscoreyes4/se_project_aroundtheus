// Function to show input errors
function showInputError(formEl, inputEL, { inputErrorClass, errorClass }) {
    const errorMessageEl = formEl.querySelector(`#${inputEL.id}-error`);
    inputEL.classList.add(inputErrorClass);
    errorMessageEl.textContent = inputEL.validationMessage;
    errorMessageEl.classList.add(errorClass);
  }
  
  // Function to hide input errors
  function hideInputError(formEl, inputEL, { inputErrorClass, errorClass }) {
    const errorMessageEl = formEl.querySelector(`#${inputEL.id}-error`);
    inputEL.classList.remove(inputErrorClass);
    errorMessageEl.textContent = "";
    errorMessageEl.classList.remove(errorClass);
  }
  
  // Function to check input validity
  function checkInputValidity(formEl, inputEL, config) {
    if (!inputEL.validity.valid) {
      return showInputError(formEl, inputEL, config);
    } 
    hideInputError(formEl, inputEL, config);
    
  }
  
  // Function to check if any input is invalid
  function hasInvalidInput(inputEls) {
    return inputEls.some((inputEL) => !inputEL.validity.valid);
  }
  
  // Functions to toggle the button state
  function disableButton(button, { inactiveButtonClass }) {
    button.classList.add(inactiveButtonClass);
    button.disabled = true;
  }
  
  function enableButton(button, { inactiveButtonClass }) {
    button.classList.remove(inactiveButtonClass);
    button.disabled = false;
  }

  function toggleButtonState(inputEls, submitButton, { inactiveButtonClass }) {
    if (hasInvalidInput(inputEls)) {
        disableButton(submitButton, config);
        return;
    } 
    enableButton(submitButton, config);
  }
  
  // Function to set event listeners on inputs
  function setEventListeners(formEl, config) {
    const { inputSelector, submitButtonSelector } = config;
    const inputEls = [...formEl.querySelectorAll(inputSelector)];
    const submitButton = formEl.querySelector(submitButtonSelector);
  
    inputEls.forEach((inputEL) => {
      inputEL.addEventListener("input", () => {
        checkInputValidity(formEl, inputEL, config);
        toggleButtonState(inputEls, submitButton, config);
      });
    });
  
    // Initial state of the button
    toggleButtonState(inputEls, submitButton, config);
  }
  
  // Function to enable validation
  function enableValidation(config) {
    const formEls = [...document.querySelectorAll(config.formSelector)];
  
    formEls.forEach((formEl) => {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
      });
      setEventListeners(formEl, config);
    });
  }
  
  // Configuration object
  const config = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__button",
    inactiveButtonClass: "modal__button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__input_type_error_visible",
  };
  
  // Enable validation
  enableValidation(config);
