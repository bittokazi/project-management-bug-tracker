const dev = {
  API_BASE_URL: "pmbt.bitto.website",
  API_BASE_URL_PROTOCOL: "http://",
  subdomainMode: false,
  subdomainNumber: 0
};

const stage = {
  API_BASE_URL: "pmbt.bitto.website",
  API_BASE_URL_PROTOCOL: "http://",
  subdomainMode: true,
  subdomainNumber: 4
};

const prod = {
  API_BASE_URL: "pmbt-staging.herokuapp.com",
  API_BASE_URL_PROTOCOL: "https://",
  subdomainMode: false,
  subdomainNumber: 0
};

let config = {};

if (process.env.REACT_APP_STAGE === "production") {
  config = prod;
} else if (process.env.REACT_APP_STAGE === "staging") {
  config = stage;
} else {
  config = dev;
}

export default {
  ...config
};
