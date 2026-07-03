import axiosClient, { getErrorMessage } from "./axiosClient";

export async function getAllCategories() {
  try {
    const response = await axiosClient.get("/Category");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch categories."));
  }
}

export async function getCategoryById(id) {
  try {
    const response = await axiosClient.get(`/Category/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch category."));
  }
}

export async function createCategory(categoryData) {
  try {
    const response = await axiosClient.post("/Category", categoryData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create category."));
  }
}

export async function updateCategory(id, categoryData) {
  try {
    const response = await axiosClient.put(`/Category/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update category."));
  }
}

export async function deleteCategory(id) {
  try {
    const response = await axiosClient.delete(`/Category/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete category."));
  }
}