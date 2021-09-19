async function load_user_runs_inner(userID) {
  disp(`<p style="text-align:center">Fetching user...</p>`);
  try {
    userObj = await json_from_src_await(`/users/${userID}`);
  }
  catch (e) {
    let output = back_header(`Runs by ${escape(userID)}`) + 
                 `<p style="text-align:center">Could not find user ${escape(userID)}.</p>`;
    disp(await output);
    return;
  }
  let userName = userObj.data.names.international;
  disp(`<p style="text-align:center">Fetching runs...</p>`);
  try {
    userRuns = await continual_data_await_fast_reverse(`/runs?user=${userID}&embed=game,category.variables,level,players,platform`, 5000);
  }
  catch (e) {
    let output = back_header(`Runs by ${escape(await userName)}`) +
                 `<p style="text-align:center">An error occurred while fetching ${escape(await userName)}'s runs.</p>`;
    disp(await output);
    return;
  }
  if (await userRuns.length === 0) {
    let output = back_header(`Runs by ${escape(await userName)}`) + 
                 `<p style="text-align:center">${escape(await userName)} does not have any runs.</p>`;
    disp(await output);
  } else {
    userRuns.sort((a, b) => compare(a.submitted, b.submitted, true));
    userRuns.sort((a, b) => compare(a.date, b.date, true));
    userPBs = {};
    for (let run of userRuns) {
      let runGame = run.game.data.names.international;
      let runFullCat = full_category(run);
      let timeArr = ((run.status.status == "verified") ? [run.times.primary_t, run.id] : [Infinity, null]);
      if (!(runGame in userPBs)) {
        userPBs[runGame] = {};
        userPBs[runGame][runFullCat] = timeArr;
      } else if (!(runFullCat in userPBs[runGame])) {
        userPBs[runGame][runFullCat] = timeArr;
      } else if (timeArr[0] < userPBs[runGame][runFullCat][0]) {
        userPBs[runGame][runFullCat] = [run.times.primary_t, run.id];
      }
    }
    userRuns.reverse();
    let allGames = Object.keys(userPBs);
    allGames.sort((a, b) => compare(lowercase(a), lowercase(b), true));
    allGames.unshift("All Games");
    let gameOptions = allGames.map(x => `<option value="${x}">${x}</option>`).join("");
    let statusOptions = ["Verified/Pending/Rejected", "Verified/Pending", "Verified/Rejected", "Verified", "Pending/Rejected", "Pending", "Rejected"
                        ].map(x => `<option value="${x}">${x}</option>`).join("");
    let obsoleteOptions = ["Shown", "Hidden"].map(x => `<option value="${x}">${x}</option>`).join("");
    let sortOptions = ["Date (newest first)", "Date (oldest first)", "Time (increasing)", "Time (decreasing)", "Game (A-Z)", "Game (Z-A)",
                       "Category (A-Z)", "Category (Z-A)", "Platform (A-Z)", "Platform (Z-A)", "Status (verified first)", "Status (rejected first)"
                      ].map(x => `<option value="${x}">${x}</option>`).join("");
    let output = back_header(`Runs by ${escape(userName)}`) +
                 `<p style="text-align:center" id="user-run-count"></p>` +
                 `<table class="center" id="user-runs-filter">` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Game</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="user-runs-game-select" class="${mode}">` +
                         (await gameOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Status</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="user-runs-status-select" class="${mode}">` +
                         (await statusOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Obsoleted Runs</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="user-runs-obsolete-select" class="${mode}">` +
                         (await obsoleteOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Sort by</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="user-runs-sort-select" class="${mode}">` +
                         (await sortOptions) + 
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                 `</table>` +
                 `<p style="text-align:center">` +
                   `<button onclick="edit_working_user_runs()" class="${mode}">Apply</button>` +
                 `</p>` +
                 `<table id="user-runs-table" class="center" style="text-align:center;border-spacing:20px 0"></table>` +
                 `<div id="runs-popup" class="popup-bg"></div>`;
    disp(await output);
    edit_working_user_runs();
  }
}

function load_user_runs(userID) {
  push_stack(async function() {await load_user_runs_inner(userID);});
}

function edit_working_user_runs() {
  let selectedGame = document.getElementById("user-runs-game-select").value;

  let selectedStatus = document.getElementById("user-runs-status-select").value;
  let statusArray = [];
  if (selectedStatus.includes("Verified"))
    statusArray.push("verified");
  if (selectedStatus.includes("Pending"))
    statusArray.push("new");
  if (selectedStatus.includes("Rejected"))
    statusArray.push("rejected");

  let selectedObsolete = document.getElementById("user-runs-obsolete-select").value == "Shown";

  workingUserRuns = userRuns.filter(x => ((selectedGame == "All Games") || (x.game.data.names.international == selectedGame))
                                      && statusArray.includes(x.status.status) && (selectedObsolete
                                      || (userPBs[x.game.data.names.international][full_category(x)][0] > x.times.primary_t)
                                      || (userPBs[x.game.data.names.international][full_category(x)][1] == x.id)));

  let selectedSort = document.getElementById("user-runs-sort-select").value;
  if (selectedSort == "Date (oldest first)") {
    workingUserRuns.reverse();
  } else if (selectedSort == "Time (increasing)") {
    workingUserRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t, true));
  } else if (selectedSort == "Time (decreasing)") {
    workingUserRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t));
  } else if (selectedSort == "Game (A-Z)") {
    workingUserRuns.sort((a, b) => compare(lowercase(a.game.data.names.international), lowercase(b.game.data.names.international), true));
  } else if (selectedSort == "Game (Z-A)") {
    workingUserRuns.sort((a, b) => compare(lowercase(a.game.data.names.international), lowercase(b.game.data.names.international)));
  } else if (selectedSort == "Category (A-Z)") {
    workingUserRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b)), true));
  } else if (selectedSort == "Category (Z-A)") {
    workingUserRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b))));
  } else if (selectedSort == "Platform (A-Z)") {
    workingUserRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name)), true));
  } else if (selectedSort == "Platform (Z-A)") {
    workingUserRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name))));
  } else if (selectedSort == "Status (verified first)") {
    workingUserRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b)));
  } else if (selectedSort == "Status (rejected first)") {
    workingUserRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b), true));
  }
  
  let runCount = (userRuns.length >= 20000) ? `<abbr title="Limit of API. Additional runs may exist.">${catRuns.length}</abbr>` : `${userRuns.length}`;

  let title = `${escape(userObj.data.names.international)} has ${runCount} run${(userRuns.length != 1) ? "s" : ""}` +
              ((userRuns.length != workingUserRuns.length) ? `, ${workingUserRuns.length} of which ` +
                                                             `${(workingUserRuns.length == 1) ? "is" : "are"} shown below.` : ".");
  document.getElementById("user-run-count").innerHTML = title;
    
  let table = workingUserRuns.map((x, i) => `<tr>` +
                                              `<td style="max-width:50px">` +
                                                `${i + 1}.` +
                                              `</td>` +
                                              `<td style="max-width:300px">` +
                                                `<button class="xlink ${mode}" onclick="load_game_profile('${x.game.data.id}')">` +
                                                  escape(x.game.data.names.international) +
                                                `</button>` +
                                              `</td>` +
                                              `<td style="max-width:300px">` +
                                                full_category(x) +
                                                ((x.players.data.length > 1) ? ("<br>with " + 
                                                x.players.data.filter(p => (!("id" in p) || (p.id != userObj.data.id)))
                                                                 .map(p => get_display_name(p)).join(", ")) : "") +
                                              `</td>` +
                                              `<td style="max-width:100px">` +
                                                escape(str_time(x.times.primary_t)) +
                                              `</td>` +
                                              `<td style="max-width:10px">` +
                                                status_mark(x) +
                                              `</td>` +
                                              `<td style="max-width:100px">` +
                                                `<span title="${escape(x.platform.data.name) + (x.system.emulated ? ' (emulator)' : '')}">` +
                                                  escape(shorten(x.platform.data.name)) +
                                                  (x.system.emulated ? " <small>[EMU]</small>" : "") +
                                                `</span>` +
                                              `</td>` +
                                              `<td style="max-width:100px">` +
                                                escape(x.date) +
                                              `</td>` +
                                              `<td style="max-width:75px">` +
                                                `<button class="link ${mode}" onclick="display_runs_popup(workingUserRuns[${i}])">Details</button>` +
                                              `</td>` +
                                              `<td style="max-width:50px">` +
                                                `<a href="${x.weblink}" target="_blank">SRC</a>` +
                                              `</td>` +
                                            `</tr>`).join("");
  document.getElementById("user-runs-table").innerHTML = table;
}
