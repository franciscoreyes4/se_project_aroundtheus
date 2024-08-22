class UserInfo {
  constructor({ nameSelector, descriptionSelector, avatarSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._descriptionElement = document.querySelector(descriptionSelector);
    this._avatarElement = document.querySelector(avatarSelector);
    this._userId = null; // Initialize the user ID
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      description: this._descriptionElement.textContent,
      avatar: this._avatarElement.src
    };
  }

  setUserInfo({ name, description, avatar, userId }) {
    this._nameElement.textContent = name;
    this._descriptionElement.textContent = description;
    this._avatarElement.src = avatar;
    if (userId) {
      this._userId = userId; // Store the user ID
    }
  }

  getUserId() {
    return this._userId;
  }
}

  

export default UserInfo;
