describe('visiting/gallery', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080/')
  })
})

describe('Line Chart Builder', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/line.html');
    
      // Filling in label inputs
      cy.get('#chart-title-input').type('Cats vs. Dogs');
      cy.get('#chart-color-input').invoke('val', '#ff0000').trigger('input');
      cy.get('#x-label-input').type('Cats');
      cy.get('#y-label-input').type('Dogs');
  
      // Add values
      for(let i = 0; i < 5; i++) {
        cy.get('#add-values-btn').click();
      }
      cy.get('#x-y-data-grid').find('input').eq(2).type('1');
      cy.get('#x-y-data-grid').find('input').eq(3).type('3');
      cy.get('#x-y-data-grid').find('input').eq(4).type('2');
      cy.get('#x-y-data-grid').find('input').eq(5).type('7');
      cy.get('#x-y-data-grid').find('input').eq(6).type('3');
      cy.get('#x-y-data-grid').find('input').eq(7).type('15');
      cy.get('#x-y-data-grid').find('input').eq(8).type('4');
      cy.get('#x-y-data-grid').find('input').eq(9).type('25');
      cy.get('#x-y-data-grid').find('input').eq(10).type('5');
      cy.get('#x-y-data-grid').find('input').eq(11).type('40');
      cy.get('#x-y-data-grid').find('input').eq(12).click();
  });

  it('clears chart correctly', () => {
    
    cy.get('#generate-chart-btn').click();
    cy.get('#clear-chart-btn').click();

    // Assertion
    cy.get('#chart-title-input').should('have.value', '');
    cy.get('#x-y-data-grid').find('input').should('have.length', 4); // cleared
  });

  it('generation', () => {

    // Assertion
    cy.get('#generate-chart-btn').click();
    cy.get('#chart-display').should('not.be.empty');

    cy.get('#x-y-data-grid').find('input').should('have.length', 14);

    // cy.get('#save-chart-btn').click();
    // cy.visit('http://localhost:8080/');
  });

  it('data', () => {

    // Assertion
    cy.visit('http://localhost:8080/scatter.html');
    cy.get('#x-y-data-grid').find('input').should('have.length', 14);
    cy.visit('http://localhost:8080/bar.html');
    cy.get('#x-y-data-grid').find('input').should('have.length', 14);
    cy.visit('http://localhost:8080/line.html');
    cy.get('#x-y-data-grid').find('input').should('have.length', 14);
  });

  it('saves', () => {

    // Assertion
    cy.get('#generate-chart-btn').click();
    cy.get('#chart-display').should('not.be.empty');

    cy.get('#save-chart-btn').click();
    cy.visit('http://localhost:8080/');
  });

  it('upload saves', () => {

    cy.get('#generate-chart-btn').click();
    cy.get('#chart-display').should('not.be.empty');

    cy.get('#save-chart-btn').click();
    cy.visit('http://localhost:8080/');


    // Assertion
    cy.get('gallery').find('#chart-card').click();
    cy.get('#chart-display').should('not.be.empty');
    cy.get('#x-y-data-grid').find('input').should('have.length', 14);
  });

});
