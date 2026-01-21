describe('Sprint 3 – Admin Dashboard Filters', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/signin')

    cy.get('input').first().type('admin@gmail.com')
    cy.get('input').eq(1).type('1234')

    cy.contains('Sign In').click()
    cy.wait(3000)
  })

  it('Filters Top Performing Tutors (Highest ↔ Lowest)', () => {
    cy.contains('Top Performing Tutors').scrollIntoView()
    cy.wait(5000)
    cy.get('.sort-select')
      .first()
      .should('be.visible')
      .select('Lowest to Highest')

    cy.wait(5000)

    cy.get('.sort-select')
      .first()
      .select('Highest to Lowest')

    cy.get('.report-card')
      .first()
      .find('.list-item')
      .should('have.length.greaterThan', 0)
  })

  it('Filters Top Revenue Tutors (Highest ↔ Lowest)', () => {
    cy.contains('Top Revenue Tutors').scrollIntoView()

    cy.get('.sort-select')
      .eq(1)
      .select('Lowest to Highest')

    cy.wait(1000)

    cy.get('.sort-select')
      .eq(1)
      .select('Highest to Lowest')

    cy.get('.report-card')
      .eq(1)
      .find('.list-item')
      .should('have.length.greaterThan', 0)
  })

  it('Filters Most Active Students (Most ↔ Least Sessions)', () => {
    cy.contains('Most Active Students').scrollIntoView()

    cy.get('.sort-select')
      .eq(2)
      .select('Least Sessions')

    cy.wait(1000)

    cy.get('.sort-select')
      .eq(2)
      .select('Most Sessions')

    cy.get('.report-card')
      .eq(2)
      .find('.list-item')
      .should('have.length.greaterThan', 0)
  })

it('Filters Top Subjects by Revenue (Highest ↔ Lowest)', () => {
  cy.contains('Top Subjects by Revenue').scrollIntoView()

  cy.get('.sort-select')
    .eq(3)
    .select('Lowest to Highest')

  cy.wait(1000)

  cy.get('.sort-select')
    .eq(3)
    .select('Highest to Lowest')

  cy.get('.report-card')
    .eq(3)
    .find('.bar-item')
    .should('exist')
})

it('Displays Admin Workload section', () => {
    cy.contains('Admin Workload').should('be.visible')
  })

})