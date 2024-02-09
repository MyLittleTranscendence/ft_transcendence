const fetchRequest = async (url, requestOptions, auth = true) => {
  const response = await fetch(`http://localhost:8000/api${url}/`, {
    ...requestOptions,
    credentials: auth === true ? "include" : "omit",
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    const errorDetail =
      (errorResponse && errorResponse.detail) || response.statusText;
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return response.json();
  }

  return {};
};

const get = async (url) => {
  const requestOptions = {
    method: "GET",
  };
  return fetchRequest(url, requestOptions);
};

const post = async (url, body, auth) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetchRequest(url, requestOptions, auth);
};

const put = async (url, body) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetchRequest(url, requestOptions);
};

const patch = async (url, body) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  return fetchRequest(url, requestOptions);
};

const deleteRequest = async (url) => fetchRequest(url, { method: "DELETE" });

const fetchAPI = {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
};

export default fetchAPI;
