const initialCards = [
    {
        name: "Yosemite Valley",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
    },
    {
        name: "Lake Louise",
        link:"https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
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
        name:"Vanoise National Park",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
    },
    {
        name: "Lago di Braies",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
    }
];

// Elements
const editProfileModal = document.querySelector("#edit-modal");
const addCardModal = document.querySelector("#add-card-modal");
const profileFormElement = document.querySelector(".modal__form");
const profileEditButton = document.querySelector("#profile-edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput= document.querySelector("#modal__input_title");
const profileDescriptionInput= document.querySelector("#modal__input_description");
const profileEditForm = profileEditModal.querySelector(".modal__form");
const cardList = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileModalCloseModal = editProfileModal.querySelector(".modal__close");
const addCardModalCloseModal = addCardModal.querySelector(".modal__close");



// Functions
function closeModal(modal) {
    modal.classList.remove("modal_opened");
}

function openModal(modal) {
    // profileTitleInput.value = profileTitle.textContent;
    // profileDescriptionInput.value = profileDescription.textContent;
    modal.classList.add("modal_opened");
}

function getCardElement(cardData) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImagEl = cardElement.querySelector(".card__image");
    const cardTitleEl = cardElement.querySelector(".card__title");
    const likeButton = cardElement.querySelector("card__like_button");
    const deleteButton = cardElement.querySelector(".card__delete_button");

    likeButton.addEventListener("click", () => {
        likeButton.classList.toggle(".card__like-button_active");
    });

    deleteButton.addEventListener("click",() => {
        cardElement.remove();
    });

    cardImagEl.src = cardData.link;
    cardImagEl.alt = cardData.name;
    cardTitleEl.textContent = cardData.name;

    cardImagEl.addEventListener("click", () => {

    });
    
    return cardElement;
}

// Event Handlers
function handleProfileEditSubmit(e) {
    e.preventDefault();
    profileTitle.textContent = profileTitleInput.value;
    profileDescription.textContent = profileDescriptionInput.value;
    closePopup();
}

// Event Listeners


profileEditButton.addEventListener("click", () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
    openModal(editProfileModal)
});
profileModalCloseModal.addEventListener("click", () => closeModal(editProfileModal));
profileEditForm.addEventListener("submit", handleProfileEditSubmit);

addNewCardButton.addEventListener("click", () => openModal(addCardModal));
addCardModalCloseModal.addEventListener("click", () => closeModal(addCardModal))

initialCards.forEach((cardData) => {
    cardList.prepend(getCardElement(cardElement));
});
