import "../pages/index.css";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import { enableValidation, formValidators } from "../components/FormValidator.js";
import { validationSettings } from "../utils/Constants.js";

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");

// API Instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "703aeebf-8509-4c4b-9691-d3d6d590ee64",
    "Content-Type": "application/json"
  }
});

// UserInfo instance
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  avatarSelector: ".profile__image"
});

// Popup instances
const popupWithImage = new PopupWithImage("#modal-preview-picture");
popupWithImage.setEventListeners();

const popupWithFormProfile = new PopupWithForm("#profile-edit-modal", handleProfileFormSubmit);
popupWithFormProfile.setEventListeners();

const popupWithFormAddCard = new PopupWithForm("#add-card-modal", handleAddCardFormSubmit);
popupWithFormAddCard.setEventListeners();

const popupWithFormAvatar = new PopupWithForm("#edit-avatar-modal", handleAvatarFormSubmit);
popupWithFormAvatar.setEventListeners();

const popupWithConfirmation = new PopupWithConfirmation({
  popupSelector: '#delete-confirmation-modal',
  handleConfirm: handleDeleteCard
});
popupWithConfirmation.setEventListeners();

// Card section instance
const cardSection = new Section(
  {
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    }
  },
  ".cards__list"
);

// Load user information and initial cards
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
      avatar: userData.avatar,
    });
    cardSection.renderItems(initialCards);
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

// Handle profile form submission
function handleProfileFormSubmit(formData) {
  popupWithFormProfile.renderLoading(true); 
  api.updateUserInfo(formData)
    .then((updatedData) => {
      userInfo.setUserInfo({
        name: updatedData.name,
        description: updatedData.about,
        avatar: updatedData.avatar
      });
      popupWithFormProfile.close();
    })
    .catch((err) => {
      console.error("Error updating user profile:", err);
    })
    .finally(() => {
      popupWithFormProfile.renderLoading(false); 
    });
}

// Handle add card form submission
function handleAddCardFormSubmit(formData) {
  popupWithFormAddCard.renderLoading(true); 
  api.addCard({
    name: formData.title,
    link: formData.url
  })
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      popupWithFormAddCard.close();
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    })
    .finally(() => {
      popupWithFormAddCard.renderLoading(false); 
    });
}

// Handle avatar form submission
function handleAvatarFormSubmit(formData) {
  popupWithFormAvatar.renderLoading(true); 
  api.updateUserAvatar(formData.avatar)
    .then((updatedUserData) => {
      userInfo.setUserInfo({
        name: updatedUserData.name,
        description: updatedUserData.about,
        avatar: updatedUserData.avatar,
      });
      popupWithFormAvatar.close();
    })
    .catch((err) => {
      console.error("Error updating avatar:", err);
    })
    .finally(() => {
      popupWithFormAvatar.renderLoading(false);
    });
}

// Handle card deletion
function handleDeleteCard(cardId, cardElement) {
  return api.deleteCard(cardId) 
    .then(() => {
      cardElement.remove();
      popupWithConfirmation.close();
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
    });
}

// Create card
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    () => popupWithImage.open(data),
    (cardId, cardElement) => popupWithConfirmation.open(cardId, cardElement),
    api
  );
  return card.getView();
}

// Event listeners
profileEditButton.addEventListener("click", () => {
  const userInfoData = userInfo.getUserInfo();
  popupWithFormProfile.setInputValues(userInfoData);
  formValidators['profile-form'].resetValidation();
  popupWithFormProfile.renderLoading(false); 
  popupWithFormProfile.open();
});

addNewCardButton.addEventListener("click", () => {
  popupWithFormAddCard.renderLoading(false); 
  popupWithFormAddCard.open();
});

avatarEditButton.addEventListener("click", () => {
  formValidators['avatar-form'].resetValidation();
  popupWithFormAvatar.renderLoading(false);
  popupWithFormAvatar.open();
});

// Enable validation for all forms
enableValidation(validationSettings);
