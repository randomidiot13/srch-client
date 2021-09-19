function compare(a, b, reverse=false) {
  if (a == b) {
    return 0;
  } else if (a === null || a === undefined) {
    return (reverse ? -1 : 1);
  } else if (b === null || b === undefined) {
    return (reverse ? 1 : -1);
  } else {
    return (reverse ? (a > b) : (a < b)) - 0.5;
  }
}

function status_sorter(run) {
  let status = run.status.status;
  if (status == "verified")
    return "C";
  else if (status == "new")
    return "B";
  else if (status == "rejected")
    return "A";
  else
    return null;
}