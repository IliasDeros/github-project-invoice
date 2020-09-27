require('dotenv').config()
const { gql } = require('graphql-request')

const {
  GITHUB_ORGANIZATION,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
} = process.env

const query = gql`
  query {
    organization(login:"${GITHUB_ORGANIZATION}"){
      repository(name:"${GITHUB_REPOSITORY}") {
        projects(first:10,states:OPEN,orderBy:{field:CREATED_AT,direction:DESC}) {
          edges {
            node {
              id
              name
              columns(first:5) {
                edges {
                  node {
                    name
                    cards(first:15) {
                      edges {
                        node {
                          content {
                            ...on Issue {
                              id
                              title
                              labels(first:2) {
                                edges {
                                  node {
                                    id
                                    name
                                    color
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

console.log({ query, GITHUB_TOKEN })