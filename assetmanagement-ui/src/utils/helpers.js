// Get error message from API response
export function getErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.title) {
    return error.response.data.title;
  }
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
}

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Get role from localStorage
export function getRole() {
  return localStorage.getItem("role");
}

// Get name from localStorage
export function getName() {
  return localStorage.getItem("name");
}

// Check if user is logged in
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// Check if user is Admin
export function isAdmin() {
  return localStorage.getItem("role") === "Admin";
}

// Check if user is Employee
export function isEmployee() {
  return localStorage.getItem("role") === "Employee";
}

// Clear all auth data on logout
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("userId");
}