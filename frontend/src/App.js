import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/Dashboard";
import Signup from "./components/front/Signup";
import SelectTenant from "./components/dashboard/SelectTenant";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/select-tenant" component={SelectTenant} />
      </Switch>
    </Router>
  );
}

export default App;
