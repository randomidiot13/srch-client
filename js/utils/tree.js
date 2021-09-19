function isPrimitive(obj) {
  return (typeof(obj) != "object") || ["null", "[]", "{}"].includes(JSON.stringify(obj));
}

function dump(obj, compress=false, prefix="") {
  if (typeof(obj) == "string")
    return prefix + escape(JSON.stringify(obj)).replaceAll("\\r\\n", "<br>");
  else if (isPrimitive(obj))
    return prefix + escape(JSON.stringify(obj));
  else if (Array.isArray(obj))
    return obj.map((x, i) => `<li>${dump(x, false, i.toString() + ". ")}</li>`).join("");
  else {
    let ret = "";
    for (let x in obj) {
      if (isPrimitive(obj[x]))
        ret += `<li>${escape(x)}: ${dump(obj[x])}</li>`;
      else
        ret += `<li><span class="caret ${mode}">${escape(x)}</span><ul class="tree nested">${dump(obj[x], true)}</ul></li>`;
    }
    if (compress || (Object.keys(obj).length == 1 && !isPrimitive(Object.values(obj).pop())))
      return ret;
    else
      return `<li>${prefix}<span class="caret ${mode}">&lt;object&gt;</span><ul class="tree nested">${ret}</ul></li>`;
  }
}