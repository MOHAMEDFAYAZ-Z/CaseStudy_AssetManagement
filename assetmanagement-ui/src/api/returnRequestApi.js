import axiosClient, { getErrorMessage } from "./axiosClient";

export async function createReturnRequest(data) {
  try {
    const response = await axiosClient.post("/ReturnRequest", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create return request."));
  }
}

export async function getAllReturnRequests() {
  try {
    const response = await axiosClient.get("/ReturnRequest");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch return requests."));
  }
}

export async function getMyReturnRequests() {
  try {
    const response = await axiosClient.get("/ReturnRequest/my");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my return requests."));
  }
}

export async function updateReturnRequestStatus(id, status) {
  try {
    const response = await axiosClient.put(
      `/ReturnRequest/${id}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update return request status."));
  }
}