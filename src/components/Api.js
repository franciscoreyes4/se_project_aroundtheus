class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      console.log('Response is OK, returning JSON');
      return res.json();
    } else {
      console.error(`Response error with status: ${res.status}`);
      return Promise.reject(`Error: ${res.status}`);
    }
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    }).then(this._checkResponse);
  }

  updateUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    }).then(this._checkResponse);
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    console.log(`Making DELETE request for card with ID: ${cardId}`);
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers
    })
      .then((res) => {
        console.log(`Received response for delete request: ${res.status}`);
        if (!res.ok) {
          console.error(`Failed to delete card: ${res.statusText}`);
        }
        return res.json().catch(() => {
          console.warn('Received empty or non-JSON response.');
          return {};
        });
      })
      .then((data) => {
        if (data.error) {
          console.error(`Server reported an error: ${data.error}`);
        }
        return data;
      })
      .catch((error) => {
        console.error(`Error during the API request: ${error}`);
        throw error;
      });
  }
}

export default Api;