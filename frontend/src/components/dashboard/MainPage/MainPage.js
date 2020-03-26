import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";
import { ApiCall } from "./../../../services/NetworkLayer";
import PieChartComponent from "./PieChart";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import AuthStore from "./../../../services/AuthStore";

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [],
      selectedBoard: null,
      pieData: [],
      barData: [],
      users: []
    };
  }

  getAllBoards() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/boards"
      },
      response => {
        this.state.boards = response.data;
        this.state.selectedBoard = response.data[0];
        this.getAllUsers();
      },
      error => {
        console.log(error.response);
      }
    );
  }

  getAllUsers() {
    ApiCall().authorized(
      {
        method: "GET",
        url: "/users"
      },
      response => {
        this.setState({ users: response.data });
        this.getAllTaskOfBoard();
      },
      error => {
        console.log(error.response);
      }
    );
  }

  getAllTaskOfBoard() {
    ApiCall().authorized(
      {
        method: "GET",
        url: `/boards/${this.state.selectedBoard.id}/tasks`
      },
      response => {
        let data = [
          {
            name: "Ready",
            value: 0
          },
          {
            name: "Started",
            value: 0
          },
          {
            name: "In progress",
            value: 0
          },
          {
            name: "Done",
            value: 0
          }
        ];
        let barData = [];
        let assignee = {};
        this.state.users.forEach(user => {
          assignee[user.id] = {
            name: user.username,
            uv: 0
          };
        });
        response.data.forEach(task => {
          data[task.status].value++;
          assignee[task.assignee].uv++;
        });
        this.setState({
          pieData: data
        });
        Object.entries(assignee).map(([key, value]) => {
          barData.push({
            name: value.name,
            Tasks: value.uv
          });
        });
        this.setState({
          barData
        });
      },
      error => {
        console.log(error.response);
      }
    );
  }

  filterPieData = () => {};

  authSuccess(user) {
    if (
      (user != null && user.role != "superAdmin") ||
      (user != null && user.role == "superAdmin" && user.tenant != "")
    ) {
      this.getAllBoards();
    }
  }

  render() {
    return (
      <UserInfoContext.Consumer>
        {userContextConsumer => (
          <AuthComponent authSuccess={user => this.authSuccess(user)}>
            <div class="container-fluid">
              <div class="row bg-title">
                <div class="col-lg-12">
                  <h4 class="page-title">Dashboard</h4>
                  <DashboardBreadcrumb />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="white-box">
                    {((userContextConsumer.user != null &&
                      userContextConsumer.user.role != "superAdmin") ||
                      (userContextConsumer.user != null &&
                        userContextConsumer.user.role == "superAdmin" &&
                        userContextConsumer.user.tenant != "")) && (
                      <div class="row">
                        <div class="col-md-6">
                          <PieChartComponent pieData={this.state.pieData} />
                        </div>
                        <div class="col-md-6">
                          <BarChart
                            width={400}
                            height={400}
                            data={this.state.barData}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Tasks" fill="#8884d8" />
                          </BarChart>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AuthComponent>
        )}
      </UserInfoContext.Consumer>
    );
  }
}
