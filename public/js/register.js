import { apiConfig } from "./modules/config.js";
import { showSnack } from "./modules/utils.js";

const form = document.getElementById("register");
const button = document.getElementById("btn");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loading();
  if (password.value !== confirmPassword.value)
    return showSnack("error", "Passwords don't match!");
  try {
    const userInfo = {
      email: email.value,
      password: password.value,
      name: username.value,
    };
    const response = await fetch(`${apiConfig.apiBaseUrl}/api/users/register`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(userInfo), // body data type must match "Content-Type" header
    });
    if (response.status !== 200) {
      stopLoading();
      const { error } = await response.json();
      return showSnack("error", error);
    }
    stopLoading();
    showSnack("success", "User registered with success");
    window.location.href = "/homepage.html";
  } catch (error) {
    stopLoading();
    return showSnack("error", error.message);
  }
});

function loading() {
  button.textContent = "Loading...";
  username.setAttribute("disabled", true);
  email.setAttribute("disabled", true);
  password.setAttribute("disabled", true);
  confirmPassword.setAttribute("disabled", true);
}

function stopLoading() {
  button.textContent = "REGISTER HERE";
  username.removeAttribute("disabled");
  email.removeAttribute("disabled");
  password.removeAttribute("disabled");
  confirmPassword.removeAttribute("disabled");
}
