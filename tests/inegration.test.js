const fs = require("fs")
const domTesting = require('@testing-library/dom')
const { clear } = require("console")
require('@testing-library/jest-dom')
const userEvent = require("@testing-library/user-event").default

function initDomFromFiles(htmlPath, jsPath) {
	const html = fs.readFileSync(htmlPath, 'utf8')
	document.open()
	document.write(html)
	document.close()
	jest.isolateModules(function() {
		require(jsPath)
	})
}

// Mocking the alert 
const mockAlert = jest.fn();
global.alert = mockAlert;



describe("Adding values in the chart builder", () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    window.localStorage.clear()
  });

  test("Verify functionality for adding new X and Y value input feilds", async () => {
    // Arrange
    // Get the add X Y values button 
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' }); 

    // Act
    // Simulate a user click on the "add XY values" button
    await userEvent.click(addButton);


    // Assert
    // Find all input fields for X and Y values
    const xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    const yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    // Endsure that that their are two input pair for X and Y
    expect(xValueInputs.length).toBe(2); 
    expect(yValueInputs.length).toBe(2); 
  });
  
  test("Verify that adding input feilds presevese previous feilds entering data in newly added input fields", async () => {
    // Arrange
    // Fetch the add values button
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    // Fetch all existing X and Y avalues feilds in the document
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    

    // Act
    // Enter values into the first X and Y pairs
    await userEvent.type(xValueInputs[0], '100');
    await userEvent.type(yValueInputs[0], '200');
    await userEvent.click(addButton);

    // Assert
    // Re-fetch all X and Y input feilds after adding new feilds
    xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    // Verifyt that the first X and Y value input field still contains 100
    expect(xValueInputs[0].value).toBe('100');
    expect(yValueInputs[0].value).toBe('200');
    expect(xValueInputs.length).toBe(2); 
    expect(yValueInputs.length).toBe(2); 
  });

  test("verifying ability to enter multiple sets of data in input fields", async () => {
    // Arrange
    // Fetch the add values button and simulate click to add values
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    await userEvent.click(addButton);
    // Fetch all existing X and Y value input feilds
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    

    // Act
    // Enter data into the first and second input feilds
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');

    // Assert
    // Re-fetch all X and Y value input fields after data entry
    xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    // Verify data entered into the input feilds remains in data feild
    expect(xValueInputs[0].value).toBe('400');
    expect(yValueInputs[0].value).toBe('300');
    expect(xValueInputs[1].value).toBe('200');
    expect(yValueInputs[1].value).toBe('100');
    expect(xValueInputs.length).toBe(2); 
    expect(yValueInputs.length).toBe(2); 
  });

});

describe("Alerts displayed for missing chart data", () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    window.localStorage.clear()
    
    // Assign the mock function to replace the global alert
    mockAlert.mockReset();
    global.alert = mockAlert;
  });
  
  test("Alert displayed when absolutly no data is provided", async () => {
    // Arrange
    // find the generate chart button 
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });

    // Act
    // Click the button without providing any data
    await userEvent.click(generateChartButton);

    // Assert
    // Verify that alert is displayed
    expect(mockAlert).toHaveBeenCalledWith('Error: No data specified!');
  });

  test("Alert displayed when no x y data provided", async () => {
    // Arrange
    // Get nessart elements for chart generation and label entry
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');


    // Act 
    // Enter labels and attemp to generate the chart without XY data
    await userEvent.click(generateChartButton);
    await userEvent.click(generateChartButton);
    await userEvent.type(xLabelInput, 'Your x-input text');
    await userEvent.type(yLabelInput, 'Your y-input text');


    // Assert 
    // Verify that labels are entered and alert is displayed
    expect(xLabelInput.value).toBe('Your x-input text');
    expect(yLabelInput.value).toBe('Your y-input text');
    expect(mockAlert).toHaveBeenCalledWith('Error: No data specified!');
  });

  test("Alert displayed when labels are missing", async () => {
    // Arrange
    // Setup with XY input feilds without label 
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    await userEvent.click(addButton);
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });


    // Act
    // Input data and attempt to generate the chart without labels
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');
    await userEvent.click(generateChartButton);


    // Assert
    // Verify no labels are provided and the expected alert is shown
    expect(xLabelInput.value).toBe('');
    expect(yLabelInput.value).toBe('');
    expect(mockAlert).toHaveBeenCalledWith('Error: Must specify a label for both X and Y!');
  });

});

