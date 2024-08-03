import "../pages/index.css";
import Card from "../components/Card.js";
import { enableValidation, formValidators } from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import { initialCards, validationSettings } from "../utils/Constants.js";

 // Elements
 const profileEditButton = document.querySelector("#profile-edit-button");
 const addNewCardButton = document.querySelector(".profile__add-button");

 // Forms
 const profileForm = document.forms['profile-form'];
 const cardForm = document.forms['card-form'];

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
   cardForm.reset(); // Clear the form fields only after submission
   formValidators['card-form'].disableButton(); // Disable submit button after form reset
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

 // Enable validation for all forms
 enableValidation(validationSettings);

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
