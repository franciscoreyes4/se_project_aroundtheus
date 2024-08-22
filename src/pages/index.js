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
      userId: userData._id // Ensure the user ID is passed here
    });
    cardSection.renderItems(initialCards);
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });


// Handle profile form submission
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

// Handle add card form submission
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

// Create card
function createCard(data) {
  const card = new Card(
    data,
    "#card-template",
    () => popupWithImage.open(data),
    () => handleDeleteCard(data._id, card.getView()),
    api,
    userInfo.getUserId() // This should now return the correct user ID
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

avatarEditButton.addEventListener("click", () => {
  // Implement the logic for editing the avatar when this feature is set up
});

// Enable validation for all forms
enableValidation(validationSettings);
