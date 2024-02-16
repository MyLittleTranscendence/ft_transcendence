const fetchRequest = async (url, requestOptions) => {
  const response = await fetch(`http://localhost:8000/api${url}/`, {
    ...requestOptions,
    credentials: "include",
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

const prepareBody = (body) => {
  if (body instanceof FormData) {
    return { body };
  }
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
};

const get = async (url) => {
  const requestOptions = {
    method: "GET",
  };
  return fetchRequest(url, requestOptions);
};

const post = async (url, body) => {
  const requestOptions = {
    method: "POST",
    ...prepareBody(body),
  };
  return fetchRequest(url, requestOptions);
};

const put = async (url, body) => {
  const requestOptions = {
    method: "PUT",
    ...prepareBody(body),
  };
  return fetchRequest(url, requestOptions);
};

const patch = async (url, body) => {
  const requestOptions = {
    method: "PATCH",
    ...prepareBody(body),
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
