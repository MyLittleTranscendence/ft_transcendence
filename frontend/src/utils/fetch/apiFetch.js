import getRouter from "src/core/router.js";

const apiFetch = async (
  method,
  path,
  data = null,
  includeCredentials = false
) => {
  const options = {
    method,
    headers: new Headers({ "Content-Type": "application/json" }),
  };

  if (method === "POST" || method === "PUT") {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`http://localhost:8000/api${path}`, options);
    if (!res.ok) {
      if (res.status === 401) {
        getRouter().navigate("/laning");
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export default apiFetch;
