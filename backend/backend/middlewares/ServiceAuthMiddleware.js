import Config from "./../config/Config";

export default function ServiceAuthMiddleware(req, res, next) {
  if (Config().SERVICE_AUTH_KEY != req.header("Authorization")) {
    return res.status(401).json({
      error: "Authorization Failed"
    });
  }
  next();
}
