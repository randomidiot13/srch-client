function load_user_profile_inner(username) {
  let xhr = new XMLHttpRequest();
  try {
    var userObj = json_from_src(`/users/${username}`, xhr);
  }
  catch (e) {
    let output = back_header(`User: ${escape(username)}`) + 
                 `<p style="text-align:center">Could not find user ${escape(username)}.</p>`;
    disp(output);
    return;
  }
  let userID = userObj.data.id;
  let userName = userObj.data.names.international;
  let displayName = get_display_name(userObj.data, true, false);
  let userPFP = `<img src="https://www.speedrun.com/userasset/${userID}/image" alt="" width="128" height="128" ` +
                `onerror="this.src = 'https://www.speedrun.com/themes/404/cover-128.png'">`;
  let userPronouns = userObj.data.pronouns;
  let displayPronouns = (userPronouns !== "" && userPronouns !== null) ? `<b>Pronouns:</b> ${escape(userPronouns)}<br>` : "";
  let userSignup = iso_to_words(userObj.data.signup);
  let userLoc = userObj.data.location;
  if (userLoc == null)
    var displayLoc = "";
  else {
    if ("region" in userLoc)
      var displayLoc = `<b>Location:</b> ${userLoc.region.names.international}<br>`;
    else
      var displayLoc = `<b>Location:</b> ${userLoc.country.names.international}<br>`;
  }
  let userTwitch = (userObj.data.twitch !== null) ? `<b>Twitch:</b> <a href="${userObj.data.twitch.uri}" target="_blank">` +
                   `${escape(userObj.data.twitch.uri)}</a><br>` : "";
  let userYT = (userObj.data.youtube !== null) ? `<b>YouTube:</b> <a href="${userObj.data.youtube.uri}" target="_blank">` +
               `${escape(userObj.data.youtube.uri)}</a><br>` : "";
  let userTwitter = (userObj.data.twitter !== null) ? `<b>Twitter:</b> <a href="${userObj.data.twitter.uri}" target="_blank">` +
                   `${escape(userObj.data.twitter.uri)}</a><br>` : "";
  let userSRL = (userObj.data.speedrunslive !== null) ? `<b>SpeedRunsLive:</b> <a href="${userObj.data.speedrunslive.uri}" target="_blank">` +
                `${escape(userObj.data.speedrunslive.uri)}</a><br>` : "";
  let output = back_header(`User: ${escape(userName)}`) +
               `<table class="center">` +
                 `<tr>` +
                   `<td style="text-align:center">` +
                     userPFP +
                     `<figcaption>${displayName}</figcaption>` +
                   `</td>` +
                   `<td></td>` +
                   `<td style="word-wrap:break-word">` +
                     `<b>Username:</b> ${escape(userName)}<br>` +
                     `<b>User ID:</b> ${escape(userID)}<br>` +
                     displayPronouns +
                     `<b>Signed Up:</b> ${escape(userSignup)}<br>` +
                     displayLoc +
                     userTwitch +
                     userYT +
                     userTwitter +
                     userSRL +
                   `</td>` +
                 `</tr>` +
                 `<tr>` +
                   `<td style="text-align:center">` +
                     `<a href="${userObj.data.weblink}" target="_blank">SRC Link</a>` +
                   `</td>` +
                   `<td></td>` +
                   `<td>` +
                     `<b>Further Links:</b><br>` +
                     `&bull; <button onclick="load_user_games('${userID}')" class="link ${mode}">Games moderated</button><br>` +
                     `&bull; <button onclick="load_user_runs('${userID}')" class="link ${mode}">Runs</button>` +
                   `</td>` +
                 `</tr>` +
               `</table>`;
  disp(output);
}

function load_user_profile(usernameOrID) {
  push_stack(function() {load_user_profile_inner(usernameOrID);});
}