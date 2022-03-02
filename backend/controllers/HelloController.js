export const HelloWorld = (req, res) => {
  // console.log(req.subdomains);
  return res.status(200).json({
    host: req.hostname
  });
};
