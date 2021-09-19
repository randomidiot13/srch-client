let mode = "light";

function light() {
  let elements = [];
  for (let x of document.getElementsByClassName("dark"))
    elements.push(x);
  for (let x of elements) {
    x.classList.remove("dark");
    x.classList.add("light");
  }
  mode = "light";
}

function dark() {
  let elements = [];
  for (let x of document.getElementsByClassName("light"))
    elements.push(x);
  for (let x of elements) {
    x.classList.remove("light");
    x.classList.add("dark");
  }
  mode = "dark";
}