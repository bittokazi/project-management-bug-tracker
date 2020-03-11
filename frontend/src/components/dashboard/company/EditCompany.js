import React from "react";
import AuthComponent from "./../AuthComponent";
import DashboardBreadcrumb from "./.././../../layouts/DashboardBreadcrumb";

export default function EditCompany() {
  return (
    <AuthComponent>
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
              <h3>Company Page</h3>
            </div>
          </div>
        </div>
      </div>
    </AuthComponent>
  );
}
