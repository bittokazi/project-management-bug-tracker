export default function TenantIdentifierInterceptor(req, res, next) {
  if (req.subdomains.length == 2 && req.subdomains[0] != "www") {
    req.tenant = {
      key: req.subdomains[1]
    };
  } else if (
    (req.subdomains.length == 1 &&
      req.subdomains[0] == "www" &&
      req.header("tenant") &&
      req.header("tenant") != "null" &&
      req.header("tenant") != "") ||
    (req.subdomains.length == 0 &&
      req.header("tenant") &&
      req.header("tenant") != "null" &&
      req.header("tenant") != "")
  ) {
    req.tenant = {
      key: req.header("tenant")
    };
  }
  console.log(req.header("tenant"));
  next();
}
