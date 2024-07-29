import "../pages/index.css";
import Card from "../components/card.js";
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
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const previewImageModal = document.querySelector("#modal-preview-picture");

// Universal Close Button Handler
const closeButtons = document.querySelectorAll('.modal__close');
closeButtons.forEach((button) => {
    const modal = button.closest('.modal');
    button.addEventListener('click', () => closeModal(modal));
});

// Functions for modal handling
function closeModal(modal) {
    modal.classList.remove("modal_opened");
    document.removeEventListener("keydown", closeOnEscKey);
}

function closeOnOverlayClick(e) {
    if (e.target.classList.contains("modal_opened")) {
        closeModal(e.target);
    }
}

function closeOnEscKey(event) {
    if (event.key === "Escape") {
        const openedModal = document.querySelector(".modal_opened");
        if (openedModal) {
            closeModal(openedModal);
        }
    }
}

function openModal(modal) {
    modal.classList.add("modal_opened");
    document.addEventListener("keydown", closeOnEscKey);
}

// Instances
const userInfo = new UserInfo({ nameSelector: ".profile__title", jobSelector: ".profile__description" });
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
    userInfo.setUserInfo(formData);
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

// Event listeners
profileEditButton.addEventListener("click", () => {
    const userInfoData = userInfo.getUserInfo();
    profileTitleInput.value = userInfoData.name;
    profileDescriptionInput.value = userInfoData.job;
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