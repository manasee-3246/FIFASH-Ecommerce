const fallbackApiUrl = "http://localhost:7002";
const apiUrl = (process.env.REACT_APP_API_URL || fallbackApiUrl).replace(/\/+$/, "");

module.exports = {
    api: {
        API_URL: apiUrl,
    },
};
