function display_generic_api_inner() {
  let output = back_header("Generic API Search") +
               `<div style="text-align:center">` +
                 `<p style="word-wrap:break-word">Make bare-bones GET requests to the API. Response data will be displayed in a collapsible ` +
                 `tree.</p>` +
                 `<p style="word-wrap:break-word">Enter an API endpoint to search from (such as <code>/games/j1npme6p</code>):</p>` +
                 `<input type="text" id="endpoint" size="60" class="${mode}"> ` +
                 `<button onclick="load_generic_api()" class="${mode}">Search</button>` +
               `</div>` +
               `<div id="generic-contain">` +
                 `<p id="generic-status"></p>` +
                 `<span id="pre-parent"></span>` +
                 `<ul style="word-wrap:break-word" class="tree" id="parent"></ul>` +
               `</div>`;
  disp(output);
}

function display_generic_api() {
  push_stack(display_generic_api_inner);
}