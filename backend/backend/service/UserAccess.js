import UserRole from "./UserRole";
import ResoucePathGenerator from "./../utils/ResoucePathGenerator";

export const UserAccess = (role, req) => {
  let menu;
  if (role == UserRole.superAdmin && !req.tenant) {
    let userPaths = ResoucePathGenerator("/dashboard", "users");
    let companyPaths = ResoucePathGenerator("/dashboard", "companies");

    menu = {
      path: `/dashboard`,
      title: `Dashboard`,
      sub: [
        {
          path: `/dashboard`,
          title: `Dashboard`,
          show: true,
          breadcrumb: true,
          icon: `glyphicon glyphicon-fire`
        },
        {
          path: `/dashboard/users`,
          title: `Users`,
          sub: userPaths,
          show: true,
          breadcrumb: true,
          icon: `fa-fw ti-user fa-fw`
        },
        {
          path: `/dashboard/profile`,
          title: `My Profile`,
          show: true,
          breadcrumb: true,
          icon: `fa-fw ti-flickr-alt fa-fw`
        },
        {
          path: `/dashboard/companies`,
          title: `Company`,
          sub: companyPaths,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-briefcase fa-fw"
        },
        {
          path: `/dashboard/logout`,
          title: `Logout`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw  ti-arrow-circle-left  fa-fw"
        }
      ],
      show: true,
      breadcrumb: true
    };
  } else if (
    role == UserRole.owner ||
    (role == UserRole.superAdmin && req.tenant)
  ) {
    let userPaths = ResoucePathGenerator("/dashboard", "users");
    // let companyPaths = ResoucePathGenerator("/dashboard", "companies");
    let taskPaths = ResoucePathGenerator("/dashboard", "tasks");
    let projectPaths = ResoucePathGenerator("/dashboard", "projects");
    let boardPaths = ResoucePathGenerator("/dashboard", "boards");

    menu = {
      path: `/dashboard`,
      title: `Dashboard`,
      sub: [
        {
          path: `/dashboard`,
          title: `Dashboard`,
          show: true,
          icon: `glyphicon glyphicon-fire`,
          breadcrumb: true
        },
        {
          path: `/dashboard/users`,
          title: `Users`,
          sub: userPaths,
          icon: `fa-fw ti-user fa-fw`,
          show: true,
          breadcrumb: true
        },
        {
          path: `/dashboard/profile`,
          title: `My Profile`,
          show: true,
          breadcrumb: true,
          icon: `fa-fw ti-flickr-alt fa-fw`
        },
        // {
        //   path: `/dashboard/companies`,
        //   title: `Company`,
        //   sub: companyPaths,
        //   show: true,
        //   icon: "fa-fw ti-blackboard fa-fw"
        // },
        {
          path: `/dashboard/projects`,
          title: `Projects`,
          sub: projectPaths,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-ruler-pencil fa-fw"
        },
        {
          path: `/dashboard/boards`,
          title: `Boards`,
          sub: boardPaths,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-blackboard fa-fw"
        },
        {
          path: `/dashboard/tasks`,
          title: `Tasks`,
          sub: taskPaths,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-pencil-alt fa-fw"
        },
        {
          path: `/dashboard/task-board`,
          title: `Task Board`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-clipboard fa-fw"
        },
        {
          path: `/select-tenant`,
          title: `Change Workspace`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-briefcase fa-fw"
        },
        {
          path: `/dashboard/logout`,
          title: `Logout`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw  ti-arrow-circle-left fa-fw"
        }
      ],
      show: true,
      breadcrumb: true
    };
  } else if (role == UserRole.user) {
    let taskPaths = ResoucePathGenerator("/dashboard", "tasks");
    menu = {
      path: `/dashboard`,
      title: `Dashboard`,
      sub: [
        {
          path: `/dashboard`,
          title: `Dashboard`,
          show: true,
          breadcrumb: true,
          icon: `glyphicon glyphicon-fire`
        },
        {
          path: `/dashboard/profile`,
          title: `My Profile`,
          show: true,
          breadcrumb: true,
          icon: `fa-fw ti-flickr-alt fa-fw`
        },
        {
          path: `/dashboard/tasks`,
          title: `Tasks`,
          sub: taskPaths,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-pencil-alt fa-fw"
        },
        {
          path: `/dashboard/task-board`,
          title: `Task Board`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-blackboard fa-fw"
        },
        {
          path: `/select-tenant`,
          title: `Change Workspace`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw ti-clipboard fa-fw"
        },
        {
          path: `/dashboard/logout`,
          title: `Logout`,
          show: true,
          breadcrumb: true,
          icon: "fa-fw  ti-arrow-circle-left  fa-fw"
        }
      ],
      show: true,
      breadcrumb: true
    };
  }
  return menu;
};

export default UserAccess;
