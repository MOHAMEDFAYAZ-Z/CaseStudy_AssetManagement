import { useState } from "react";

export default function useMessage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function showSuccess(message) {
    setSuccessMessage(message);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  function showError(message) {
    setErrorMessage(message);
    setSuccessMessage("");
  }

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  return {
    successMessage,
    errorMessage,
    showSuccess,
    showError,
    clearMessages,
  };
}