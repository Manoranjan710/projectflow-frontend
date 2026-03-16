export default function getApiErrorMessage(error) {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong.";

  return typeof message === "string" ? message : "Something went wrong.";
}

