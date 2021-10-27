import { apiConfig } from "./modules/config.js";
import { showSnack } from "./modules/utils.js";

let rowElement = "";
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("cat");
let buttons = [];
let albums = [];
let userMusics = [];

getData();

async function getData() {
  albums = await getAlbumsByCategory();
  const category = await getCategory();
  userMusics = await getUserMusic();
  if (albums.length === 0) {
    rowElement = `<div><p>NO ALBUM AVALABLE</p></div>`;
  }
  const userMusicAlbumIds = userMusics.map((el) => el.album);
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    let currentContainer;
    if (userMusicAlbumIds.indexOf(album._id) < 0) {
      currentContainer = `<div class="col-lg-3 col-sm-6 album-thumb" id=${album._id}><div class="image-container"><img src=${album.image}></div><button class="btn" id=${album._id}>Add to my music</button></div>`;
    } else {
      currentContainer = `<div class="col-lg-3 col-sm-6 album-thumb" id=${album._id}><div class="image-container"><img src=${album.image}></div><button class="btn disable" id=${album._id} disabled=true>Added to My Music</button></div>`;
    }

    rowElement = rowElement + currentContainer;
  }
  $(rowElement).appendTo("#row-container");
  $("#album-container").prepend(
    $(`<h1>${category.name.toUpperCase()} ALBUMS</h1><hr>`)
  );
  buttons = document.querySelectorAll(".btn");
}

async function getAlbumsByCategory() {
  const response = await fetch(
    `${apiConfig.apiBaseUrl}/api/categories/${categoryId}/albums`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );
  const albums = await response.json();
  return albums;
}

async function getCategory() {
  const response = await fetch(
    `${apiConfig.apiBaseUrl}/api/categories/${categoryId}`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );
  const category = await response.json();
  return category;
}

async function getUserMusic() {
  const response = await fetch(
    `${apiConfig.apiBaseUrl}/api/users/find-user-music`,
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
  );
  const userMusics = await response.json();
  return userMusics;
}

document
  .getElementById("row-container")
  .addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.className === "btn") {
      //alert(`Clicked on ${e.target.id}`);
      e.target.innerText = "Adding to my music...";
      //disable other button in order to avaoid multiple call
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("disabled", true);
      }
      //call api to update user music list
      updateUserMusic(e.target);
    }
  });

async function updateUserMusic(targetButton) {
  const albumId = targetButton.id;
  const album = albums.find((album) => album._id === albumId);
  try {
    const response = await fetch(
      `${apiConfig.apiBaseUrl}/api/users/update-user-music`,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include, *same-origin, omit
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({ album }), // body data type must match "Content-Type" header
      }
    );
    //remove disable attribute
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].removeAttribute("disabled");
    }
    if (response.status !== 200) {
      if (response.status === 401) {
        window.location.href = "/login.html";
      }
      const { error } = await response.json();
      showSnack("error", error);
    } else {
      targetButton.innerText = "Added to My Music";
      targetButton.setAttribute("disabled", true);
      targetButton.classList.add("disable");
      showSnack("success", "Album added with success");
    }
  } catch (error) {
    console.log(error);
  }
}
