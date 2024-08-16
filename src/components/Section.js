class Section {
    constructor({ items, renderer }, containerSelector) {
      this._items = items;
      this._renderer = renderer;
      this._container = document.querySelector(containerSelector);
    }
  
    renderItems(items) {
      if (!Array.isArray(items)) {
        console.error("renderItems expected an array but received:", items);
        return; // Prevent further execution if the data is not valid
      }
      items.forEach((item) => this._renderer(item));
    }
  
    addItem(element) {
      this._container.prepend(element);
    }
  }
  
  export default Section;
