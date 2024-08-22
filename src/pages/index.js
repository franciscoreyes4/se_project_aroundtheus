import "../pages/index.css";
import Card from "../components/Card.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import { enableValidation, formValidators } from "../components/FormValidator.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import { validationSettings } from "../utils/Constants.js";

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");

// Forms
const profileForm = document.forms['profile-form'];
const cardForm = document.forms['card-form'];
const avatarForm = document.forms['avatar-form'];

// API Instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "703aeebf-8509-4c4b-9691-d3d6d590ee64",
    "Content-Type": "application/json"
  }
});

// Initialize confirmation popup for delete
const popupWithConfirmation = new PopupWithConfirmation({
  popupSelector: '#delete-confirmation-modal'
});

// UserInfo and other components initialization
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  descriptionSelector: ".profile__description",
  avatarSelector: ".profile__image"
});

const popupWithImage = new PopupWithImage("#modal-preview-picture");
popupWithImage.setEventListeners();

const popupWithFormProfile = new PopupWithForm("#profile-edit-modal", handleProfileFormSubmit);
popupWithFormProfile.setEventListeners();

const popupWithFormAddCard = new PopupWithForm("#add-card-modal", handleAddCardFormSubmit);
popupWithFormAddCard.setEventListeners();

const popupWithFormAvatar = new PopupWithForm("#edit-avatar-modal", handleAvatarFormSubmit);
popupWithFormAvatar.setEventListeners();

// Event listener to open the avatar edit modal
if (avatarEditButton) {
  avatarEditButton.addEventListener('click', () => {
    formValidators['avatar-form'].resetValidation();
    popupWithFormAvatar.open();
  });
}

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
  popupWithFormProfile.renderLoading(true); // Show "Saving..." text
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
      popupWithFormProfile.renderLoading(false); // Reset button text
    });
}

// Handle add card form submission
function handleAddCardFormSubmit(formData) {
  popupWithFormAddCard.renderLoading(true); // Show "Saving..." text
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
      popupWithFormAddCard.renderLoading(false); // Reset button text
    });
}

// Handle avatar form submission
function handleAvatarFormSubmit(formData) {
  popupWithFormAvatar.renderLoading(true); // Show "Saving..." text
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
      popupWithFormAvatar.renderLoading(false); // Reset button text
    });
}

// Create card
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    () => popupWithImage.open(data),
    () => handleDeleteCard(data._id, card.getView()),
    api
  );
  return card.getView();
}

// Handle card deletion
function handleDeleteCard(cardId, cardElement) {
  popupWithConfirmation.open(() => {
    api.deleteCard(cardId)
      .then(() => {
        cardElement.remove(); // Remove from the DOM
        popupWithConfirmation.close();
      })
      .catch((err) => {
        console.error("Error deleting card:", err);
      });
  });
}

// Event listeners for opening modals
profileEditButton.addEventListener("click", () => {
  const userInfoData = userInfo.getUserInfo();
  popupWithFormProfile.setInputValues(userInfoData);
  formValidators['profile-form'].resetValidation();
  popupWithFormProfile.open();
});

addNewCardButton.addEventListener("click", () => {
  popupWithFormAddCard.open();
});

// Enable validation for all forms
enableValidation(validationSettings);
