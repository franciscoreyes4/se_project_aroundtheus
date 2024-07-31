import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/section.js";
import PopupWithImage from "../components/popup-with-image.js";
import PopupWithForm from "../components/popup-with-form.js";
import UserInfo from "../components/user-info.js";
import { initialCards, validationSettings } from "../utils/constants.js";

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileEditForm = document.querySelector("form[name='profile-form']");
const addCardFormElement = document.querySelector("form[name='card-form']");
const profileTitleInput = document.querySelector("#modal__input_name");
const profileDescriptionInput = document.querySelector("#modal__input_description");

// Instances
const userInfo = new UserInfo({ nameSelector: ".profile__title", descriptionSelector: ".profile__description" });
const popupWithImage = new PopupWithImage("#modal-preview-picture");
popupWithImage.setEventListeners();
const popupWithFormProfile = new PopupWithForm("#profile-edit-modal", handleProfileFormSubmit);
popupWithFormProfile.setEventListeners();
const popupWithFormAddCard = new PopupWithForm("#add-card-modal", handleAddCardFormSubmit);
popupWithFormAddCard.setEventListeners();

// Function to create card
function createCard(cardData) {
    const card = new Card(cardData, "#card-template", () => popupWithImage.open(cardData));
    return card.getView();
}

// Function to handle profile form submit
function handleProfileFormSubmit(formData) {
    userInfo.setUserInfo({
        name: formData.name,
        description: formData.description
    });
    popupWithFormProfile.close();
}

// Function to handle add card form submit
function handleAddCardFormSubmit(formData) {
    const cardElement = createCard({ name: formData.title, link: formData.url });
    cardSection.addItem(cardElement);
    popupWithFormAddCard.close();
}

// Section instance to render initial cards
const cardSection = new Section({
    items: initialCards,
    renderer: (item) => {
        const cardElement = createCard(item);
        cardSection.addItem(cardElement);
    }
}, ".cards__list");

cardSection.renderItems();

// Enable validation
const profileFormValidator = new FormValidator(validationSettings, profileEditForm);
profileFormValidator.enableValidation();
const addCardFormValidator = new FormValidator(validationSettings, addCardFormElement);
addCardFormValidator.enableValidation();

// Event listeners for opening modals
profileEditButton.addEventListener("click", () => {
    const userInfoData = userInfo.getUserInfo();
    profileTitleInput.value = userInfoData.name;
    profileDescriptionInput.value = userInfoData.description;
    profileFormValidator.resetValidation();
    popupWithFormProfile.open();
});

addNewCardButton.addEventListener("click", () => {
    addCardFormValidator.resetValidation();
    popupWithFormAddCard.open();
});

[profileEditModal, addCardModal, previewImageModal].forEach((modal) => {
    modal.addEventListener("click", closeOnOverlayClick);
});