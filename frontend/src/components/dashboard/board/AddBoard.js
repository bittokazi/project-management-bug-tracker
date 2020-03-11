import React, { Component } from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { ApiCall } from "./../../../services/NetworkLayer";

export default class AddBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }

  updateForm = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  addBoard = event => {
    event.preventDefault();
    let history = this.props.history;
    ApiCall().authorized(
      {
        method: "POST",
        url: "/boards",
        data: {
          title: this.state.title
        }
      },
      response => {
        history.push("/dashboard/boards/list");
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
              <h4 class="page-title">Add Board</h4>
              <DashboardBreadcrumb />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="white-box">
                <form
                  class="form-material form-horizontal"
                  onSubmit={event => this.addBoard(event)}
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
