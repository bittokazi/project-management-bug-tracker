import { HelloWorld } from "./../controllers/HelloController";
import { companyCheckAPI } from "./../controllers/PublicAPIController";

import userRoutes from "./User";
import companyRoutes from "./Company";
import taskRoutes from "./Task";
import tenantRoutes from "./Tenant";
import projectRoutes from "./Project";
import boardRoutes from "./Board";

import chatServiceRoutes from "./ChatService";
import ServiceAuthMiddleware from "./../middlewares/ServiceAuthMiddleware";
import ServiceTenantIdentifier from "./../middlewares/ServiceTenantIdentifier";

import UserInfo from "./../engine/oauth/OauthInfoInterceptor";
import TenantUserRole from "./../middlewares/TenantUserRole";
import TenantIdentifierInterceptor from "./../middlewares/TenantIdentifierInterceptor";
import authRoutes from "./Auth";

export const Routes = app => {
  app.get("/health", HelloWorld);
  app.get("/public/company/check/:key", companyCheckAPI);
  app.use(
    "/api/users",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    userRoutes
  );
  app.use(
    "/api/companies",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    companyRoutes
  );
  app.use(
    "/api/tasks",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    taskRoutes
  );
  app.use(
    "/api/projects",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    projectRoutes
  );
  app.use(
    "/api/boards",
    app.oauth.authenticate(),
    TenantIdentifierInterceptor,
    UserInfo,
    TenantUserRole,
    boardRoutes
  );
  app.use("/api/tenant", app.oauth.authenticate(), UserInfo, tenantRoutes);
  app.use("/api/login", authRoutes);
  app.use(
    "/service/chat",
    ServiceAuthMiddleware,
    ServiceTenantIdentifier,
    chatServiceRoutes
  );
};

export default Routes;
