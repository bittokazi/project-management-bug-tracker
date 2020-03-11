import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import AuthStore from "./../../services/AuthStore";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [success, setSuccess] = useState(false);
  let useHistoryRouter = useHistory();
  const subdomain = window.location.hostname.split(".");

  useEffect(() => {
    document.title = "Signup | Project Management and Bug Tracker";
    if (AuthStore().getOauthToken() != null) {
      ApiCall().authorized(
        {
          method: "GET",
          url: "/users/whoami"
        },
        resolve => {
          useHistoryRouter.push("/dashboard");
        },
        reject => {}
      );
    }
  }, []);

  const loginUser = event => {
    event.preventDefault();

    let payload = {
      user: {
        username,
        email,
        password
      },
      company: {
        name,
        key
      }
    };

    ApiCall()
      .public()
      .post("/api/login/register", payload)
      .then(res => {
        setSuccess(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div>
      <div class="limiter">
        <div class="container-login100">
          <div class="wrap-login100">
            <form class="login100-form validate-form" onSubmit={loginUser}>
              <span class="login100-form-title p-b-26">Signup</span>
              <span class="login100-form-title p-b-48">
                <i class="zmdi zmdi-font"></i>
              </span>

              {success && (
                <Fragment>
                  <div class="text-center p-t-115">
                    <span class="txt1">Registration Successful. </span>

                    <Link to="/">&nbsp; Login</Link>
                  </div>
                </Fragment>
              )}

              {!success && (
                <Fragment>
                  <div
                    class="wrap-input100 validate-input"
                    data-validate="Valid email is: a@b.c"
                  >
                    <input
                      class="input100"
                      type="text"
                      name="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                    />
                    <span
                      class="focus-input100"
                      data-placeholder="Email"
                    ></span>
                  </div>

                  <div
                    class="wrap-input100 validate-input"
                    data-validate="Valid email is: a@b.c"
                  >
                    <input
                      class="input100"
                      type="text"
                      name="username"
                      value={username}
                      onChange={event => setUsername(event.target.value)}
                    />
                    <span
                      class="focus-input100"
                      data-placeholder="Username"
                    ></span>
                  </div>

                  <div
                    class="wrap-input100 validate-input"
                    data-validate="Enter password"
                  >
                    <input
                      class="input100"
                      type="text"
                      name="name"
                      value={name}
                      onChange={event => setName(event.target.value)}
                    />
                    <span
                      class="focus-input100"
                      data-placeholder="Company Name"
                    ></span>
                  </div>

                  <div
                    class="wrap-input100 validate-input"
                    data-validate="Enter password"
                  >
                    <input
                      class="input100"
                      type="text"
                      name="key"
                      value={key}
                      onChange={event => setKey(event.target.value)}
                    />
                    <span
                      class="focus-input100"
                      data-placeholder="Company Identifier"
                    ></span>
                  </div>

                  <div
                    class="wrap-input100 validate-input"
                    data-validate="Enter password"
                  >
                    <span class="btn-show-pass">
                      <i class="zmdi zmdi-eye"></i>
                    </span>
                    <input
                      class="input100"
                      type="password"
                      name="pass"
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                    />
                    <span
                      class="focus-input100"
                      data-placeholder="Password"
                    ></span>
                  </div>

                  <div class="container-login100-form-btn">
                    <div class="wrap-login100-form-btn">
                      <div class="login100-form-bgbtn"></div>
                      <button class="login100-form-btn">Register</button>
                    </div>
                  </div>
                </Fragment>
              )}
            </form>
          </div>
        </div>
      </div>

      <div id="dropDownSelect1"></div>
    </div>
  );
}
