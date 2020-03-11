import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { ApiCall } from "./../../../services/NetworkLayer";

export default class AddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      key: ""
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  addProject = event => {
    event.preventDefault();
    let history = this.props.history;
    ApiCall().authorized(
      {
        method: "POST",
        url: "/projects",
        data: {
          title: this.state.title,
          key: this.state.key
        }
      },
      response => {
        if (response.status == 200) {
          history.push("/dashboard/projects");
        }
      },
      error => {
        console.log(error.response);
      }
    );
  };

  render() {
    return (
      <AuthComponent>
        <div class="container-fluid">
          <div class="row bg-title">
            <div class="col-lg-12">
              <h4 class="page-title">Add Project</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={event => this.addProject(event)}
                >
                  <div class="form-group">
                    <label class="col-md-12">Title</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.title}
                        onChange={event => this.updateForm(event, "title")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Project Key</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.key}
                        onChange={event => this.updateForm(event, "key")}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-info waves-effect waves-light"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
