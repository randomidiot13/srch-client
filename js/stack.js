let stack = [];
let active;

function push_stack(func) {
  if (active !== undefined)
    stack.push(active);
  active = func;
  active();
}

function pop_stack() {
  if (stack.length === 0)
    return;
  active = stack.pop();
  active();
}