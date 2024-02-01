import getRouter from "../../core/router.js";

const signInHandler = async (event) => {
  event.preventDefault();

  const { srcElement } = event.srcElement;

  const data = {
    username: srcElement[0].value,
    password: srcElement[1].value,
  };

  try {
    const res = await fetch("http://localhost:8000/api/login/default/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // 요청이 성공적으로 처리됐을 때의 로직
      console.log("Login successful");
      const responseData = await res.json();
      console.log(responseData);

      const { navigate } = getRouter();
      navigate("/");
    } else {
      // 서버에서 오류 응답이 왔을 때의 로직
      console.log("Login failed");
    }
  } catch (error) {
    // 네트워크 오류 등으로 요청 자체가 실패했을 때의 로직
    console.error("Error during fetch:", error);
  }
};

export default signInHandler;
