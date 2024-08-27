import Popup from './Popup.js';

class PopupWithConfirmation extends Popup {
  constructor({ popupSelector, handleConfirm }) {
    super(popupSelector);
    this._confirmButton = this._popup.querySelector('.modal__button_confirm');
    this._handleConfirm = handleConfirm;
    this._cardId = null;
    this._cardElement = null;
    this._defaultButtonText = this._confirmButton.textContent; // Store default button text
  }

  setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.renderLoading(true); // Show "Saving..." when confirm button is clicked

      if (this._handleConfirm) {
        const confirmPromise = this._handleConfirm(this._cardId, this._cardElement);
        
        if (confirmPromise && typeof confirmPromise.finally === 'function') {
          confirmPromise.finally(() => {
            this.renderLoading(false); // Reset button text after confirmation logic
          });
        } else {
          console.error("handleConfirm did not return a Promise");
          this.renderLoading(false); // Reset button text in case of error
        }
      }
    });
  }

  open(cardId, cardElement) {
    this._cardId = cardId;
    this._cardElement = cardElement;
    super.open();
  }

  close() {
    super.close();
    this._cardId = null;
    this._cardElement = null;
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._confirmButton.textContent = 'Saving...';
    } else {
      this._confirmButton.textContent = this._defaultButtonText;
    }
  }
}

export default PopupWithConfirmation;
