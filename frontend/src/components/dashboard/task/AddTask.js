import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { ApiCall } from "./../../../services/NetworkLayer";

export default class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      type: 1,
      projectid: "",
      projects: []
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  addTask = event => {
    event.preventDefault();
    let history = this.props.history;
    if (this.state.projectid == "") return;
    ApiCall().authorized(
      {
        method: "POST",
        url: "/tasks",
        data: {
          name: this.state.name,
          description: this.state.description,
          type: this.state.type,
          projectid: this.state.projectid
        }
      },
      response => {
        if (response.status == 200) {
          history.push("/dashboard/tasks");
        }
      },
      error => {
        console.log(error.response);
      }
    );
  };

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
              <h4 class="page-title">Add Task</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={event => this.addTask(event)}
                >
                  <div class="form-group">
                    <label class="col-md-12">Title</label>
                    <div class="col-md-12">
                      <input
                        type="text"
                        class="form-control form-control-line"
                        value={this.state.name}
                        onChange={event => this.updateForm(event, "name")}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-12">Select Project</label>
                    <div class="col-sm-12">
                      <select
                        class="form-control"
                        value={this.state.projectid}
                        onChange={event => this.updateForm(event, "projectid")}
                      >
                        <option value="">None</option>
                        {this.state.projects.map(project => {
                          return (
                            <option value={project.id}>{project.title}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-12">Task Type</label>
                    <div class="col-sm-12">
                      <select
                        class="form-control"
                        value={this.state.type}
                        onChange={event => this.updateForm(event, "type")}
                      >
                        <option value="1">Feature</option>
                        <option value="2">Bug</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-md-12">Description</label>
                    <div class="col-md-12">
                      <textarea
                        class="form-control"
                        rows="5"
                        value={this.state.description}
                        onChange={event =>
                          this.updateForm(event, "description")
                        }
                      ></textarea>
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
