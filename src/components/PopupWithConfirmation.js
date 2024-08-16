import Popup from './Popup.js';

class PopupWithConfirmation extends Popup {
    constructor({ popupSelector }) {
      super(popupSelector);
      this._confirmButton = this._popup.querySelector('.modal__button_confirm');
    }
  
    setEventListeners() {
      super.setEventListeners();
      this._confirmButton.addEventListener('click', () => {
        if (this._handleConfirm) {
          this._handleConfirm();
        }
      });
    }
  
    open(handleConfirm) {
      this._handleConfirm = handleConfirm;
      super.open();
    }
  }

export default PopupWithConfirmation;