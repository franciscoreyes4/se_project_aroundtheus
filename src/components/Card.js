class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteClick, apiInstance) {
    this._name = data.name;
    this._link = data.link;
    this._likes = data.likes || []; // Ensure likes is always an array
    this._id = data._id;
    this._userId = data.userId; // The ID of the logged-in user
    this._ownerId = data.owner._id; // The ID of the card owner
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteClick = handleDeleteClick;
    this._api = apiInstance; // Store the API instance
    this._element = this._getTemplate();
    this._likeButton = this._element.querySelector('.card__like-button');
    this._cardImage = this._element.querySelector('.card__image');
    this._deleteButton = this._element.querySelector('.card__delete-button');
    this._likeCount = this._element.querySelector('.card__like-count');
    this._setEventListeners();
    this._renderLikes();
  }

  _getTemplate() {
    const cardTemplate = document.querySelector(this._cardSelector).content.querySelector(".card");
    return cardTemplate.cloneNode(true);
  }

  _setEventListeners() {
    this._likeButton.addEventListener('click', () => this._handleLikeIcon());
    this._deleteButton.addEventListener('click', () => this._handleDeleteClick(this._id));
    this._cardImage.addEventListener('click', () => this._handleImageClick(this._name, this._link));
  }

  _renderLikes() {
    console.log('Updated likes array:', this._likes);
    this._likeCount.textContent = this._likes.length;
    if (this._isLikedByUser()) {
      this._likeButton.classList.add('card__like-button_active');
    } else {
      this._likeButton.classList.remove('card__like-button_active');
    }
  }
  

  _isLikedByUser() {
    return this._likes.some(like => like._id === this._userId);
  }  

  _handleLikeIcon() {
    if (this._isLikedByUser()) {
      this._api.dislikeCard(this._id)
        .then((updatedCard) => {
          this._likes = updatedCard.likes && updatedCard.likes.length > 0 ? updatedCard.likes : this._likes.filter(like => like._id !== this._userId);
          this._renderLikes();
        })
        .catch(err => console.error(`Error disliking card: ${err}`));
    } else {
      this._api.likeCard(this._id)
        .then((updatedCard) => {
          this._likes = updatedCard.likes && updatedCard.likes.length > 0 ? updatedCard.likes : [...this._likes, { _id: this._userId }];
          this._renderLikes();
        })
        .catch(err => console.error(`Error liking card: ${err}`));
    }
  }
  
  
  

  getView() {
    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._element.querySelector('.card__title').textContent = this._name;

    if (this._ownerId !== this._userId) {
      this._deleteButton.style.display = 'none';
    }

    return this._element;
  }
}

export default Card;
