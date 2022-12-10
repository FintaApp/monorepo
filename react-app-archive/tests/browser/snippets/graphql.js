const axios = require("axios");

const env = process.env.ENVIRONMENT_NAME || 'dev';
const config = {
  production: {
    url: process.env.PRODUCTION_NHOST_URL,
    secret: process.env.PRODUCTION_HASURA_ADMIN_SECRET
  },
  preview: {
    url: process.env.PREVIEW_NHOST_URL,
    secret: process.env.PREVIEW_HASURA_ADMIN_SECRET
  },
  dev: {
    url: process.env.DEV_NHOST_URL,
    secret: process.env.DEV_HASURA_ADMIN_SECRET
  }
}

const client = axios.create({
  baseURL: config[env].url + '/v1/graphql',
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": config[env].secret
  }
});

module.exports = {
  getUser: userId => 
    client.post('', {
      query: `query GetUser {
          user(id: "${userId}") {
            id
          }
        }`
    }).then(response => response.data.data),
  deleteUser: userId => 
    client.post('', {
      query: `mutation DeleteUser {
        deleteUser(id: "${userId}") {
          id
        }
      }`
    })
}