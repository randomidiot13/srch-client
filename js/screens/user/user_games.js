function load_user_games_inner(userID) {
  let xhr = new XMLHttpRequest();
  try {
    var userObj = json_from_src(`/users/${userID}`, xhr);
  }
  catch (e) {
    let output = back_header(`Games moderated by ${escape(userID)}`) + 
                 `<p style="text-align:center">Could not find user ${escape(userID)}.</p>`;
    disp(output);
    return;
  }
  let userName = escape(userObj.data.names.international);
  try {
    var userGames = continual_data(`/games?moderator=${userID}`, xhr);
  }
  catch (e) {
    let output = back_header(`Games moderated by ${userName}`) +
                 `<p style="text-align:center">An error occured while fetching ${userName}'s games.</p>`;
    disp(output);
    return;
  }
  let gameButtons = userGames.map((game, i) => `<tr>` +
                                                 `<td style="text-align:right">${i + 1}.` +
                                                 `<td>` +
                                                   `<button onclick="load_game_profile('${game.id}')" class="link ${mode}">` +
                                                   escape(game.names.international) +
                                                   `</button>` +
                                                 `</td>` +
                                               `</tr>`);
  if (gameButtons.length > 0) {
    var output = back_header(`Games moderated by ${userName}`) + 
                 `<p style="text-align:center">` +
                   `${userName} moderates ${gameButtons.length} game${(gameButtons.length != 1) ? "s" : ""}.` +
                 `</p>` +
                 `<table class="center">` +
                   gameButtons.join("") +
                 `</table>`;
  } else {
    var output = back_header(`Games moderated by ${userName}`) + 
                 `<p style="text-align:center">${userName} does not moderate any games.`;
  }
  disp(output);
}

function load_user_games(userID) {
  push_stack(function() {load_user_games_inner(userID);});
}
