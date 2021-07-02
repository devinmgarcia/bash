import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Login.css";

const api = "https://bash-api-5k3au.ondigitalocean.app";
// const api = "http://localhost:8088";

export const Login = (props) => {
  const email = useRef();
  const existDialog = useRef();
  const history = useHistory();

  const existingUserCheck = () => {
    return fetch(`${api}/users?email=${email.current.value}`)
      .then((res) => res.json())
      .then((user) => (user.length ? user[0] : false));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    existingUserCheck().then((exists) => {
      if (exists) {
        localStorage.setItem("bash_user", exists.id);
        history.push("/");
      } else {
        existDialog.current.showModal();
      }
    });
  };

  return (
    <main className="container--login">
      <dialog className="dialog dialog--auth" ref={existDialog}>
        <div>User does not exist</div>
        <button
          className="button--close"
          onClick={(e) => existDialog.current.close()}
        >
          Close
        </button>
      </dialog>
      <section className="login-section">
      <div className="title-center">
        <div className="title-wrapper">
          <section className="login-title">
            <div className="B">B</div>
            <div className="A">A</div>
            <div className="S">S</div>
            <div className="H">H</div>
            </section>
          <section className="login-subtext">by: Devin Garcia</section>
        </div>
      </div>
      <section className="form-wrapper">
        <form className="form--login" onSubmit={handleLogin}>
          <h2>Please sign in:</h2>
          <fieldset className="fieldset">
            <input
              ref={email}
              type="email"
              id="email"
              className="form-control"
              placeholder="Email Address"
              required
              autoFocus
            />
          </fieldset>
          <fieldset className="fieldset">
            <button className="button" type="submit">
              Let's Go!
            </button>
          </fieldset>
        </form>
      </section>
      <section className="link--register">
        <Link className="link" to="/register">
          Not a member yet?
        </Link>
      </section>
      </section>
    </main>
  );
};
