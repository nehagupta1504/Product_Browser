function fetchAllProducts() {
  return fetch("http://localhost:8000/products?json").then((res) => res.json());
}

function fetchCurrentUserFavProducts() {
  const username = localStorage.getItem("username");
  return fetch(`http://localhost:8000/users/${username}/favourite`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((res) => res.json());
}

function postFavorites(pid) {
  const body = new URLSearchParams();
  body.append("pid", pid);
  const username = localStorage.getItem("username");
  return fetch(`http://localhost:8000/users/${username}/favourite`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    body: body,
  }).then((res) => res.json());
}

export { fetchAllProducts, fetchCurrentUserFavProducts, postFavorites };
