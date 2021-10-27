import { apiConfig } from "./modules/config.js";
import { showSnack, hideSnack } from "./modules/utils.js";

$("#music-container").prepend($("<h1> MY MUSIC ROOM</h1><hr>"));
let rowElement = "";
let buttons = [];
let albums = [];
let userMusics = [];

getMyMusic();

async function getMyMusic() {
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
  const musics = await response.json();
  const albums = musics.map((el) => el.albumCollection);
  for (let i = 0; i < musics.length; i++) {
    const album = musics[i].albumCollection;
    const category = musics[i].category;
    let currentContainer;
    currentContainer = `<div class="col-lg-3 col-sm-6 album-thumb" id=${album._id}>
    <div class="hover" id="image-container">
      <span class="material-icons delete" title="remove" id=${musics[i]._id}>cancel</span>
      <img src=${album.image}>
      <div class="content-details fadeIn-bottom">
          <h4 class="content-title">Added from ${category.name}</h4>
          <p class="content-text"><strong>Album:</strong> ${album.name}</p>
          <p class="content-text"><strong>Artist:</strong> ${album.artistName}</p>
        </div>
    </div>
    <section class="listen-action-container">
    <img src="https://services.linkfire.com/logo_spotify_onlight.svg" alt="spotify" />
    <a href="${album.spotifyLink}" target="_blank"><button class="btn" id=${album._id}>Listen now</button></div></a>
    </section>`;

    rowElement = rowElement + currentContainer;
  }
  $(rowElement).appendTo("#row-container");
  buttons = document.querySelectorAll(".delete");
}

document
  .getElementById("row-container")
  .addEventListener("click", function (e) {
    if (e.target.nodeName === "SPAN") {
      e.preventDefault();
      $(".hover").removeClass("hover");
      showSnack("warning", "Deleting...", true);
      removeUserMusic(e.target.id);
    }
  });

async function removeUserMusic(id) {
  try {
    const response = await fetch(
      `${apiConfig.apiBaseUrl}/api/users/delete-user-music`,
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
        body: JSON.stringify({ _id: id }), // body data type must match "Content-Type" header
      }
    );

    if (response.status !== 200) {
      if (response.status === 401) {
        window.location.href = "/login.html";
        return;
      }
      const { error } = await response.json();
      hideSnack();
      showSnack("error", error);
    } else {
      window.location.reload();
    }
  } catch (error) {
    hideSnack();
    showSnack("error", error);
  }
}
