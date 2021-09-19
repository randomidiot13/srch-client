function display_game_api_menu_inner() {
  let output = back_header("Game Search") +
               `<div style="text-align:center">` +
                 `<p style="word-wrap:break-word">` +
                   `Get information about a specific game. Its full-game categories and individual levels will be available.` +
                 `</p>` +
                 `<p>Enter either a game abbreviation (such as <code>mc</code>) or a game ID (such as <code>j1npme6p</code>):</p>` +
                 `<input type="text" id="abbreviation" size="30" class="${mode}"> ` +
                 `<button onclick="load_game_profile(document.getElementById('abbreviation').value)" class="${mode}">Search</button>` +
               `</div>`;
 disp(output);
}

function display_game_api_menu() {
  push_stack(display_game_api_menu_inner);
}