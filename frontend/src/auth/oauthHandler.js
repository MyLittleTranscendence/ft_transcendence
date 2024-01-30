const oauthHandler = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/login/oauth2/42api");

    console.log(res);
  } catch (e) {
    console.log(e);
  }
};

export default oauthHandler;
