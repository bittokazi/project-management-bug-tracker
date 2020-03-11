import React from "react";
import AuthStore from "./../../services/AuthStore";
import { useHistory } from "react-router-dom";

export default function Logout() {
  let history = useHistory();
  AuthStore().saveTenantKey(null);
  AuthStore().saveClientCredentials(null);
  AuthStore().saveOauthToken(null);
  history.push("/");
  return <div></div>;
}
