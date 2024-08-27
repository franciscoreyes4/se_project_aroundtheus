class Card {
  constructor(data, cardSelector, handleCardClick, handleDeleteClick, api) {
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
    this._element.querySelector('.card__delete-button').addEventListener('click', () => {
      this._handleDeleteClick(this._id, this._element);
    });
    this._element.querySelector('.card__image').addEventListener('click', this._handleCardClick);
    this._element.querySelector('.card__like-button').addEventListener('click', () => this._toggleLike());
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
    const likeButton = this._element.querySelector('.card__like-button');

    if (this._isLiked) {
      likeButton.classList.add('card__like-button_active');
    } else {
      likeButton.classList.remove('card__like-button_active');
    }
  }

  getView() {
    this._element.querySelector('.card__title').textContent = this._name;
    const cardImage = this._element.querySelector('.card__image');
    cardImage.src = this._link;
    cardImage.alt = this._name;

    this._updateLikesView();
    return this._element;
  }
}

export default Card;
