const HEADER = "https://www.speedrun.com/api/v1";

function json_from_url(url, xhr, exception=true) {
  xhr.open("GET", url, false);
  xhr.send();
  if ((xhr.status < 400) || !exception)
    return JSON.parse(xhr.responseText);
  else
    throw xhr.status;
}

function json_from_src(short_url, xhr, exception=true) {
  return json_from_url(HEADER + short_url, xhr, exception);
}

function continual_data(short_url, xhr) {
  let hold = [];
  let resp = json_from_src(short_url + (short_url.includes("?") ? "&max=200" : "?max=200"), xhr);
  while (true) {
    hold.push(...resp.data);
    if (!("pagination" in resp) || (resp.pagination.size < 200))
      break;
    let linkMap = resp.pagination.links.reduce((newObj, x) => ({...newObj, [x.rel]: x.uri}), {});
    resp = json_from_url(linkMap.next, xhr);
  }
  return hold;
}

async function json_from_url_await(url) {
  let resp = await fetch(url);
  if (resp.ok)
    return resp.json();
  else
    throw resp.status;
}

async function json_from_src_await(short_url) {
  return await json_from_url_await(HEADER + short_url);
}

async function continual_data_await(short_url) {
  let hold = [];

  async function next_await(json) {
    hold.push(...json.data);
    if (!("pagination" in json) || (json.pagination.size < 200))
      return;
    let linkMap = json.pagination.links.reduce((newObj, x) => ({...newObj, [x.rel]: x.uri}), {});
    await json_from_url_await(linkMap.next)
                        .then(json => next_await(json));
  }

  return await json_from_src_await(short_url + (short_url.includes("?") ? "&max=200" : "?max=200"))
                             .then(json => next_await(json))
                             .then(() => hold);
}

async function continual_data_await_fast(short_url, limit) {
  if (limit % 200)
    throw "Limit must be a multiple of 200";
  
  let hold = [];

  async function next_await_fast(start) {
    let promises = [];
    for (let i = 0; i < limit; i += 200) {
      promises.push(json_from_src_await(short_url + (short_url.includes("?") ? "&max=200" : "?max=200") + `&offset=${start * limit + i}`)
                                  .then(function(json) {hold.push(...json.data);}));
    }
    await Promise.all(promises);
    if (hold.length == (start + 1) * limit)
      await next_await_fast(start + 1);
  }

  return await next_await_fast(0).then(() => hold);
}                    

async function continual_data_await_fast_reverse(short_url, limit) {
  if (limit % 200)
    throw "Limit must be a multiple of 200";
  if (limit > 10000)
    throw "Limit must be no greater than 10000";
  
  let hold = [];
  let holdD = {};
  let asc_hi;
  let desc_lo;

  async function next_await_fast_reverse(start, reverse) {
    let promises = [];
    let dir = reverse ? "desc" : "asc";
    for (let i = 0; i < limit; i += 200) {
      promises.push(json_from_src_await(short_url + (short_url.includes("?") ? "&" : "?") + `orderby=submitted&direction=${await dir}&max=200` +
                                        `&offset=${start * limit + i}`)
                                  .then(function(json) {hold.push(...json.data);
                                                        if (i == limit - 200 && json.data.length > 0) {
                                                          if (reverse) {desc_lo = json.data[json.data.length - 1].submitted;}
                                                          else {asc_hi = json.data[json.data.length - 1].submitted;}}}));
    }
    await Promise.all(promises);
    if ((asc_hi === undefined || desc_lo === undefined || asc_hi <= desc_lo) && hold.length == (start + 1) * limit + 10000 * reverse) {
      if (hold.length == 10000 && !reverse)
        await next_await_fast_reverse(0, true);
      else if (hold.length == 20000)
        console.warn(`Could not fetch all runs for ${short_url}`);
      else
        await next_await_fast_reverse(start + 1, reverse);
    }
  }

  return await next_await_fast_reverse(0, false).then(function() {
                                                        for (let run of hold)
                                                          if (!(run.id in holdD)) {holdD[run.id] = run;}
                                                        return Object.values(holdD);
                                                      });
}