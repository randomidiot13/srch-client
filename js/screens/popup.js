function display_runs_popup(runObj) {
  let xhr = new XMLHttpRequest();
  let var_map = runObj.category.data.variables.data.reduce((newObj, x) => ({...newObj, [x.id]: x}), {});
  let var_str = Object.keys(runObj.values).filter(x => (x in var_map && !var_map[x]["is-subcategory"]))
                                             .map(x => `&bull; ${escape(var_map[x].name)}: ` +
                                                  escape(var_map[x].values.values[runObj.values[x]].label)).join("<br>");
  if ("examiner" in runObj.status) {
    if (runObj.status.examiner == null)
      var examiner = null;
    else {
      let examinerObj = json_from_src(`/users/${runObj.status.examiner}`, xhr);
      if (xhr.status >= 400)
        var examiner = null;
      else
        var examiner = get_display_name(examinerObj.data, false, true);
    }
  }
  let popup = `<div class="popup ${mode}">` +
                `<span class="close" id="runs-popup-close">&times;</span>` +
                `<b>Run ID:</b> ${runObj.id}<br>` +
                `<b>SRC Link:</b> <a href="${runObj.weblink}" target="_blank">${runObj.weblink}</a><br>` +
                `<b>Game:</b> ` +
                `<button class="xlink ${mode}" onclick="load_game_profile('${runObj.game.data.id}')">` +
                  escape(runObj.game.data.names.international) +
                `</button><br>` +
                `<b>Category:</b> ${escape(full_category(runObj))}<br>` +
                `<b>Players:</b> ${runObj.players.data.map(p => get_display_name(p)).join(", ")}<br>` +
                `<b>Primary time:</b> ${escape(str_time(runObj.times.primary_t))}<br>` +
                ((runObj.times.realtime !== null) ? `<b>Real time:</b> ${escape(str_time(runObj.times.realtime_t))}<br>` : "") +
                ((runObj.times.realtime_noloads !== null) ? `<b>Real time without loads:</b> ` +
                                                            `${escape(str_time(runObj.times.realtime_noloads_t))}<br>` : "") +
                ((runObj.times.ingame !== null) ? `<b>In-game time:</b> ${escape(str_time(runObj.times.ingame_t))}<br>` : "") +
                `<b>Status:</b> ${status_mark(runObj, true)}<br>` +
                `<b>Videos:</b>` +
                ((runObj.videos === null) ? " null" : (("text" in runObj.videos) ? (" " + escape(runObj.videos.text)) :
                ("<br>" + runObj.videos.links.map(x => `&bull; <a href="${escape(x.uri)}" target="_blank">${escape(x.uri)}</a>`).join("<br>")))) +
                `<br><b>Comment:</b>` +
                ((runObj.comment === null) ? " null" : ("<br>" + escape(runObj.comment).replaceAll("\r\n", "<br>"))) +
                `<br><b>Variables:</b>` +
                (var_str ? ("<br>" + var_str) : " null") +
                `<br><b>Platform:</b> ${escape(runObj.platform.data.name) + (runObj.system.emulated ? ' (emulator)' : '')}<br>` +
                `<b>Date:</b> ${escape(runObj.date)}<br>` +
                `<b>Submitted:</b> ${escape(iso_to_words(runObj.submitted))}<br>` +
                ((runObj.status.status == "verified") ? `<b>Verified:</b> ${escape(iso_to_words(runObj.status["verify-date"]))}<br>` : "") +
                ((runObj.status.status == "rejected") ? `<b>Rejection reason:</b> ${escape(runObj.status.reason)}<br>` : "") +
                (("examiner" in runObj.status) ? `<b>Examiner:</b> ${examiner}<br>` : "") +
              `</div>`;
  let popup_div = document.getElementById("runs-popup");
  popup_div.innerHTML = popup;
  popup_div.style.display = "block";
  document.body.classList.add("popup-open");
  document.getElementById("runs-popup-close").onclick = function() {
    popup_div.style.display = "none";
    popup_div.innerHTML = "";
    document.body.classList.remove("popup-open");
  }
  window.onclick = function(event) {
    if (event.target == popup_div) {
      popup_div.style.display = "none";
      popup_div.innerHTML = "";
      document.body.classList.remove("popup-open");
      window.onclick = null;
    }
  }
}
