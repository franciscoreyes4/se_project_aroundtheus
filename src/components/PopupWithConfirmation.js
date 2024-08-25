import Popup from './Popup.js';

class PopupWithConfirmation extends Popup {
  constructor({ popupSelector, handleConfirm }) {
    super(popupSelector);
    this._confirmButton = this._popup.querySelector('.modal__button_confirm');
    this._handleConfirm = handleConfirm; // Function passed in during instantiation
    this._cardId = null;
    this._cardElement = null;
  }

  setEventListeners() {
    super.setEventListeners();
    this._confirmButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation(); // Ensure the click event isn't blocked
      if (this._handleConfirm) {
        this._handleConfirm(this._cardId, this._cardElement);
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
}

export default PopupWithConfirmation;
