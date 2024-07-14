const previewImageModal = document.querySelector("#modal-preview-picture");
const previewImage = previewImageModal.querySelector(".modal__image");
const previewImageCaption = previewImageModal.querySelector(".modal__picture_caption");

function closeOnEscKey(event) {
    if (event.key === "Escape") {
        const openedModal = document.querySelector(".modal_opened");
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", closeOnEscKey);
}

function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", closeOnEscKey);
}

class Card {
    constructor(data, cardSelector, handleImageClick) {
        this._name = data.name;
        this._link = data.link;
        this._cardSelector = cardSelector;
        this._handleImageClick = handleImageClick;
    }

    _getTemplate() {
        return document.querySelector(this._cardSelector).content.querySelector(".card").cloneNode(true);
    }

    _setEventListeners() {
        this._element.querySelector('.card__like-button').addEventListener('click', () => {
            this._handleLikeIcon();
        });

        this._element.querySelector('.card__delete-button').addEventListener('click', () => {
            this._handleDeleteCard();
        });

        this._element.querySelector('.card__image').addEventListener('click', () => {
            this._handleImageClick(this._name, this._link);
        });
    }

    _handleLikeIcon() {
        this._element.querySelector('.card__like-button').classList.toggle('card__like-button_active');
    }

    _handleDeleteCard() {
        this._element.remove();
    }

    getView() {
        this._element = this._getTemplate();
        this._setEventListeners();

        const cardImage = this._element.querySelector('.card__image');
        cardImage.src = this._link;
        cardImage.alt = this._name;
        cardImage.onerror = () => {
            cardImage.style.display = 'none';
        };

        this._element.querySelector('.card__title').textContent = this._name;

        return this._element;
    }
}

export default Card;
