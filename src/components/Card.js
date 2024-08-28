class Card {
  constructor(data, cardSelector, handleCardClick, handleDeleteClick, api) {
    // Data and handlers initialization
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._likes = data.likes || []; 
    this._isLiked = data.isLiked || false;
    this._userId = data.userId;
    this._ownerId = data.owner._id;
    this._cardSelector = cardSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._api = api;
    this._element = this._getTemplate();

    // Initialize elements as class fields
    this._likeButton = this._element.querySelector('.card__like-button');
    this._deleteButton = this._element.querySelector('.card__delete-button');
    this._cardImage = this._element.querySelector('.card__image');
    this._cardTitle = this._element.querySelector('.card__title');

    // Event listeners setup
    this._setEventListeners();
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._cardSelector)
      .content
      .querySelector('.card')
      .cloneNode(true);
    return cardElement;
  }

  _setEventListeners() {
    this._deleteButton.addEventListener('click', () => {
      this._handleDeleteClick(this._id, this._element);
    });
    this._cardImage.addEventListener('click', this._handleCardClick);
    this._likeButton.addEventListener('click', () => this._toggleLike());
  }

  _toggleLike() {
    if (this._isLiked) {
      this._api.removeLike(this._id)
        .then(updatedCard => {
          this._isLiked = false;
          this._likes = updatedCard.likes;
          this._updateLikesView();
        })
        .catch(err => console.error(err));
    } else {
      this._api.addLike(this._id)
        .then(updatedCard => {
          this._isLiked = true;
          this._likes = updatedCard.likes;
          this._updateLikesView();
        })
        .catch(err => console.error(err));
    }
  }

  _updateLikesView() {
    if (this._isLiked) {
      this._likeButton.classList.add('card__like-button_active');
    } else {
      this._likeButton.classList.remove('card__like-button_active');
    }
  }

  getView() {
    this._cardTitle.textContent = this._name;
    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;

    this._updateLikesView();
    return this._element;
  }
}

export default Card;
