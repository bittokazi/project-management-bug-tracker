const dev = {
  API_BASE_URL: "localhost:5000",
  API_BASE_URL_PROTOCOL: "http://",
  CHAT_SERVER_URL: "http://localhost:5262",
  subdomainMode: false,
  subdomainNumber: 0,
};

const stage = {
  API_BASE_URL: "pmbt.bittokazi.com",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "https://chat-pmbt.bittokazi.com",
  subdomainMode: true,
  subdomainNumber: 4,
};

const prod = {
  API_BASE_URL: "pmbt-staging.herokuapp.com",
  API_BASE_URL_PROTOCOL: "https://",
  CHAT_SERVER_URL: "http://chat-pmbt.bitto.website",
  subdomainMode: false,
  subdomainNumber: 0,
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
  ...config,
};
