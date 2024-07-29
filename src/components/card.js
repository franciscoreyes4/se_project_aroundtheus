class Card {
    constructor(data, cardSelector, handleImageClick) {
        this._name = data.name;
        this._link = data.link;
        this._cardSelector = cardSelector;
        this._handleImageClick = handleImageClick;
        this._element = this._getTemplate();
        this._likeButton = this._element.querySelector('.card__like-button');
        this._cardImage = this._element.querySelector('.card__image');
        this._deleteButton = this._element.querySelector('.card__delete-button');
        this._setEventListeners();
    }

    _getTemplate() {
        const cardTemplate = document.querySelector(this._cardSelector).content.querySelector(".card");
        return cardTemplate.cloneNode(true);
    }

    _setEventListeners() {
        this._likeButton.addEventListener('click', () => this._handleLikeIcon());
        this._deleteButton.addEventListener('click', () => this._handleDeleteCard());
        this._cardImage.addEventListener('click', () => this._handleImageClick(this._name, this._link));
    }

    _handleLikeIcon() {
        this._likeButton.classList.toggle('card__like-button_active');
    }

    _handleDeleteCard() {
        this._element.remove();
        this._element = null; // Helps with garbage collection
    }

    getView() {
        this._cardImage.src = this._link;
        this._cardImage.alt = this._name;
        this._cardImage.onerror = () => {
            this._cardImage.style.display = 'none';
        };

        this._element.querySelector('.card__title').textContent = this._name;

        return this._element;
    }
}

export default Card;
