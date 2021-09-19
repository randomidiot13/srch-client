async function load_category_runs_inner(catID) {
  disp(`<p style="text-align:center">Fetching category...</p>`);
  try {
    catObj = await json_from_src_await(`/categories/${catID}?embed=game,variables`);
  }
  catch (e) {
    let output = back_header(`Runs in ${escape(catID)}`) + 
                 `<p style="text-align:center">Could not find category ${escape(catID)}.</p>`;
    disp(await output);
    return;
  }
  let catName = catObj.data.name;
  disp(`<p style="text-align:center">Fetching runs...</p>`);
  try {
    catRuns = await continual_data_await_fast_reverse(`/runs?category=${catID}&embed=players,platform`, 5000);
  }
  catch (e) {
    let output = back_header(`Runs in ${escape(await catName)}`) + 
                 `<p style="text-align:center">An error occurred while fetching ${escape(await catName)}'s runs.</p>`;
    disp(await output);
    return;
  }
  if (catRuns.length === 0) {
    let output = back_header(`Runs in ${escape(await catName)}`) + 
                 `<p style="text-align:center">${escape(await catName)} does not have any runs.</p>`;
    disp(await output);
  } else {
    catRuns.sort((a, b) => compare(a.submitted, b.submitted, true));
    catRuns.sort((a, b) => compare(a.date, b.date, true));
    catPBs = {};
    for (let run of catRuns) {
      run.game = catObj.data.game;
      run.category = catObj;
      let runFullCat = full_category(run);
      let playerHash = player_hash(run);
      let timeArr = ((run.status.status == "verified") ? [run.times.primary_t, run.id] : [Infinity, null]);
      if (!(runFullCat in catPBs)) {
        catPBs[runFullCat] = {};
        catPBs[runFullCat][playerHash] = timeArr;
      } else if (!(playerHash in catPBs[runFullCat])) {
        catPBs[runFullCat][playerHash] = timeArr;
      } else if (timeArr[0] < catPBs[runFullCat][playerHash][0]) {
        catPBs[runFullCat][playerHash] = timeArr;
      }
    }
    let subcats = catObj.data.variables.data.filter(x => x["is-subcategory"]);
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
                    `<select id="cat-runs-${subcat.id}-select" class="${mode}">` +
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
    let output = back_header(`Runs in ${escape(catName)}`) +
                 `<p style="text-align:center" id="cat-run-count"></p>` +
                 `<table class="center" id="cat-runs-filter">` +
                   subcatOptions +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Status</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="cat-runs-status-select" class="${mode}">` +
                         (await statusOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Obsoleted Runs</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="cat-runs-obsolete-select" class="${mode}">` +
                         (await obsoleteOptions) +
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Sort by</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<select id="cat-runs-sort-select" class="${mode}">` +
                         (await sortOptions) + 
                       `</select>` +
                     `</td>` +
                   `</tr>` +
                   `<tr>` +
                     `<td style="text-align:right">` +
                       `<b>Country (ISO 3166-2)</b>` +
                     `</td>` +
                     `<td style="text-align:left">` +
                       `<input id="cat-runs-country" size="2" class="${mode}">` +
                     `</td>` +
                   `</tr>` +
                 `</table>` +
                 `<p style="text-align:center">` +
                   `<button onclick="edit_working_cat_runs()" class="${mode}">Apply</button>` +
                 `</p>` +
                 `<table id="cat-runs-table" class="center" style="text-align:center;border-spacing:20px 0"></table>` +
                 `<div id="runs-popup" class="popup-bg"></div>`;
    disp(await output);
    edit_working_cat_runs();
  }
}

function load_category_runs(catID) {
  push_stack(async function() {await load_category_runs_inner(catID);});
}

function edit_working_cat_runs() {
  let selectedSubcats = subcatIDs.map(x => [x, document.getElementById(`cat-runs-${x}-select`).value]);

  let selectedStatus = document.getElementById("cat-runs-status-select").value;
  let statusArray = [];
  if (selectedStatus.includes("Verified"))
    statusArray.push("verified");
  if (selectedStatus.includes("Pending"))
    statusArray.push("new");
  if (selectedStatus.includes("Rejected"))
    statusArray.push("rejected");

  let selectedObsolete = document.getElementById("cat-runs-obsolete-select").value == "Shown";
  
  let selectedCountry = document.getElementById("cat-runs-country").value.trim().toLowerCase();

  workingCatRuns = catRuns.filter(x => (selectedSubcats.every(y => ((y[1] == "Any") || (x.values[y[0]] == y[1])))
                                    && statusArray.includes(x.status.status) && (selectedObsolete
                                    || (catPBs[full_category(x)][player_hash(x)][0] > x.times.primary_t)
                                    || (catPBs[full_category(x)][player_hash(x)][1] == x.id))
                                    && ((selectedCountry === "") || x.players.data.some(p => get_country(p) == selectedCountry))));

  let selectedSort = document.getElementById("cat-runs-sort-select").value;
  if (selectedSort == "Date (newest first)") {
    workingCatRuns.reverse();
  } else if (selectedSort == "Time (increasing)") {
    workingCatRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t, true));
  } else if (selectedSort == "Time (decreasing)") {
    workingCatRuns.sort((a, b) => compare(a.times.primary_t, b.times.primary_t));
  } else if (selectedSort == "Category (A-Z)") {
    workingCatRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b)), true));
  } else if (selectedSort == "Category (Z-A)") {
    workingCatRuns.sort((a, b) => compare(lowercase(full_category(a)), lowercase(full_category(b))));
  } else if (selectedSort == "Platform (A-Z)") {
    workingCatRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name)), true));
  } else if (selectedSort == "Platform (Z-A)") {
    workingCatRuns.sort((a, b) => compare(lowercase(shorten(a.platform.data.name)), lowercase(shorten(b.platform.data.name))));
  } else if (selectedSort == "Status (verified first)") {
    workingCatRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b)));
  } else if (selectedSort == "Status (rejected first)") {
    workingCatRuns.sort((a, b) => compare(status_sorter(a), status_sorter(b), true));
  }
  
  let runCount = (catRuns.length >= 20000) ? `<abbr title="Limit of API. Additional runs may exist.">${catRuns.length}</abbr>` : `${catRuns.length}`;

  let title = `${escape(catObj.data.name)} has ${runCount} run${(catRuns.length != 1) ? "s" : ""}` +
              ((catRuns.length != workingCatRuns.length) ? `, ${workingCatRuns.length} of which ` +
                                                           `${(workingCatRuns.length == 1) ? "is" : "are"} shown below.` : ".");
  document.getElementById("cat-run-count").innerHTML = title;
    
  let table = workingCatRuns.map((x, i) => `<tr>` +
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
                                               `<button class="link ${mode}" onclick="display_runs_popup(workingCatRuns[${i}])">Details</button>` +
                                             `</td>` +
                                             `<td style="max-width:50px">` +
                                               `<a href="${x.weblink}" target="_blank">SRC</a>` +
                                             `</td>` +
                                           `</tr>`).join("");
  document.getElementById("cat-runs-table").innerHTML = table;
}
