function load_category_profile_inner(catID) {
  let xhr = new XMLHttpRequest();
  try {
    var catObj = json_from_src(`/categories/${catID}?embed=game,variables`, xhr);
  }
  catch (e) {
    let output = back_header(`Category: ${escape(catID)}`) + 
                 `<p style="text-align:center">Could not find category ${escape(catID)}.</p>`;
    disp(output);
    return;
  }
  let catName = catObj.data.name;
  let gameName = catObj.data.game.data.names.international;
  let catLink = catObj.data.weblink;
  if (catObj.data.players.type == "exactly")
    var catPlayers = `Exactly ${catObj.data.players.value}`;
  else if (catObj.data.players.type == "up-to")
    var catPlayers = `Up to ${catObj.data.players.value}`;
  else
    var catPlayers = "?";
  let subcats = catObj.data.variables.data.filter(x => x["is-subcategory"]);
  let output = back_header(`Category: ${escape(catName)}`) +
               `<table class="center">` +
                 `<tr>` +
                   `<td style="word-wrap:break-word;max-width:700px">` +
                     `<b>Name:</b> ${escape(catName)}<br>` +
                     `<b>Category ID:</b> ${escape(catID)}<br>` +
                     `<b>Game:</b> ${escape(gameName)}<br>` +
                     `<b>SRC Link:</b> <a href="${catLink}" target="_blank">${catLink}</a><br>` +
                     `<b>Player Count:</b> ${escape(catPlayers)}<br>` +
                     `<b>Subcategories:</b>` +
                     ((subcats.length === 0) ? " null" : ("<br>" + subcats.map(x => `&bull; ${x.name}<br><i>Values:</i> ` +
                      Object.keys(x.values.values).map(y => x.values.values[y].label + ((y === x.values.default) ? " (default)" : ""))
                                                 .join(", ")).join("<br><br>"))) +
                   `</td>` +
                 `</tr>` +
                 `<tr>` +
                   `<td style="word-wrap:break-word">` +
                     `<b>Further Links:</b><br>` +
                     `&bull; <button onclick="load_category_runs('${catID}')" class="link ${mode}">Runs</button>` +
                   `</td>` +
                 `</tr>` +
               `</table>`;
  disp(output);
}

function load_category_profile(catID) {
  push_stack(function() {load_category_profile_inner(catID);});
}