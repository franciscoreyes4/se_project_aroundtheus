import Popup from './Popup.js';

class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector('.modal__form');
    this._inputList = this._form.querySelectorAll('.modal__input');
    this._submitButton = this._form.querySelector('.modal__button');
    this._defaultButtonText = this._submitButton.textContent;
  }

  _getInputValues() {
    this._formValues = {};
    this._inputList.forEach(input => {
      this._formValues[input.name] = input.value;
    });
    return this._formValues;
  }

  setInputValues(data) {
    this._inputList.forEach(input => {
      input.value = data[input.name];
    });
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.renderLoading(true);

      const submitResult = this._handleFormSubmit(this._getInputValues());
      
      if (submitResult && typeof submitResult.then === 'function') {
        submitResult
          .then(() => {
            this._form.reset(); // Clear inputs after successful form submission
            this._submitButton.disabled = true; // Disable the submit button
            this._submitButton.classList.add('modal__button_disabled');
            this.close(); // Close the popup after submission
          })
          .catch((err) => {
            console.error("Error submitting form:", err);
          })
          .finally(() => {
            this.renderLoading(false);
          });
      } else {
        console.error("handleFormSubmit did not return a Promise.");
        this.renderLoading(false);
      }
    });
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._submitButton.textContent = 'Saving...';
    } else {
      this._submitButton.textContent = this._defaultButtonText;
    }
  }
}

export default PopupWithForm;
