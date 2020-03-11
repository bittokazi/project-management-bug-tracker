import React, { useState, Component } from "react";
import { ApiCall } from "./../../../services/NetworkLayer";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import TaskListDataTable from "./TaskListDataTable";
import { filterTaskStatus } from "./../../../utils/TaskStatus";

export default class TaskList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      projects: [],
      boards: [],
      users: []
    };
  }
  componentDidMount() {}

  authSuccess() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/tasks"
      },
      response => {
        this.setState({ tasks: response.data });
      },
      error => {
        console.log(error.response);
      }
    );
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
    ApiCall().authorized(
      {
        method: "GET",
        url: "/boards"
      },
      response => {
        this.setState({ boards: response.data });
      },
      error => {
        console.log(error.response);
      }
    );
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users"
      },
      response => {
        response.data.map(user => {
          user.name = `${user.firstName} ${user.lastName}(${user.username})`;
          user.value = `${user.id}`;
        });
        console.log(response.data);
        this.setState({
          users: response.data
        });
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
              <h4 class="page-title">Task List</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <div class="table-responsive">
                  <TaskListDataTable
                    taskList={this.state.tasks}
                    projectList={this.state.projects}
                    boardList={this.state.boards}
                    userList={this.state.users}
                    mainState={this}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthComponent>
    );
  }
}
