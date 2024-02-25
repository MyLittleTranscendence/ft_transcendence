import fetchAPI from "../../utils/fetchAPI.js";

let idTimer;

const idValidationHandler = (e, setWarningText, setIsValid) => {
  const inputValue = e.target.value;
  const pattern = e.target.getAttribute("pattern");

  clearTimeout(idTimer);

  if (inputValue.length < 8) {
    setWarningText("ID too short");
    setIsValid(false);
  } else if (inputValue.length > 24) {
    setWarningText("ID too long");
    setIsValid(false);
  } else if (pattern && !new RegExp(pattern).test(inputValue)) {
    setWarningText("Please use alphabet and number only");
    setIsValid(false);
  } else {
    setWarningText("");
    idTimer = setTimeout(() => {
      fetchAPI
        .get(`/check/username/?username=${inputValue}`)
        .then((data) => {
          if (data.exists) {
            setWarningText("ID already exists");
            setIsValid(false);
          } else {
            setIsValid(true);
          }
        })
        .catch(() => setIsValid(false));
    }, 500);
  }
};

let nicknameTimer;

const nicknameValidationHandler = (e, setWarningText, setIsValid) => {
  const inputValue = e.target.value;

  const regex = /^[\p{L}\p{N}]+$/u;

  clearTimeout(nicknameTimer);

  if (inputValue.length < 4) {
    setWarningText("Nickname too short");
    setIsValid(false);
  } else if (inputValue.length > 24) {
    setWarningText("Nickname too long");
    setIsValid(false);
  } else if (!regex.test(inputValue)) {
    setWarningText("Invalid character");
    setIsValid(false);
  } else {
    setWarningText("");
    nicknameTimer = setTimeout(() => {
      fetchAPI
        .get(`/check/nickname/?nickname=${inputValue}`)
        .then((data) => {
          if (data.exists) {
            setWarningText("Nickname already exists");
            setIsValid(false);
          } else {
            setIsValid(true);
          }
        })
        .catch(() => setIsValid(false));
    }, 500);
  }
};

const passwordValidationHandler = (e, setWarningText, setIsValid) => {
  const inputValue = e.target.value;

  const hasNumber = /[0-9]/.test(inputValue);
  const hasSpecialChar = /[\W_]/.test(inputValue);
  const hasLowercase = /[a-z]/.test(inputValue);
  const hasUppercase = /[A-Z]/.test(inputValue);

  if (inputValue.length < 8) {
    setWarningText("Password too short. Must be at least 8 characters.");
    setIsValid(false);
  } else if (inputValue.length > 20) {
    setWarningText("Password too long. Must be no more than 20 characters.");
    setIsValid(false);
  } else if (!hasLowercase) {
    setWarningText("Password must include at least one lowercase letter.");
    setIsValid(false);
  } else if (!hasUppercase) {
    setWarningText("Password must include at least one uppercase letter.");
    setIsValid(false);
  } else if (!hasNumber) {
    setWarningText("Password must include at least one number.");
    setIsValid(false);
  } else if (!hasSpecialChar) {
    setWarningText("Password must include at least one special character.");
    setIsValid(false);
  } else {
    setWarningText("");
    setIsValid(true);
  }
};

const verifyPasswordHandler = (e, setWarningText, setIsValid) => {
  const originalPassword = document.getElementById("signup-form-pw").value;
  if (e.target.value !== originalPassword) {
    setWarningText("Password does not match");
    setIsValid(false);
  } else {
    setWarningText("");
    setIsValid(true);
  }
};

const validateEmailHandler = (e, setWarningText, setIsValid) => {
  const inputValue = e.target.value;
  const pattern = e.target.getAttribute("pattern");

  if (pattern && !new RegExp(pattern).test(inputValue)) {
    setWarningText("Invalid E-Mail format");
    setIsValid(false);
  } else {
    setWarningText("");
    setIsValid(true);
  }
};

export {
  idValidationHandler,
  nicknameValidationHandler,
  passwordValidationHandler,
  verifyPasswordHandler,
  validateEmailHandler,
};
