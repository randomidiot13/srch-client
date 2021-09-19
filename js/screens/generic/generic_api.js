function load_generic_api_inner(endpoint) {
  let xhr = new XMLHttpRequest();
  let full_url = escape(HEADER + endpoint);
  let data = json_from_src(endpoint, xhr, false);
  document.getElementById("generic-status").innerHTML = `<a href="${full_url}" target="_blank">${full_url}</a><br>` +
                                                        `<b>Status: ${xhr.status.toString()}`;
  document.getElementById("pre-parent").innerHTML = "JSON Response:";         
  document.getElementById("parent").innerHTML = dump(data, true);
  for (let toggler of document.getElementsByClassName("caret")) {
    toggler.addEventListener("click", function() {
      this.parentElement.querySelector(".nested").classList.toggle("active");
      this.classList.toggle("caret-down");
    });
  }
}

function load_generic_api() {
  let input_endpoint = document.getElementById("endpoint").value;
  push_stack(function() {display_generic_api_inner();
                         document.getElementById("endpoint").value = input_endpoint;
                         load_generic_api_inner(input_endpoint);});
}