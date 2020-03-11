import React, { useState, Component } from "react";
import { ApiCall } from "./../../../services/NetworkLayer";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import AuthStore from "./../../../services/AuthStore";
import { Link } from "react-router-dom";

export default class CompanyList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companies: []
    };
  }
  componentDidMount() {}

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/companies"
      },
      response => {
        this.setState({ companies: response.data });
      },
      error => {
        console.log(error.response);
      }
    );
  }

  selectTenantKey(tenant) {
    let history = this.props.history;
    AuthStore().saveTenantKey(tenant);
    history.push("/dashboard");
  }

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Company List</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Company Name</th>
                        <th>Owner</th>
                        <th>Edit</th>
                        <th>Switch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.companies.map(company => {
                        return (
                          <tr>
                            <td>{company.id}</td>
                            <td>{company.name}</td>
                            <td>(TBD)</td>
                            <td>
                              <Link
                                to={`/dashboard/companies/edit/${company.id}`}
                              >
                                Edit
                              </Link>
                            </td>
                            <td
                              onClick={() => {
                                this.selectTenantKey(company.key);
                              }}
                            >
                              Switch
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
