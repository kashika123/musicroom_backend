import { apiConfig } from "./modules/config.js";
import { showSnack } from "./modules/utils.js";

const form = document.getElementById("login");
const button = document.getElementById("btn");
const username = document.getElementById("username");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loading();
  try {
    const userInfo = {
      name: username.value,
      password: password.value,
    };
    const response = await fetch(`${apiConfig.apiBaseUrl}/api/users/login`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo), // body data type must match "Content-Type" header
    });
    const { error, data } = await response.json();
    if (response.status !== 200) {
      stopLoading();
      return showSnack("error", error);
    }
    stopLoading();
    document.cookie = `token=${data.token}`;
    window.location.href = "/homepage.html";
  } catch (error) {
    stopLoading();
    return showSnack("error", error.message);
  }
});

function loading() {
  button.textContent = "Loading...";
  username.setAttribute("disabled", true);
  password.setAttribute("disabled", true);
}

function stopLoading() {
  button.textContent = "LOGIN HERE";
  username.removeAttribute("disabled");
  password.removeAttribute("disabled");
}
