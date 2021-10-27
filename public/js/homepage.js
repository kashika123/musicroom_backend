import { apiConfig } from "./modules/config.js";

let secondColumnElements = "";
let thirdColumnElements = "";
const overlayClassName = "overlay";

getCategories();

async function getCategories() {
  const response = await fetch(`${apiConfig.apiBaseUrl}/api/categories`, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  const categories = await response.json();
  const firstRangeIndex =
    categories.length > 1
      ? Math.ceil(categories.length / 2)
      : categories.length;
  if (categories.length === 0) {
    thirdColumnElements = `<div><p>NO CATEGORY AVALABLE</p></div>`;
  }
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const currentContainer = `<div class="container"> <img src="${category.image}" style="width:100%"> <div class="overlay" id=${category._id}> <p>${category.name}</p> <i class="material-icons">arrow_right_alt</i></div></div>`;
    if (i < firstRangeIndex) {
      secondColumnElements = secondColumnElements + currentContainer;
    } else {
      thirdColumnElements = thirdColumnElements + currentContainer;
    }
  }
  $(secondColumnElements).appendTo("#second-column");
  $(thirdColumnElements).appendTo("#third-column");

  document
    .getElementById("column-container")
    .addEventListener("click", function (e) {
      e.preventDefault();
      if (
        e.target.className === overlayClassName ||
        e.target.parentElement?.className === overlayClassName
      ) {
        if (e.target.id) {
          redirectTo(e.target.id);
        } else {
          redirectTo(e.target.parentElement.id);
        }
      }
    });

  function redirectTo(id) {
    window.location = `/album.html?cat=${id}`;
  }
}
