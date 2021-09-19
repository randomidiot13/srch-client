async function load_level_runs_inner(levelID) {
  disp(`<p style="text-align:center">Fetching level...</p>`);
  levelObj = await json_from_src_await(`/levels/${levelID}?embed=categories,variables`);
  let levelName = levelObj.data.name;
  disp(`<p style="text-align:center">Fetching runs...</p>`);
  levelRuns = await continual_data_await_fast_reverse(`/runs?level=${levelID}&embed=game,category.variables,players,platform`, 5000);
  if (levelRuns.length === 0) {
    let output = back_header(`Runs in ${escape(await levelName)}`) + 
                 `<p style="text-align:center">${escape(await levelName)} does not have any runs.</p>`;
    disp(await output);
  } else {
    levelRuns.sort((a, b) => compare(a.submitted, b.submitted, true));
    levelRuns.sort((a, b) => compare(a.date, b.date, true));
    levelPBs = {};
    for (let run of levelRuns) {
      run.level = levelObj;
      let runFullCat = full_category(run);
      let playerHash = player_hash(run);
      let timeArr = ((run.status.status == "verified") ? [run.times.primary_t, run.id] : [Infinity, null]);
      if (!(runFullCat in levelPBs)) {
        levelPBs[runFullCat] = {};
        levelPBs[runFullCat][playerHash] = timeArr;
      } else if (!(playerHash in levelPBs[runFullCat])) {
        levelPBs[runFullCat][playerHash] = timeArr;
      } else if (timeArr[0] < levelPBs[runFullCat][playerHash][0]) {
        levelPBs[runFullCat][playerHash] = timeArr;
      }
    }
    let categoryOptions = `<option value="All Categories">All Categories</option>`;
    for (let cat of levelObj.data.categories.data)
      categoryOptions += `<option value="${cat.id}">${cat.name}</option>`;
    let subcats = levelObj.data.variables.data.filter(x => x["is-subcategory"]);
    subcatIDs = subcats.map(x => x.id);
    let subcatOptions = "";
    for (let subcat of subcats) {
      let values = `<option value="Any">Any</option>`;
      for (let val in subcat.values.values)
        values += `<option value="${val}">${subcat.values.values[val].label}</option>`;
      let row = `<tr>` +
                  `<td style="text-align:right">` +
                    `<b>${subcat.name}</b>` +
                  `</td>` +
                  `<td style="text-align:left">` +
                    `<select id="level-runs-${subcat.id}-select" class="${mode}">` +
                      values +
                    `</select>` +
                  `</td>` +
                `</tr>`;
      subcatOptions += row;
    }
    let statusOptions = ["Verified/Pending/Rejected", "Verified/Pending", "Verified/Rejected", "Verified", "Pending/Rejected", "Pending", "Rejected"
                        ].map(x => `<option value="${x}">${x}</option>`).join("");
    let obsoleteOptions = ["Shown", "Hidden"].map(x => `<option value="${x}">${x}</option>`).join("");
    let sortOptions = ["Date (oldest first)", "Date (newest first)", "Time (increasing)", "Time (decreasing)", "Category (A-Z)", "Category (Z-A)",
                       "Platform (A-Z)", "Platform (Z-A)", "Status (verified first)", "Status (rejected first)"
                      ].map(x => `<option value="${x}">${x}</option>`).join("");
    let output = back_header(`Runs in ${escape(levelName)}`) +
                 `<p style="text-align:center" id="level-run-count"></p>` +
                 `<table class="center" id="level-runs-filter">` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Category</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="level-runs-cat-select" class="${mode}">` +
                         categoryOptions +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   subcatOptions +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Status</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="level-runs-status-select" class="${mode}">` +
                         (await statusOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Obsoleted Runs</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="level-runs-obsolete-select" class="${mode}">` +
                         (await obsoleteOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Sort by</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="level-runs-sort-select" class="${mode}">` +
                         (await sortOptions) + 
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Country (ISO 3166-2)</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<input id="level-runs-country" size="2" class="${mode}">` +
                     `</td>` +
                   `</tr>` +
                 `</table>` +
                 `<p style="text-align:center">` +
                   `<button onclick="edit_working_level_runs()" class="${mode}">Apply</button>` +
                 `</p>` +
                 `<table id="level-runs-table" class="center" style="text-align:center;border-spacing:20px 0"></table>` +
                 `<div id="runs-popup" class="popup-bg"></div>`;
    disp(await output);
    edit_working_level_runs();
  }
}

function load_level_runs(levelID) {
  push_stack(async function() {await load_level_runs_inner(levelID);});
}

function edit_working_level_runs() {
  let selectedCategory = document.getElementById("level-runs-cat-select").value;
  
  let selectedSubcats = subcatIDs.map(x => [x, document.getElementById(`level-runs-${x}-select`).value]);

  let selectedStatus = document.getElementById("level-runs-status-select").value;
  let statusArray = [];
  if (selectedStatus.includes("Verified"))
    statusArray.push("verified");
  if (selectedStatus.includes("Pending"))
    statusArray.push("new");
  if (selectedStatus.includes("Rejected"))
    statusArray.push("rejected");

  let selectedObsolete = document.getElementById("level-runs-obsolete-select").value == "Shown";
  
  let selectedCountry = document.getElementById("level-runs-country").value.trim().toLowerCase();

  workingLevelRuns = levelRuns.filter(x => (((selectedCategory == "All Categories") || (x.category.data.id == selectedCategory))
                                        && selectedSubcats.every(y => ((y[1] == "Any") || (x.values[y[0]] == y[1])))
                                        && statusArray.includes(x.status.status) && (selectedObsolete
                                        || (levelPBs[full_category(x)][player_hash(x)][0] > x.times.primary_t)
                                        || (levelPBs[full_category(x)][player_hash(x)][1] == x.id))
                                        && (selectedCountry === "") || x.players.data.some(p => get_country(p) == selectedCountry)));

  let selectedSort = document.getElementById("level-runs-sort-select").value;
  if (selectedSort == "Date (newest first)") {
    workingLevelRuns.reverse();
  } else if (selectedSort == "Time (increasing)") {
    workingLevelRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t, true));
  } else if (selectedSort == "Time (decreasing)") {
    workingLevelRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t));
  } else if (selectedSort == "Category (A-Z)") {
    workingLevelRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b)), true));
  } else if (selectedSort == "Category (Z-A)") {
    workingLevelRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b))));
  } else if (selectedSort == "Platform (A-Z)") {
    workingLevelRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name)), true));
  } else if (selectedSort == "Platform (Z-A)") {
    workingLevelRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name))));
  } else if (selectedSort == "Status (verified first)") {
    workingLevelRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b)));
  } else if (selectedSort == "Status (rejected first)") {
    workingLevelRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b), true));
  }
  
  let runCount = (levelRuns.length >= 20000) ? `<abbr title="Limit of API. Additional runs may exist.">${catRuns.length}</abbr>` : `${levelRuns.length}`;

  let title = `${escape(levelObj.data.name)} has ${runCount} run${(levelRuns.length != 1) ? "s" : ""}` +
              ((levelRuns.length != workingLevelRuns.length) ? `, ${workingLevelRuns.length} of which ` +
                                                               `${(workingLevelRuns.length == 1) ? "is" : "are"} shown below.` : ".");
  document.getElementById("level-run-count").innerHTML = title;
    
  let table = workingLevelRuns.map((x, i) => `<tr>` +
                                              `<td style="max-width:50px">` +
                                                `${i + 1}.` +
                                              `</td>` +
                                               `<td style="max-width:300px">` +
                                                 full_category(x) +
                                               `</td>` +
                                               `<td style="max-width:250px">` +
                                                 x.players.data.map(p => get_display_name(p)).join(", ") +
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
                                                 `<button class="link ${mode}" onclick="display_runs_popup(workingLevelRuns[${i}])">Details</button>` +
                                               `</td>` +
                                               `<td style="max-width:50px">` +
                                                 `<a href="${x.weblink}" target="_blank">SRC</a>` +
                                               `</td>` +
                                             `</tr>`).join("");
  document.getElementById("level-runs-table").innerHTML = table;
}
