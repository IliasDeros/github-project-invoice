require('dotenv').config()
const { Headers } = require('cross-fetch')
const { GraphQLClient } = require('graphql-request')
const { queryProjectIssues } = require('./queries')

// Workaround for graphql-request https://github.com/prisma-labs/graphql-request/issues/206
global.Headers = global.Headers || Headers;

const {
  GITHUB_ORGANIZATION: organization,
  GITHUB_REPOSITORY: repository,
  GITHUB_TOKEN
} = process.env

// Initialize client
const githubGraphqlEndpoint = 'https://api.github.com/graphql'
const client = new GraphQLClient(githubGraphqlEndpoint, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`
  }
})

const getIssues = () => client.request(queryProjectIssues, { 
  organization, 
  repository 
})

module.exports = { getIssues }