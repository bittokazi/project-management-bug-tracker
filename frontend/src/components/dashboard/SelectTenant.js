import React, { useState, Component } from "react";
import UserInfoProvider from "./../../providers/UserInfoProvider";
import { ApiCall } from "./../../services/NetworkLayer";
import AuthStore from "./../../services/AuthStore";

let $ = window.$;

export default class SelectTenant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenants: [],
      userInfo: {}
    };
  }

  selectTenantKey(tenant) {
    let history = this.props.history;
    AuthStore().saveTenantKey(tenant);
    history.push("/dashboard");
  }

  componentDidMount() {
    document.title = "Select Company | Project Management and Bug Tracker";
    let history = this.props.history;
    if (AuthStore().getOauthToken() == null) {
      history.push("/");
      return;
    }
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users/whoami"
      },
      userInfo => {
        this.setState({ userInfo: userInfo.data });
        ApiCall().authorized(
          {
            method: "GET",
            url: "/tenant"
          },
          resolve => {
            if (userInfo.data.role == "superAdmin") {
              this.setState({
                tenants: [
                  {
                    name: "Administration",
                    key: null
                  }
                ]
              });
            } else {
              this.setState({ tenants: resolve.data.companies });
            }
            setTimeout(() => {
              $(function() {
                $(".preloader").fadeOut();
                $("#side-menu").metisMenu();
                $("body").trigger("resize");
              });
              //window.Waves.displayEffect();
            }, 1000);
          },
          error => {}
        );
      },
      reject => {
        history.push("/");
      }
    );
  }
  render() {
    return (
      <div>
        <div class="preloader">
          <div class="cssload-speeding-wheel"></div>
        </div>
        <div id="wrapper">
          <UserInfoProvider>
            <section id="wrapper" class="login-register">
              <div class="login-box">
                <h3 class="select-tenant-h1">Select Company</h3>
                <div class="white-box login-white-box">
                  <div class="form-group text-center m-t-40">
                    <div class="col-xs-12">
                      {this.state.tenants.map(tenant => {
                        return (
                          <button
                            class="btn btn-success btn-lg btn-block text-uppercase waves-effect waves-light"
                            onClick={() => this.selectTenantKey(tenant.key)}
                          >
                            {tenant.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* </form> */}
                </div>
                <footer class="footer text-center"></footer>
              </div>
            </section>
          </UserInfoProvider>
        </div>
      </div>
    );
  }
}
