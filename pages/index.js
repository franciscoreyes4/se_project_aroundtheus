import Card from "../components/card.js";
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
const addModalCloseButton = addCardModal.querySelector("#modal-close-button");
const profileModalCloseButton = profileEditModal.querySelector("#modal-close-button");
const addCardFormElement = addCardModal.querySelector("#add-card-form");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#modal__input_name");
const profileDescriptionInput = document.querySelector("#modal__input_description");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content.firstElementChild;
const addNewCardButton = document.querySelector(".profile__add-button");
const cardTitleInput = addCardFormElement.querySelector("#modal__input_title");
const cardUrlInput = addCardFormElement.querySelector("#modal__input_url");
const cardPreviewCloseButton = document.querySelector("#picture-close-button");
const previewImageModal = document.querySelector("#modal-preview-picture");
const previewImage = previewImageModal.querySelector(".modal__image");
const previewImageCaption = previewImageModal.querySelector(".modal__picture_caption");

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

function renderCard(cardData, cardList) {
    const card = new Card(cardData, "#card-template", handleImageClick);
    cardList.prepend(card.getView());
}

// Validation
const validationSettings = {
    inputSelector: ".modal__input",
    submitButtonSelector: ".modal__button",
    inactiveButtonClass: "modal__button_disabled",
    inputErrorClass: "modal__input_type_error",
    errorClass: "modal__input_type_error_visible",
};

const editFormValidator = new FormValidator(validationSettings, profileEditForm);
const addFormValidator = new FormValidator(validationSettings, addCardFormElement);

editFormValidator.enableValidation();
addFormValidator.enableValidation();

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
    closeModal(addCardModal);
}

// Event listeners
profileEditForm.addEventListener("submit", handleProfileEditSubmit);
addCardFormElement.addEventListener("submit", handleAddCardFormSubmit);

profileEditButton.addEventListener("click", () => {
    openModal(profileEditModal);
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
});
profileModalCloseButton.addEventListener("click", () => closeModal(profileEditModal));
addNewCardButton.addEventListener("click", () => openModal(addCardModal));
addModalCloseButton.addEventListener("click", () => closeModal(addCardModal));
cardPreviewCloseButton.addEventListener("click", () => closeModal(previewImageModal));

[profileEditModal, addCardModal, previewImageModal].forEach((modal) => {
    modal.addEventListener("click", closeOnOverlayClick);
});

initialCards.forEach((cardData) => renderCard(cardData, cardList));

