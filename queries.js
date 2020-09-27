const { gql } = require('graphql-request')

const queryProjectIssues = gql`
  query getIssues($organization: String!, $repository: String!) {
    organization(login:$organization){
      repository(name:$repository) {
        projects(first:10,states:OPEN,orderBy:{field:CREATED_AT,direction:DESC}) {
          edges {
            node {
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
                              number
                              url
                              title
                              labels(first:4) {
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

module.exports = {
  queryProjectIssues
}