import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import AuthStore from "./../../services/AuthStore";
import querystring from "querystring";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("Welcome");
  const [companyExist, setCompanyExist] = useState(false);
  let useHistoryRouter = useHistory();
  let subdomain = window.location.hostname.split(".");

  useEffect(() => {
    document.title = "Login | Project Management and Bug Tracker";
    if (subdomain.length == 4) {
      checkCompany(subdomain[0]);
    } else if (subdomain.length == 3 && subdomain[0] == "pmbt") {
      setCompanyExist(true);
    }
  }, []);

  const authCheck = () => {
    if (AuthStore().getOauthToken() != null) {
      ApiCall().authorized(
        {
          method: "GET",
          url: "/users/whoami"
        },
        resolve => {
          if (resolve.status >= 200) {
            useHistoryRouter.push("/dashboard");
          }
        },
        reject => {}
      );
    }
  };

  const checkCompany = key => {
    ApiCall()
      .public()
      .get("/public/company/check/" + key)
      .then(res => {
        setCompanyName(res.data.name);
        setCompanyExist(true);
        authCheck();
      })
      .catch(err => {
        setCompanyExist(false);
      });
  };

  const loginUser = event => {
    event.preventDefault();
    ApiCall()
      .public()
      .post("/api/login", {
        username,
        password
      })
      .then(res => {
        AuthStore().saveClientCredentials(res.data);
        ApiCall()
          .token()
          .post(
            "/oauth/token",
            querystring.stringify({
              username,
              password,
              grant_type: "password"
            })
          )
          .then(res => {
            AuthStore().saveOauthToken(res.data);
            useHistoryRouter.push("/dashboard");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      {subdomain.length < 5 && (
        <>
          {companyExist && (
            <div>
              <div class="limiter">
                <div class="container-login100">
                  <div class="wrap-login100">
                    <form
                      class="login100-form validate-form"
                      onSubmit={loginUser}
                    >
                      <span class="login100-form-title p-b-26">
                        {companyName}
                      </span>
                      <span class="login100-form-title p-b-48">
                        <i class="zmdi zmdi-font"></i>
                      </span>

                      <div
                        class="wrap-input100 validate-input"
                        data-validate="Valid email is: a@b.c"
                      >
                        <input
                          class="input100"
                          type="text"
                          name="email"
                          value={username}
                          onChange={event => setUsername(event.target.value)}
                        />
                        <span
                          class="focus-input100"
                          data-placeholder="Email"
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
                          <button class="login100-form-btn">Login</button>
                        </div>
                      </div>

                      {subdomain &&
                        (subdomain.length < 4 ||
                          (subdomain.length == 3 &&
                            subdomain[0] == "pmbt")) && (
                          <div class="text-center p-t-115">
                            <span class="txt1">Don’t have an account?</span>

                            <Link to="/signup">&nbsp;Sign Up</Link>
                          </div>
                        )}
                    </form>
                  </div>
                </div>
              </div>

              <div id="dropDownSelect1"></div>
            </div>
          )}
        </>
      )}
    </>
  );
}
