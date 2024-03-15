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

// Mocking the alert method
const mockAlert = jest.fn();
global.alert = mockAlert;


describe("Adding values in the chart builder", () => {
  beforeEach(() => {
  // Initialize DOM from HTML before each test case
  initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
  const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
  clearButton.click();
  });

  test("Verify functionality for adding new X and Y value input feilds", async () => {
    // Arrange
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });

    // Act
    await userEvent.click(addButton);

    // Assert
    const xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    const yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    expect(xValueInputs.length).toBe(2); 
    expect(yValueInputs.length).toBe(2); 
  });
  
  test("Verify that adding input feilds presevese previous feilds entering data in newly added input fields", async () => {
    // Arrange
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });

    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    

    // Act
    await userEvent.type(xValueInputs[0], '100');
    await userEvent.type(yValueInputs[0], '200');
    await userEvent.click(addButton);

    // Assert
    xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    expect(xValueInputs[0].value).toBe('100');
    expect(yValueInputs[0].value).toBe('200');
    expect(xValueInputs.length).toBe(2); 
    expect(yValueInputs.length).toBe(2); 
  });

  test("verifying ability to enter multiple sets of data in input fields", async () => {
    // Arrange
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    await userEvent.click(addButton);
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    

    // Act
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');

    // Assert
    xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
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
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    clearButton.click();
    
    // Assign the mock function to replace the global alert
    mockAlert.mockReset();
    global.alert = mockAlert;
  });
  
  test("Alert displayed when absolutly no data is provided", async () => {
    // Arrange
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });

    // Act: Click the button without providing any data
    await userEvent.click(generateChartButton);

    // Assert: Verify that alert is displayed
    expect(mockAlert).toHaveBeenCalledWith('Error: No data specified!');
  });

  test("Alert displayed when no x y data provided", async () => {
    // Arrange
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');


    // Act: Click the button without supplying axis labels
    await userEvent.click(generateChartButton);
    await userEvent.click(generateChartButton);
    await userEvent.type(xLabelInput, 'Your x-input text');
    await userEvent.type(yLabelInput, 'Your y-input text');


    // Assert: Verify that alert is displayed
    expect(xLabelInput.value).toBe('Your x-input text');
    expect(yLabelInput.value).toBe('Your y-input text');
    expect(mockAlert).toHaveBeenCalledWith('Error: No data specified!');
  });

  test("Alert displayed when labels are missing", async () => {
    // Arrange
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    await userEvent.click(addButton);
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const generateChartButton = domTesting.getByRole(document.body, 'button', { name: 'Generate chart' });


    // Act: Click the button without supplying axis labels
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');
    await userEvent.click(generateChartButton);


    // Assert: Verify that alert is displayed
    expect(xLabelInput.value).toBe('');
    expect(yLabelInput.value).toBe('');
    expect(mockAlert).toHaveBeenCalledWith('Error: Must specify a label for both X and Y!');
  });

});

describe("Clearing chart data", () => {
  beforeEach(() => {
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    clearButton.click();
  });

  test("Clear button clears x y values", async () => {
    // Arrange:
    const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
    for (let i = 0; i < 2; i++){
      await userEvent.click(addButton);
    }
    let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    

    // Act: 
    await userEvent.type(xValueInputs[0], '400');
    await userEvent.type(yValueInputs[0], '300');
    await userEvent.type(xValueInputs[1], '200');
    await userEvent.type(yValueInputs[1], '100');
    await userEvent.type(xValueInputs[2], '500');
    await userEvent.type(yValueInputs[2], '600');
    await userEvent.click(clearButton);

    const updatedXValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
    const updatedYValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });

    // Assert:
    expect(updatedXValueInputs[0].value).toBe('');
    expect(updatedYValueInputs[0].value).toBe('');
    expect(updatedXValueInputs).toHaveLength(1);
    expect(updatedYValueInputs).toHaveLength(1);
  });

  test("Clear button clears labels values", async () => {
    // Arrange:
    const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    
    // Act: 
    await userEvent.type(xLabelInput, 'x-label text');
    await userEvent.type(yLabelInput, 'y-label text');
    await userEvent.click(clearButton);
    const updated_xLabelInput = domTesting.getByLabelText(document.body, 'X label');
    const updated_yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
 
    // Assert:
    expect(updated_xLabelInput.value).toBe('');
    expect(updated_yLabelInput.value).toBe('');
  });


  test("Clear button clears title", async () => {
    // Arrange:
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    const chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });

    // Act: 
    await userEvent.type(chartTitleInput, 'Some chart title');
    await userEvent.click(clearButton);

  
    // Assert:
    const updated_chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });
    expect(updated_chartTitleInput.value).toBe('');
    
  });

  test("Clear button clears all chart data", async () => {
    // Arrange:
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
    await userEvent.type(xLabelInput, 'x-label text');
    await userEvent.type(yLabelInput, 'y-label text');
    await userEvent.type(chartTitleInput, 'Some chart title');
    await userEvent.click(clearButton);

    // Assert:
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

describe("Data correcttly sent to chart generation function", () => {
  beforeEach(() => {
    // Initialize DOM from HTML before each test case
    initDomFromFiles(`${__dirname}/../src/scatter/scatter.html`, `${__dirname}/../src/scatter/scatter.js`);  
    const clearButton = domTesting.getByRole(document.body, 'button', { name: /Clear chart data/ });
    clearButton.click();
  });

  // test("Chart data integration test", async () => {
  //   // Aquire
  //   const addButton = domTesting.getByRole(document.body, 'button', { name: '+' });
  //   const xLabelInput = domTesting.getByLabelText(document.body, 'X label');
  //   const yLabelInput = domTesting.getByLabelText(document.body, 'Y label');
  //   const chartTitleInput = domTesting.getByRole(document.body, 'textbox', { name: /Chart title/ });
  //   const generateButton = domTesting.getByRole(document.body, 'button', { name: /Generate chart/ });
    

  //   // Act
  //   for (let i = 0; i < 2; i++){
  //     await userEvent.click(addButton);
  //   }
  //   let xValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /X/ });
  //   let yValueInputs = domTesting.queryAllByRole(document.body, 'spinbutton', { name: /Y/ });
  //   await userEvent.type(xValueInputs[0], '400');
  //   await userEvent.type(yValueInputs[0], '300');
  //   await userEvent.type(xValueInputs[1], '200');
  //   await userEvent.type(yValueInputs[1], '100');
  //   await userEvent.type(xValueInputs[2], '500');
  //   await userEvent.type(yValueInputs[2], '600');
  //   await userEvent.type(xLabelInput, 'x-label text');
  //   await userEvent.type(yLabelInput, 'y-label text');
  //   await userEvent.type(chartTitleInput, 'Some chart title');
  //   await userEvent.click(generateButton);


  //   // Assert
  // });
  
  
});
