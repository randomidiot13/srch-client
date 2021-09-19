function load_game_categories_inner(gameID) {
  let xhr = new XMLHttpRequest();
  try {
    var gameObj = json_from_src(`/games/${gameID}?embed=categories`, xhr);
  }
  catch (e) {
    let output = back_header(`Categories for ${escape(gameID)}`) + 
                 `<p style="text-align:center">Could not find game ${escape(gameID)}.</p>`;
    disp(output);
    return;
  }
  let gameName = escape(gameObj.data.names.international);
  let fullGameCats = gameObj.data.categories.data.filter(x => (x.type == "per-game"));
  let catButtons = fullGameCats.map((cat, i) => `<tr>` +
                                                  `<td style="text-align:right">${i + 1}.</td>` +
                                                  `<td>` +
                                                    `<button onclick="load_category_profile('${cat.id}')" class="link ${mode}">` +
                                                    escape(cat.name) +
                                                    `</button>` +
                                                  `</td>` +
                                                `</tr>`);
  if (catButtons.length > 0) {
    var output = back_header(`Categories for ${gameName}`) + 
                 `<p style="text-align:center">` +
                   `${gameName} has ${catButtons.length} full-game categor${(catButtons.length != 1) ? "ies" : "y"}.` +
                 `</p>` +
                 `<table class="center">` +
                   catButtons.join("") +
                 `</table>`;
  } else {
    var output = back_header(`Categories for ${gameName}`) + 
                 `<p style="text-align:center">${gameName} does not have any full-game categories.`;
  }
  disp(output);
}

function load_game_categories(gameID) {
  push_stack(function() {load_game_categories_inner(gameID);});
}