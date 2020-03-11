import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardFooter from "./DashboardFooter";
import DashboardNotification from "./DashboardNotification";
import MainPage from "./../components/dashboard/MainPage/MainPage";
import UserInfoProvider from "./../providers/UserInfoProvider";

export default class DashboardLayout extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <div class="preloader">
          <div class="cssload-speeding-wheel"></div>
        </div>
        <div id="wrapper">
          <UserInfoProvider>
            <DashboardHeader />
            <DashboardSidebar />
            {this.props.children}
            <DashboardFooter />
            <DashboardNotification />
          </UserInfoProvider>
        </div>
      </div>
    );
  }
}
