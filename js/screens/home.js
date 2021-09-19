function display_home_inner() {
  let output = `<p style="text-align:center">` +
                 `Click on one of the above buttons to begin searching.` +
               `</p>` +
               `<p style="text-align:center">` +
                 `<small>` +
                   `This unofficial client uses data from <a href="https://www.speedrun.com" target="_blank">speedrun.com</a> licensed under ` +
                   `<a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC-BY-NC 4.0</a>.` +
                 `</small>` +
               `</p>`;
  disp(output);
}

function display_home() {
  push_stack(display_home_inner);
}