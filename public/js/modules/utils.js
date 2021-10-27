const showSnack = (snackMessageType, message, keep) => {
  const x = document.getElementById("snackbar");
  if (snackMessageType) x.classList.add(snackMessageType);
  x.classList.add("show");
  x.textContent = message || "";
  if (keep) {
    return;
  } else {
    // After 3 seconds, remove the show class from DIV
    setTimeout(function (e) {
      x.className = x.className.replace("show", "");
    }, 3000);
  }
};

const hideSnack = () => {
  const x = document.getElementById("snackbar");
  x.className.replace("show", "");
};
export { showSnack, hideSnack };
