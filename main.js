let grid_size_x = 150;
let grid_size_y = grid_size_x;
let square_size_height = 16;
let square_size_width = 16;
let grid = document.getElementById("massive-grid");
let current_scale = 1.0;
let path_len = grid_size_x;
let grid_matrix = [];
let selected;

function init() {
  draw_grid(grid_size_x, grid_size_y);
  grid.addEventListener("wheel", scroll_handler);
}

function draw_grid(height, width) {
  let grid_width = width * square_size_width + width * 2;

  grid.style.width = `${grid_width}px`;

  for (let i = 0; i < height; i++) {
    grid_matrix.push([]);

    for (let j = 0; j < width; j++) {
      let square = document.createElement("div");
      square.classList.add("square");

      square.style.height = `${square_size_height}px`;

      square.style.width = `${square_size_width}px`;
      square.dataset.i = i;
      square.dataset.j = j;
      square.addEventListener("mouseenter", square_mouseenter);
      square.addEventListener("mouseleave", square_mouseleave);
      square.addEventListener("click", square_click);
      grid.appendChild(square);
      grid_matrix[i].push(square);
    }
  }
}

function square_mouseenter(event) {
  let elem = event.target;
  elem.classList.add("highlight");
  draw_path(elem);
}

function square_mouseleave(event) {
  event.target.classList.remove("highlight");
}

function square_click(event) {
  if (selected === undefined) {
    let elem = event.target;
    selected = elem;
    elem.classList.add("clicked");
  } else {
    selected.classList.remove("clicked");
    selected = undefined;
    clear_path();
  }
}

function clear_path() {
  for (let elem of document.querySelectorAll(".path")) {
    elem.classList.remove("path");
  }
}

function draw_path(target) {
  if (selected === undefined) return;
  clear_path();
  let path = shortest_path(selected, target, path_len - 1);

  for (let elem of path) {
    elem.classList.add("path");
  }
}

function shortest_path(start, end, max = Infinity) {
  if (start === end) return [];
  let path = [];
  let c = 0;

  while (start !== end) {
    start = get_next_shortest_node(start, end);
    path.push(start);

    if (c === max) {
      break;
    }

    c++;
  }

  return path;
}

function get_next_shortest_node(start, end) {
  let i = Number(start.dataset.i),
    j = Number(start.dataset.j);
  let end_x = end.offsetLeft;
  let end_y = end.offsetTop;
  let paths = [
    (grid_matrix[i - 1] || [])[j - 1], // diag
    (grid_matrix[i] || [])[j - 1],
    (grid_matrix[i + 1] || [])[j - 1], // diag
    (grid_matrix[i + 1] || [])[j],
    (grid_matrix[i + 1] || [])[j + 1], // diag
    (grid_matrix[i] || [])[j + 1],
    (grid_matrix[i - 1] || [])[j + 1], // diag
    (grid_matrix[i - 1] || [])[j],
  ];

  let shortest = {
    dist: Infinity,
    elem: undefined,
  };

  for (let path of paths) {
    if (path === undefined) continue;
    let dist =
      Math.abs(path.offsetTop - end_y) + Math.abs(path.offsetLeft - end_x);

    if (dist < shortest.dist) {
      shortest.dist = dist;
      shortest.elem = path;
    }
  }

  return shortest.elem;
}

function scroll_handler(event) {
  event.preventDefault();

  current_scale += event.deltaY * -0.005;

  current_scale = Math.min(Math.max(0.125, current_scale), 4);

  grid.style.transform = `translate(-50%, -50%) scale(${current_scale})`;
}

init();
