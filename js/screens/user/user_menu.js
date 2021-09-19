function display_user_api_menu_inner() {
  let output = back_header("User Search") +
               `<div style="text-align:center">` +
                 `<p style="word-wrap:break-word">` +
                   `Get information about a specific user. Their runs and the games they moderate will be available.` +
                 `</p>` +
                 `<p>Enter either a username (such as <code>1</code>) or a user ID (such as <code>zx7gd1yx</code>):</p>` +
                 `<input type="text" id="username" size="30" class="${mode}"> ` +
                 `<button onclick="load_user_profile(document.getElementById('username').value)" class="${mode}">Search</button>` +
               `</div>`;
  disp(output);
}

function display_user_api_menu() {
  push_stack(display_user_api_menu_inner);
}