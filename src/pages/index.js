import "../pages/index.css";
import Card from "../components/Card.js";
import { enableValidation, formValidators } from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import { validationSettings } from "../utils/Constants.js";

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const avatarEditButton = document.querySelector(".profile__image");

// Forms
const profileForm = document.forms['profile-form'];
const cardForm = document.forms['card-form'];

// API Instance
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "703aeebf-8509-4c4b-9691-d3d6d590ee64",
    "Content-Type": "application/json"
  }
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

const deleteConfirmationPopup = new PopupWithConfirmation({
  popupSelector: '#delete-confirmation-modal',
  handleConfirm: handleDeleteCard // Passing the delete function to the popup
});
deleteConfirmationPopup.setEventListeners();

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

function handleProfileFormSubmit(formData) {
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
    });
}

function handleAddCardFormSubmit(formData) {
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
    });
}

function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    () => popupWithImage.open(data),
    (cardId, cardElement) => deleteConfirmationPopup.open(cardId, cardElement)
  );
  return card.getView();
}

function handleDeleteCard(cardId, cardElement) {
  api.deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      deleteConfirmationPopup.close();
    })
    .catch((err) => {
      console.error("Error deleting card:", err);
      deleteConfirmationPopup.close();
    });
}

profileEditButton.addEventListener("click", () => {
  const userInfoData = userInfo.getUserInfo();
  popupWithFormProfile.setInputValues(userInfoData);
  formValidators['profile-form'].resetValidation();
  popupWithFormProfile.open();
});

addNewCardButton.addEventListener("click", () => {
  popupWithFormAddCard.open();
});

enableValidation(validationSettings);
