function escape(str) {
  if (str === null)
    return "null";
  else if (str === undefined)
    return "undefined";
  else
    return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function iso_to_words(iso) {
  if (iso === null || iso === undefined)
    return iso;
  else
    return iso.replace("Z", "").split("T").join(" at ") + " UTC";
}

function str_time(time) {
  let milli = Math.round(time * 1000);
  let hours = (Math.floor(milli / 3600000)).toString();
  let minutes = (Math.floor((milli % 3600000) / 60000)).toString();
  let seconds = (Math.floor((milli % 60000) / 1000)).toString();
  let milliseconds = (milli % 1000).toString();
  if (hours != "0") {
    if (milliseconds != "0")
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}.${milliseconds.padStart(3, "0")}`;
    else
      return `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
  } else if (minutes != "0") {
    if (milliseconds != "0")
      return `${minutes}:${seconds.padStart(2, "0")}.${milliseconds.padStart(3, "0")}`;
    else
      return `${minutes}:${seconds.padStart(2, "0")}`;
  } else if (seconds != "0") {
    if (milliseconds != "0")
      return `${seconds}.${milliseconds.padStart(3, "0")}`;
    else
      return `0:${seconds.padStart(2, "0")}`;
  } else
    return `0.${milliseconds.padStart(3, "0")}`;
}

function lowercase(x) {
  if (x === null || x === undefined)
    return x;
  else
    return x.toLowerCase();
}

function back_header(text) {
  return `<h2 style="text-align:center">${text} <button onclick="pop_stack()" class="link ${mode}">Back</button></h2>`;
}

function disp(text) {
  document.getElementById("screen").innerHTML = text;
}