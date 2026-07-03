import axiosClient, { getErrorMessage } from "./axiosClient";

export async function getAllAssets() {
  try {
    const response = await axiosClient.get("/Asset");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch assets."));
  }
}

export async function getAssetById(id) {
  try {
    const response = await axiosClient.get(`/Asset/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch asset."));
  }
}

export async function createAsset(assetData) {
  try {
    const response = await axiosClient.post("/Asset", assetData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create asset."));
  }
}

export async function updateAsset(id, assetData) {
  try {
    const response = await axiosClient.put(`/Asset/${id}`, assetData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update asset."));
  }
}

export async function deleteAsset(id) {
  try {
    const response = await axiosClient.delete(`/Asset/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete asset."));
  }
}

export async function searchAssets(keyword, categoryId) {
  try {
    const response = await axiosClient.get("/Asset/search", {
      params: { keyword, categoryId },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to search assets."));
  }
}

export async function getAssetsPaged(pageNumber, pageSize) {
  try {
    const response = await axiosClient.get("/Asset/paged", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch paged assets."));
  }
}