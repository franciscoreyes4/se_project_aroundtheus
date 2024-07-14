import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

// Card Data
const initialCards = [
    {
        name: "Yosemite Valley",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
    },
    {
        name: "Lake Louise",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
    },
    {
        name: "Bald Mountains",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
    },
    {
        name: "Latemar",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
    },
    {
        name: "Vanoise National Park",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
    },
    {
        name: "Lago di Braies",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
    },
];

// Elements
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const addModalCloseButton = document.querySelector("#add-modal-close-button");
const profileModalCloseButton = document.querySelector("#profile-modal-close-button");
const addCardFormElement = document.querySelector("form[name='card-form']");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#modal__input_name");
const profileDescriptionInput = document.querySelector("#modal__input_description");
const profileEditForm = document.querySelector("form[name='profile-form']");
const cardList = document.querySelector(".cards__list");
const addNewCardButton = document.querySelector(".profile__add-button");
const cardTitleInput = addCardFormElement.querySelector("#modal__input_title");
const cardUrlInput = addCardFormElement.querySelector("#modal__input_url");
const cardPreviewCloseButton = document.querySelector("#picture-close-button");
const previewImageModal = document.querySelector("#modal-preview-picture");
const previewImage = previewImageModal.querySelector(".modal__image");
const previewImageCaption = previewImageModal.querySelector(".modal__picture_caption");

// Universal Close Button Handler
const closeButtons = document.querySelectorAll('.modal__close');
closeButtons.forEach((button) => {
    const modal = button.closest('.modal');
    button.addEventListener('click', () => closeModal(modal));
});

// Functions
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

function handleImageClick(name, link) {
    previewImage.src = link;
    previewImage.alt = name;
    previewImageCaption.textContent = name;
    openModal(previewImageModal);
}

function createCard(cardData) {
    const card = new Card(cardData, "#card-template", handleImageClick);
    return card.getView();
}

function renderCard(cardData, cardList) {
    const cardElement = createCard(cardData);
    cardList.prepend(cardElement);
}

// Validation
const validationSettings = {
    formSelector: ".modal__form",
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__button",
    inactiveButtonClass: "modal__button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__input_type_error_visible",
};

// Universal Validator Initialization
const formValidators = {};

const enableValidation = (config) => {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach((formElement) => {
        const validator = new FormValidator(config, formElement);
        const formName = formElement.getAttribute('name');
        if (formName) {
            formValidators[formName] = validator;
            validator.enableValidation();
        }
    });
};

enableValidation(validationSettings);

// Event Handlers
function handleProfileEditSubmit(e) {
    e.preventDefault();
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closeModal(profileEditModal);
}

function handleAddCardFormSubmit(e) {
    e.preventDefault();
    const name = cardTitleInput.value;
    const link = cardUrlInput.value;
    renderCard({ name, link }, cardList);
    e.target.reset();
    formValidators['card-form'].disableButton(); // Disable the submit button
    closeModal(addCardModal);
}

// Event listeners
profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

profileEditButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    formValidators['profile-form'].resetValidation(); // Reset the form validation state
    formValidators['profile-form'].disableButton(); // Ensure the submit button is disabled
    openModal(profileEditModal);
});
profileModalCloseButton.addEventListener("click", () => closeModal(profileEditModal));
addNewCardButton.addEventListener("click", () => {
    formValidators['card-form'].disableButton(); // Ensure the submit button is disabled
    openModal(addCardModal);
});
addModalCloseButton.addEventListener("click", () => closeModal(addCardModal));
cardPreviewCloseButton.addEventListener("click", () => closeModal(previewImageModal));

[profileEditModal, addCardModal, previewImageModal].forEach((modal) => {
    modal.addEventListener("click", closeOnOverlayClick);
});

initialCards.forEach((cardData) => renderCard(cardData, cardList));
