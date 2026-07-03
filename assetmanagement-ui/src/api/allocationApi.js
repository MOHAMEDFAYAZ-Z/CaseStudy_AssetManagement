import axiosClient, { getErrorMessage } from "./axiosClient";

export async function requestAsset(assetId) {
  try {
    const response = await axiosClient.post("/Allocation/request", { assetId });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to request asset."));
  }
}

export async function getAllAllocations() {
  try {
    const response = await axiosClient.get("/Allocation");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch allocations."));
  }
}

export async function getMyAllocations() {
  try {
    const response = await axiosClient.get("/Allocation/my");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my allocations."));
  }
}

export async function updateAllocationStatus(id, status) {
  try {
    const response = await axiosClient.put(`/Allocation/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update allocation status."));
  }
}