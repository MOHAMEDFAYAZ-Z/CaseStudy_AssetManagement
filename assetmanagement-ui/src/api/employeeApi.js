import axiosClient, { getErrorMessage } from "./axiosClient";

export async function getAllEmployees() {
  try {
    const response = await axiosClient.get("/Employee");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch employees."));
  }
}

export async function getEmployeeById(id) {
  try {
    const response = await axiosClient.get(`/Employee/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch employee."));
  }
}

export async function updateEmployee(id, employeeData) {
  try {
    const response = await axiosClient.put(`/Employee/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update employee."));
  }
}

export async function deleteEmployee(id) {
  try {
    const response = await axiosClient.delete(`/Employee/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete employee."));
  }
}