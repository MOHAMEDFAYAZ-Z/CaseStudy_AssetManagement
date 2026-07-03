import axiosClient, { getErrorMessage } from "./axiosClient";

export async function sendAuditToAll() {
  try {
    const response = await axiosClient.post("/Audit/send");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to send audit requests."));
  }
}

export async function getAllAudits() {
  try {
    const response = await axiosClient.get("/Audit");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch audits."));
  }
}

export async function getMyAudits() {
  try {
    const response = await axiosClient.get("/Audit/my");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my audits."));
  }
}

export async function respondToAudit(id, status) {
  try {
    const response = await axiosClient.put(
      `/Audit/${id}/respond`,
      null,
      { params: { status } }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to respond to audit."));
  }
}