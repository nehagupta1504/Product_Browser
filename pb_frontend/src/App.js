import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { Switch, Route, Link, useHistory, Redirect } from "react-router-dom";
import {
  fetchAllProducts,
  fetchCurrentUserFavProducts,
  postFavorites,
} from "./api.js";

function Allproducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetchAllProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <h1>All Products</h1>
      {products.map((el) => {
        const { product_name, quantity, price, _id } = el;
        return (
          <div key={_id}>
            <h3>{product_name}</h3>
            <button
              style={{ backgroundColor: "green" }}
              onClick={() => {
                postFavorites(_id);
              }}
            >
              Add Favorites
            </button>
          </div>
        );
      })}
    </>
  );
}
function UserFav(props) {
  const [favProducts, setFavProducts] = useState([]);
  const { isLoggedin } = props;
  useEffect(() => {
    fetchCurrentUserFavProducts().then((data) => {
      setFavProducts(data);
    });
  }, []);
  return (
    <>
      <h1 style={{ color: "lightblue" }}>Favorites</h1>
      {isLoggedin ? (
        favProducts.map((el) => {
          const { product_name, quantity, price, _id } = el;
          return (
            <div key={el._id}>
              <h3>{el.product_name}</h3>
            </div>
          );
        })
      ) : (
        <h3 style={{ color: "red" }}>Not logged in</h3>
      )}
    </>
  );
}

function HomePage() {
  let history = useHistory();
  const [isLoggedin, setLogin] = useState(function () {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    return true;
  });
  return (
    <>
      <header>
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <ul style={{ listStyle: "none", display: "flex" }}>
            <Link to="/login" style={{ margin: "0 10px 0 10px" }}>
              Login
            </Link>
            <Link to="/signup">Signup</Link>
            <Link
              to="/logout"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem("token");
                history.push("/logout");
              }}
            >
              Logout
            </Link>
          </ul>
        </nav>
      </header>
      <section>
        {isLoggedin ? (
          <h1 style={{ color: "green" }}>Logged in</h1>
        ) : (
          <h1>Please Log in</h1>
        )}
      </section>
      <Allproducts />
      <UserFav isLoggedin={isLoggedin} />
    </>
  );
}
function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  return <Redirect to="/"></Redirect>;
}
function SignUp() {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
      <h1>Sign Up </h1>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          fetch("http://localhost:8000/users", {
            method: "POST",
            body: new URLSearchParams(formData),
          })
            .then((res) => res.json())
            .then((data) => {
              setIsSuccessful(true);
              setMessage(data.message);
            });
        }}
      >
        <input type="text" name="username" placeholder="Username" />
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button>Submit</button>
        {isSuccessful ? <h1 style={{ color: "green" }}>{message}</h1> : null}
      </form>
    </>
  );
}
function Login() {
  const [error, setError] = useState();
  const history = useHistory();
  return (
    <form
      action=""
      onSubmit={(event) => {
        event.preventDefault();
        const body = new URLSearchParams(new FormData(event.target));
        fetch("http://localhost:8000/users/login", {
          method: "POST",
          body,
        }).then((res) => {
          if (!res.ok) {
            //!200
            setError(true);
          } else {
            res.json().then((data) => {
              localStorage.setItem("token", data.token);
              localStorage.setItem("username", data.username);
              history.push("/"); //redirect to '/'
            });
          }
        });
      }}
    >
      <input type="text" name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button>Submit</button>
      {error ? (
        <h1 style={{ color: "red" }}>Enter correct user credentials</h1>
      ) : null}
    </form>
  );
}
function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/logout" exact>
        <Logout />
      </Route>
    </Switch>
  );
}

export default App;
