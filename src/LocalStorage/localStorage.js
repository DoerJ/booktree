// local storage api
let localStorageModel = {
  storeItemToLocal: (token, item) => {
    localStorage.setItem(token, item);
  },
  fetchItemFromLocal: (token) => {
    let value = localStorage.getItem(token);
    return value;
  },
  removeItemFromLocal: (token) => {
    localStorage.removeItem(token);
  },
  removeAll: () => {
    localStorage.clear();
  }
};

export { localStorageModel };
