function load_game_levels_inner(gameID) {
  let xhr = new XMLHttpRequest();
  try {
    var gameObj = json_from_src(`/games/${gameID}?embed=levels`, xhr);
  }
  catch (e) {
    let output = back_header(`Levels for ${escape(gameID)}`) + 
                 `<p style="text-align:center">Could not find game ${escape(gameID)}.</p>`;
    disp(output);
    return;
  }
  let gameName = escape(gameObj.data.names.international);
  let levelButtons = gameObj.data.levels.data.map((level, i) => `<tr>` +
                                                  `<td style="text-align:right">${i + 1}.` +
                                                  `<td>` +
                                                    `<button onclick="load_level_profile('${level.id}')" class="link ${mode}">` +
                                                    escape(level.name) +
                                                    `</button>` +
                                                  `</td>` +
                                                `</tr>`);
  if (levelButtons.length > 0) {
    var output = back_header(`Levels for ${gameName}`) + 
                 `<p style="text-align:center">` +
                   `${gameName} has ${levelButtons.length} individual level${(levelButtons.length != 1) ? "s" : ""}.` +
                 `</p>` +
                 `<table class="center">` +
                   levelButtons.join("") +
                 `</table>`;
  } else {
    var output = back_header(`Levels for ${gameName}`) + 
                 `<p style="text-align:center">${gameName} does not have any individual levels.`;
  }
  disp(output);
}

function load_game_levels(gameID) {
  push_stack(function() {load_game_levels_inner(gameID);});
}