function get_display_name(user, flag=true, link=true) {
  if (!("rel" in user) || user.rel == "user") {
    let name_style = user["name-style"];
    let user_name = user.names.international;
    let user_loc = user.location;
    if (name_style.style == "gradient") {
      let startL = name_style["color-from"].light;
      let endL = name_style["color-to"].light;
      let startD = name_style["color-from"].dark;
      let endD = name_style["color-to"].dark;
      let name_gradientL = gradient((startL in COLOR_MAP ? COLOR_MAP[startL] : startL).slice(1),
                                    (endL in COLOR_MAP ? COLOR_MAP[endL] : endL).slice(1), user_name.length);
      let name_gradientD = gradient(startD.slice(1), endD.slice(1), user_name.length);
      var display_name = `<span class="xlight ${mode}">` +
                           name_gradientL.map((c, i) => `<span style="color:#${c}">${escape(user_name[i])}</span>`).join("") +
                         `</span>` +
                         `<span class="xdark ${mode}">` +
                           name_gradientD.map((c, i) => `<span style="color:#${c}">${escape(user_name[i])}</span>`).join("") +
                         `</span>`;
    } else if (name_style.style == "solid") {
      let colorL = name_style.color.light;
      let colorD = name_style.color.dark;
      var display_name = `<span style="color:${colorL in COLOR_MAP ? COLOR_MAP[colorL] : colorL}" class="xlight ${mode}">` +
                           escape(user_name) +
                         `</span>` +
                         `<span style="color:${colorD}" class="xdark ${mode}">` +
                           escape(user_name) +
                         `</span>`;
    } else {
      var display_name = `<span>${escape(user_name)}</span>`;
    }
    display_name = `<b>${display_name}</b>`;
    if (flag && (user_loc !== null) && ("country" in user_loc)) {
      let cc = user_loc.country.code;
      display_name = `<span style="white-space:nowrap">` +
                       `<img src="https://www.speedrun.com/images/flags/${cc}.png" height="12" alt="[${cc}]"> ` +
                       display_name +
                     `</span>`;
    }
    if (link) {
      return `<button onclick="load_user_profile('${user.id}')" class="xlink ${mode}">${display_name}</button>`;
    } else {
      return display_name;
    }
  } else if (user.rel == "guest") {
    let split_name = user.name.match(/^\[(.*)\](.*)/);
    if (split_name) {
      let name = escape(split_name[2]);
      if (flag) {
        return `<span style="white-space:nowrap">` +
                 `<img src="https://www.speedrun.com/images/flags/${split_name[1]}.png" height="12" onerror="this.outerHTML = this.alt" ` +
                  `alt="[${split_name[1]}]"> ` +
               `${name}</span>`;
      } else {
        return name;
      }
    } else {
      return escape(user.name);
    }
  } else if ("name" in user) {
    return escape(user.name);
  } else {
    return "?";
  }
}

function get_country(user) {
  if(!("rel" in user) || user.rel == "user") {
    let user_loc = user.location;
    if (user_loc == null || !("country" in user_loc))
      return "";
    return user_loc.country.code.split("/")[0];
  } else if (user.rel == "guest" || "name" in user) {
    let split_name = user.name.match(/^\[(.*)\].*/);
    if (split_name)
      return split_name[1].split("/")[0];
    else
      return "";
  } else
    return "";
}