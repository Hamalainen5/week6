// frontend/src/utils/storage.js

// Save user object in sessionStorage
export const setUser = (user) => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

// Retrieve user object from sessionStorage
export const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove user from sessionStorage
export const removeUser = () => {
  sessionStorage.removeItem("user");
};
