import React from "react";
import DashboardLayout from "./../../layouts/DashboardLayout";
import { Switch, Route, useHistory } from "react-router-dom";
import { ApiCall } from "./../../services/NetworkLayer";
import MainPage from "./MainPage/MainPage";
import Profile from "./profile/Profile";
import AddUser from "./user/AddUser";
import UserList from "./user/UserList";
import CompanyList from "./../dashboard/company/CompanyList";
import EditCompany from "./../dashboard/company/EditCompany";
import AddTask from "./../dashboard/task/AddTask";
import TaskList from "./../dashboard/task/TaskList";
import TaskBoard from "./../dashboard/task/TaskBoard";
import AddProject from "./../dashboard/Project/AddProject";
import ProjectList from "./../dashboard/Project/ProjectList";
import AddBoard from "./../dashboard/board/AddBoard";
import BoardList from "./../dashboard/board/BoardList";
import Logout from "./Logout";
import NotFound from "./NotFound";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Switch>
        <Route exact path="/dashboard" component={MainPage} />
        <Route exact path="/dashboard/profile" component={Profile} />
        <Route exact path="/dashboard/users/add" component={AddUser} />
        <Route exact path="/dashboard/users" component={UserList} />
        <Route exact path="/dashboard/companies" component={CompanyList} />
        <Route
          exact
          path="/dashboard/companies/edit/:id"
          component={EditCompany}
        />
        <Route exact path="/dashboard/tasks/add" component={AddTask} />
        <Route exact path="/dashboard/tasks" component={TaskList} />
        <Route exact path="/dashboard/task-board" component={TaskBoard} />
        <Route exact path="/dashboard/projects/add" component={AddProject} />
        <Route exact path="/dashboard/projects" component={ProjectList} />
        <Route exact path="/dashboard/boards/add" component={AddBoard} />
        <Route exact path="/dashboard/boards" component={BoardList} />
        <Route exact path="/dashboard/logout" component={Logout} />
        <Route path="/dashboard/*" component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}
