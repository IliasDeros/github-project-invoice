require('dotenv').config()
const { GraphQLClient } = require('graphql-request')
const { queryProjectIssues } = require('./queries')
const { Headers } = require('cross-fetch')
const fs = require('fs')

// Workaround for graphql-request https://github.com/prisma-labs/graphql-request/issues/206
global.Headers = global.Headers || Headers;

const {
  GITHUB_ORGANIZATION: organization,
  GITHUB_REPOSITORY: repository,
  GITHUB_TOKEN,
} = process.env

// Initialize client
const githubGraphqlEndpoint = 'https://api.github.com/graphql'
const client = new GraphQLClient(githubGraphqlEndpoint, {
  headers: {
    authorization: `Bearer ${GITHUB_TOKEN}`
  }
})

// Generate CSV
const doneColumnName = 'Done'
const outputFilename = 'invoice_items.csv';
(async () => {
  const response = await client.request(queryProjectIssues, { 
    organization, 
    repository 
  })

  const projects = response.organization.repository.projects.edges
  const doneCards = projects.reduce((cards, project) => {
    const doneColumn = project.node.columns.edges
      .map(c => c.node)
      .find(c => c.name === doneColumnName)

    if (!doneColumn) {
      return cards
    }

    cards.push(...doneColumn.cards.edges.map(c => c.node.content))

    return cards
  }, [])

  const csv = [['NAME','HOURS']]
  doneCards
    .map(toCsvRowOrNull)
    .filter(row => row !== null)
    .forEach(row => csv.push(row))

  writeCsv(csv)
  console.log(`Generated ${csv.length - 1} invoice items. See ${outputFilename}`)
})()

function toCsvRowOrNull(card) {
  const noHourLabel = null
  const hourLabel = card.labels.edges
    .map(e => e.node.name)
    .find(name => name.match(/\d+h/))

  if (!hourLabel) {
    return noHourLabel
  }

  const hours = hourLabel.replace('h', '')

  const name = `${card.title} - [#${card.number}](${card.url})`
  return [name, hours]
}

function writeCsv(csv) {
  const formattedCsv = csv
    .map(row => row.join(','))
    .join('\n')
  fs.writeFileSync(outputFilename, formattedCsv, 'utf8')
}