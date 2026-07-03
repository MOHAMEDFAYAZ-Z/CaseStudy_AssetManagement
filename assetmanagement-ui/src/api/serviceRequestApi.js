import axiosClient, { getErrorMessage } from "./axiosClient";

export async function createServiceRequest(data) {
  try {
    const response = await axiosClient.post("/ServiceRequest", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create service request."));
  }
}

export async function getAllServiceRequests() {
  try {
    const response = await axiosClient.get("/ServiceRequest");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch service requests."));
  }
}

export async function getMyServiceRequests() {
  try {
    const response = await axiosClient.get("/ServiceRequest/my");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my service requests."));
  }
}

export async function updateServiceRequestStatus(id, status) {
  try {
    const response = await axiosClient.put(
      `/ServiceRequest/${id}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update service request status."));
  }
}