function load_level_profile_inner(levelID) {
  let xhr = new XMLHttpRequest();
  try {
    var levelObj = json_from_src(`/levels/${levelID}?embed=categories,variables`, xhr);
  }
  catch (e) {
    let output = back_header(`Level: ${escape(levelID)}`) + 
                 `<p style="text-align:center">Could not find level ${escape(levelID)}.</p>`;
    disp(output);
    return;
  }
  let levelName = levelObj.data.name;
  let linkMap = levelObj.data.links.reduce((newObj, x) => ({...newObj, [x.rel]: x.uri}), {});
  let gameObj = json_from_url(linkMap.game, xhr);
  let gameName = gameObj.data.names.international;
  let levelLink = levelObj.data.weblink;
  let cats = levelObj.data.categories.data.map(x => x.name);
  let subcats = levelObj.data.variables.data.filter(x => x["is-subcategory"]);
  let output = back_header(`Level: ${escape(levelName)}`) +
               `<table class="center">` +
                 `<tr>` +
                   `<td style="white-space:pre-wrap;max-width:700px">` +
                     `<b>Name:</b> ${escape(levelName)}<br>` +
                     `<b>Level ID:</b> ${escape(levelID)}<br>` +
                     `<b>Game:</b> ${escape(gameName)}<br>` +
                     `<b>SRC Link:</b> <a href="${levelLink}" target="_blank">${levelLink}</a><br>` +
                     `<b>Categories:</b> ${(cats.length > 0) ? cats.join(", ") : "null"}<br>` +
                     `<b>Subcategories:</b>` +
                     ((subcats.length === 0) ? " null" : ("<br>" + subcats.map(x => `&bull; ${x.name}<br><i>Values:</i> ` +
                      Object.keys(x.values.values).map(y => x.values.values[y].label + ((y === x.values.default) ? " (default)" : ""))
                                                 .join(", ")).join("<br><br>"))) +
                   `</td>` +
                 `</tr>` +
                 `<tr>` +
                   `<td style="white-space:pre-wrap">` +
                     `<b>Further Links:</b><br>` +
                     `&bull; <button onclick="load_level_runs('${levelObj.data.id}')" class="link ${mode}">Runs</button>` +
                   `</td>` +
                 `</tr>` +
               `</table>`;
  disp(output);
}

function load_level_profile(levelID) {
  push_stack(function() {load_level_profile_inner(levelID);});
}