import axiosClient, { getErrorMessage } from "./axiosClient";

export async function registerUser(userData) {
  try {
    const response = await axiosClient.post("/Auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registration failed."));
  }
}

export async function loginUser(credentials) {
  try {
    const response = await axiosClient.post("/Auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed."));
  }
}

export async function logoutUser() {
  try {
    const response = await axiosClient.post("/Auth/logout");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Logout failed."));
  }
}