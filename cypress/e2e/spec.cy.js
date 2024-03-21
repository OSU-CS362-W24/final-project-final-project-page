import '@testing-library/cypress/add-commands';

describe('initial', () => {
  it('passes', () => {

    // Initial test to ensure the server and cypress are working as intended
    cy.visit('http://localhost:8080/')
  })
})

describe('Chart Builder', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/line.html');
    
    // Filling in label inputs
    cy.findByLabelText('Chart title').type('Cats vs. Dogs');
    cy.findByLabelText('Chart color').invoke('val', '#ff0000').trigger('input');
    cy.findByLabelText('X label').type('Cats');
    cy.findByLabelText('Y label').type('Dogs');

    // Adding Coordinate boxes
    for(let i = 0; i < 5; i++) {
      cy.contains('button', '+').click();
    }

    // Adding Values based off the videos
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

  it('generates chart correctly', () => {
    // Tests by clicking the generate chart button and ensuring that all the texts boxes are not empty and that all input boxes exist
    // Test also ensures the display element contains data.
    
    // Assertion
    cy.contains('button', 'Generate chart').click();
    cy.findByLabelText('Chart title').should('have.value', 'Cats vs. Dogs');
    cy.get('#chart-display').should('not.be.empty');
    cy.findAllByRole('spinbutton').should('have.length', 12);
  });
    
  it('clears chart correctly', () => {
    // Tests that the chart is fully cleared by ensuring only the default elements exist and are empty

    // Generates and clears chart
    cy.contains('button', 'Generate chart').click();
    cy.contains('button', 'Clear chart').click();

    // Assertion
    cy.findByLabelText('Chart title').should('have.value', '');
    cy.findByLabelText('X label').should('have.value', '');
    cy.findByLabelText('Y label').should('have.value', '');
    cy.findByLabelText('X').should('have.value', '');
    cy.findByLabelText('Y').should('have.value', '');

    cy.findAllByRole('textbox').should('have.length', 3);
    cy.findAllByRole('spinbutton').should('have.length', 2);
  });

    it('retains data across other graphs', () => {
    // Tests that data remains across selecting other graphs by ensuring what was input by user is still there


    // Assertion
    // Scatter
      cy.visit('http://localhost:8080/scatter.html');
      cy.findByLabelText('Chart title').should('have.value', 'Cats vs. Dogs');
      cy.findByLabelText('X label').should('have.value', 'Cats');
      cy.findByLabelText('Y label').should('have.value', 'Dogs');
      cy.findAllByRole('spinbutton').should('have.length', 12);
    
    // Bar
      cy.visit('http://localhost:8080/bar.html');
      cy.findByLabelText('Chart title').should('have.value', 'Cats vs. Dogs');
      cy.findByLabelText('X label').should('have.value', 'Cats');
      cy.findByLabelText('Y label').should('have.value', 'Dogs');
      cy.findAllByRole('spinbutton').should('have.length', 6);
      cy.findAllByRole('textbox').should('have.length', 9);

    // Returns to line to show it also remained
      cy.visit('http://localhost:8080/line.html');
      cy.findByLabelText('Chart title').should('have.value', 'Cats vs. Dogs');
      cy.findByLabelText('X label').should('have.value', 'Cats');
      cy.findByLabelText('Y label').should('have.value', 'Dogs');
      cy.findAllByRole('spinbutton').should('have.length', 12);
    });




    it('ensures graph is saved and reuploaded', () => {

    //=============================NEED COMMENTS==================================

      // Assertion
      cy.contains('button', 'Generate chart').click();
      cy.get('#chart-display').should('not.be.empty');

      cy.contains('button', 'Save chart').click();
      cy.findByText('Gallery').click();



      cy.findByText('Cats vs. Dogs').click();
      cy.get('#chart-display').should('not.be.empty');
      cy.findAllByRole('spinbutton').should('have.length', 12);

    });

});
