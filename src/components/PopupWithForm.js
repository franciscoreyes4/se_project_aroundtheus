import Popup from './Popup.js';

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this.handleFormSubmit = handleFormSubmit;
    this.form = this._popup.querySelector('.modal__form');
    this.inputList = this.form.querySelectorAll('.modal__input');
    this.submitButton = this.form.querySelector('.modal__button');
    this.defaultButtonText = this.submitButton.textContent;
  }

  _getInputValues() {
    this.formValues = {};  
    this.inputList.forEach(input => {
      this.formValues[input.name] = input.value;  
    });
    return this.formValues;  
  }

  setInputValues(data) {
    this.inputList.forEach(input => {
      input.value = data[input.name]; 
    });
  }

  setEventListeners() {
    super.setEventListeners();
    this.form.addEventListener('submit', (e) => { 
      e.preventDefault();
      this.renderLoading(true);

      this.handleFormSubmit(this._getInputValues());
    });
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this.submitButton.textContent = 'Saving...';  
    } else {
      this.submitButton.textContent = this.defaultButtonText; 
    }
  }
}

export default PopupWithForm;
