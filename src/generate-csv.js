require('dotenv').config()
const { getIssues } = require('./githubAPI')

const doneColumnName = 'Done'
const generateCsv = async () => {
  const response = await getIssues()
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

  return csv
}

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

module.exports = { generateCsv }