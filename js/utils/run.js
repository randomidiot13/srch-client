function full_category(run) {
  let subcatvals = [];
  let var_map = run.category.data.variables.data.reduce((newObj, x) => ({...newObj, [x.id]: x}), {});
  for (let key in run.values) {
    if ((key in var_map) && var_map[key]["is-subcategory"])
      subcatvals.push(var_map[key].values.values[run.values[key]].label);
  }
  let main;
  if (run.level === null || run.level.data.length === 0)
    main = run.category.data.name;
  else {
    main = run.level.data.name;
    subcatvals.unshift(run.category.data.name);
  }
  return ((subcatvals.length > 0) ? `${main} - ${subcatvals.join(", ")}` : main);
}

function status_mark(run, expand=false) {
  let status = run.status.status;
  if (status == "verified")
    return `<span style="color:#008450"><b>V${expand ? "erified" : ""}</b></span>`;
  else if (status == "new")
    return `<span style="color:#EFB700"><b>P${expand ? "ending" : ""}</b></span>`;
  else if (status == "rejected")
    return `<span style="color:#B81D13"><b>R${expand ? "ejected" : ""}</b></span>`;
  else
    return `<b>?</b>`;
}

function player_hash(run) {
  return run.players.data.map(p => ((p.rel == "user") ? p.names.international : p.name)).join("|");
}