describe("Clearing chart data", () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    window.localStorage.clear()
    
  });

  test("Clear button clears x y values", async () => {
    // Arrange:
    // Get the button for adding input fields and add two sets of X and Y input fields
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    for (let i = 0; i < 2; i++){
      await userEvent.click(addButton);
    }
    // Get all X and Y value input fields and the clear button
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    

    // Act: 
    // Enter data into three sets of X and Y input fields
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');
    await userEvent.type(xValueInputs[2], '500');
    await userEvent.type(yValueInputs[2], '600');
    // Click the clear button
    await userEvent.click(clearButton);

    const updatedXValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    const updatedYValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });

    // Assert:
    // Verify that the input fields are cleared and only one set remains
    expect(updatedXValueInputs[0].value).toBe('');
    expect(updatedYValueInputs[0].value).toBe('');
    expect(updatedXValueInputs).toHaveLength(1);
    expect(updatedYValueInputs).toHaveLength(1);
  });

  test("Clear button clears labels values", async () => {
    // Arrange:
    // Get the input fields for X and Y labels and the clear button
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    
    // Act:  
    // Enter text into the label input fields
    await userEvent.type(xLabelInput, 'x-label text');
    await userEvent.type(yLabelInput, 'y-label text');
     // Click the clear button
    await userEvent.click(clearButton);
    
 
    // Assert:
    // Verify that label input fields are cleared
    const updated_xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const updated_yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    expect(updated_xLabelInput.value).toBe('');
    expect(updated_yLabelInput.value).toBe('');
  });


  test("Clear button clears title", async () => {
    // Arrange:
    // Get the input field for chart title and the clear button
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    const chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });

    // Act: 
    // Enter text into the chart title input field
    await userEvent.type(chartTitleInput, 'Some chart title');
    await userEvent.click(clearButton);

  
    // Assert:
    // Verify that chart title input field is cleared
    const updated_chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });
    expect(updated_chartTitleInput.value).toBe('');
    
  });

  test("Clear button clears color", async () => {
    // Arrange:
    // Get the input field for chart color and the clear button
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    const colorInput = document.getElementById('chart-color-input');

    // Act: 
    // Enter new color into the chart color input field
    await domTesting.fireEvent.input(colorInput, {target: {value: "#333333"}});
    expect(colorInput.value).toBe("#333333"); // just to make sure it is actually changing
    await userEvent.click(clearButton);

  
    // Assert:
    // Verify that chart color input field is cleared, and returned to defualt
    const updated_colorInput = document.getElementById('chart-color-input');
    expect(updated_colorInput.value).toBe('#ff4500');
    
  });

  test("Clear button clears all chart data", async () => {
    // Arrange:
    // Get necessary elements including input fields, labels, and the clear button
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });

    // Add some data
    for (let i = 0; i < 2; i++){
        await userEvent.click(addButton);
    }
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');
    await userEvent.type(xValueInputs[2], '500');
    await userEvent.type(yValueInputs[2], '600');

    // Act:
    // Enter text into input fields and click the clear button
    await userEvent.type(xLabelInput, 'x-label text');
    await userEvent.type(yLabelInput, 'y-label text');
    await userEvent.type(chartTitleInput, 'Some chart title');
    await userEvent.click(clearButton);

    // Assert:
    // Verify that all data including input fields, labels, and chart title are cleared
    const updatedXValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    const updatedYValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    const updated_xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const updated_yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const updated_chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });

    expect(updatedXValueInputs[0].value).toBe('');
    expect(updatedYValueInputs[0].value).toBe('');
    expect(updatedXValueInputs).toHaveLength(1);
    expect(updatedYValueInputs).toHaveLength(1);
    expect(updated_xLabelInput.value).toBe('');
    expect(updated_yLabelInput.value).toBe('');
    expect(updated_chartTitleInput.value).toBe('');
});


});

// describe("Data correcttly sent to chart generation function", () => {
//   beforeEach(() => {
//     // Initialize DOM from HTML before each test case
//     initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
//     const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
//     clearButton.click();
//   });

//   test("Chart data integration test", async () => {
//     // Aquire
//     const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
//     const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
//     const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
//     const chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });
//     const generateButton = domTesting.getByRole(document.body, 'button', { name: /Generate chart/ });
    

//     // Act
//     for (let i = 0; i < 2; i++){
//       await userEvent.click(addButton);
//     }
//     let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
//     let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
//     await userEvent.type(xValueInputs[0], '400');
//     await userEvent.type(yValueInputs[0], '300');
//     await userEvent.type(xValueInputs[1], '200');
//     await userEvent.type(yValueInputs[1], '100');
//     await userEvent.type(xValueInputs[2], '500');
//     await userEvent.type(yValueInputs[2], '600');
//     await userEvent.type(xLabelInput, 'x-label text');
//     await userEvent.type(yLabelInput, 'y-label text');
//     await userEvent.type(chartTitleInput, 'Some chart title');
//     await userEvent.click(generateButton);


//     // Assert
//   });
  
//   testing git hub branch commit stuff so maybe dont mess up 
// });
