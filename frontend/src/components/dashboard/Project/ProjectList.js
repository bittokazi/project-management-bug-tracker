import React, { useState, Component } from "react";
import { ApiCall } from "./../../../services/NetworkLayer";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";

export default class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: []
    };
  }
  componentDidMount() {}

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/projects"
      },
      response => {
        this.setState({ projects: response.data });
      },
      error => {
        console.log(error.response);
      }
    );
  }

  render() {
    return (
      <AuthComponent authSuccess={() => this.authSuccess()}>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Project List</h4>
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
                        <th>Title</th>
                        <th>Key</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.projects.map(project => {
                        return (
                          <tr>
                            <td>{project.id}</td>
                            <td>{project.title}</td>
                            <td>{project.key}</td>
                            <td>(TBD)</td>
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
