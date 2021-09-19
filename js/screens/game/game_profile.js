const TIMING_MAP = {"realtime": "real time",
                    "realtime_noloads": "real time without loads",
                    "ingame": "in-game time"};

function load_game_profile_inner(abbrev) {
  let xhr = new XMLHttpRequest();
  try {
    var gameObj = json_from_src(`/games/${abbrev}?embed=platforms,moderators`, xhr);
  }
  catch (e) {
    let output = back_header(`Game: ${escape(abbrev)}`) + 
                 `<p style="text-align:center">Could not find game ${escape(abbrev)}.</p>`;
    disp(output);
    return;
  }
  let gameID = gameObj.data.id;
  let gameAbbrev = gameObj.data.abbreviation;
  let gameName = gameObj.data.names.international;
  let gamePFP = `<img src="https://www.speedrun.com/gameasset/${gameID}/cover" width="128" ` +
                `onerror="this.src = 'https://www.speedrun.com/themes/404/cover-128.png'">`;
  let gameRelease = gameObj.data["release-date"];
  let gameCreation = (gameObj.data.created !== null) ? `<b>Added:</b> ${escape(iso_to_words(gameObj.data.created))}<br>` : "";
  let gameRuleObj = gameObj.data.ruleset;
  let gameRuleset = `${gameRuleObj["show-milliseconds"] ? "Show" : "No"} milliseconds, verification` +
                    `${gameRuleObj["require-verification"] ? "" : " not"} required, video${gameRuleObj["require-video"] ? "" : " not"} required, ` +
                    `emulators${gameRuleObj["emulators-allowed"] ? "" : " not"} allowed`;
  let gameTiming = gameRuleObj["run-times"].map(x => TIMING_MAP[x] + ((x == gameRuleObj["default-time"]) ? " (primary)" : "")).join(", ");
  gameTiming = gameTiming[0].toUpperCase() + gameTiming.slice(1);
  let gamePlatforms = (gameObj.data.platforms.data.length !== 0) ? `<b>Platforms:</b> ` +
                      `${escape(gameObj.data.platforms.data.map(x => shorten(x.name)).join(", "))}<br>` : "";
  let gameModerators = gameObj.data.moderators.data.map(x => get_display_name(x, false, true)).join(", ");
  let output = back_header(`Game: ${escape(gameName)}`) + 
               `<table class="center">` +
                 `<tr>` +
                   `<td style="text-align:center">` +
                     gamePFP +
                   `</td>` +
                   `<td></td>` +
                   `<td style="word-wrap:break-word;max-width:700px">` +
                     `<b>Name:</b> ${escape(gameName)}<br>` +
                     `<b>Game ID:</b> ${escape(gameID)}<br>` +
                     `<b>Abbreviation:</b> ${escape(gameAbbrev)}<br>` +
                     `<b>Release Date:</b> ${escape(gameRelease)}<br>` +
                     gameCreation +
                     `<b>Ruleset:</b> ${escape(gameRuleset)}<br>` +
                     `<b>Timing methods:</b> ${escape(gameTiming)}<br>` +
                     gamePlatforms +
                     `<b>Moderators:</b> ${gameModerators}` +
                   `</td>` +
                 `</tr>` +
                 `<tr>` +
                   `<td style="text-align:center">` +
                     `<a href="${gameObj.data.weblink}" target="_blank">SRC Link</a>` +
                   `</td>` +
                   `<td></td>` +
                   `<td>` +
                     `<b>Further Links:</b><br>` +
                     `&bull; <button onclick="load_game_categories('${gameID}')" class="link ${mode}">Categories</button><br>` +
                     `&bull; <button onclick="load_game_levels('${gameID}')" class="link ${mode}">Levels</button>` +
                   `</td>` +
                 `</tr>` +
               `</table>`;
  disp(output);
}

function load_game_profile(abbrevOrID) {
  push_stack(function() {load_game_profile_inner(abbrevOrID);});
}