const fetchAPI = async (
  method,
  path,
  data = null,
  includeCredentials = false
) => {
  const options = {
    method,
  };

  if (method === "POST" || method === "PUT") {
    options.body = JSON.stringify(data);
    options.headers = new Headers({ "Content-Type": "application/json" });
  }

  try {
    const res = await fetch(`http://localhost:8000/api${path}`, options);

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    let resData = await res.json();

    return { status: res.status, data: resData };
  } catch (e) {
    console.error(e);
  }
};

export default fetchAPI;
