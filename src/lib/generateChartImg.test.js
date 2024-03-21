const generateChartImg = require('./generateChartImg');

describe('generateChartImg()', () => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            blob: () => Promise.resolve(new Blob())
        })
    );
    // Mock URL.createObjectURL function
    global.URL.createObjectURL = jest.fn(blob => "mockURL");


    test('generate a valid line chart image', async () => {
        // Arrange
        const info = {
            type: "line",
            data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            xLabel: "x-label",
            yLabel: "y-label",
            title: "Line Chart",
            color: "blue"
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel, info.title, info.color);

        // Assert
        expect(URL).toMatch("mockURL");
    });

    test('generate a valid scatter chart image', async () => {
        // Arrange
        const info = {
            type: "scatter",
            data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            xLabel: "x-label",
            yLabel: "y-label",
            title: "Scatter Chart",
            color: "blue"
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel, info.title, info.color);

        // Assert
        expect(URL).toMatch("mockURL");
    });
    
    test('generate a valid bar chart image', async () => {
        // Arrange
        const info = {
            type: "bar",
            data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            xLabel: "x-label",
            yLabel: "y-label",
            title: "Bar Chart",
            color: "blue"
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel, info.title, info.color);

        // Assert
        expect(URL).toMatch("mockURL");
    });
    
    test('generate a chart without optional inputs', async () => {
        // Arrange
        const info = {
            type: "line",
            data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            xLabel: "x-label",
            yLabel: "y-label",
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel);

        // Assert
        expect(URL).toMatch("mockURL");
    });
    
    test('generate a chart with hex color', async () => {
        // Arrange
        const info = {
            type: "line",
            data: [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}],
            xLabel: "x-label",
            yLabel: "y-label",
            title: "Color Chart",
            color: "#3F6DD2"
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel, info.title, info.color);

        // Assert
        expect(URL).toMatch("mockURL");
    });
    
    test('generate a chart with empty data', async () => {
        // Arrange
        const info = {
            type: "line",
            data: [],
            xLabel: "x-label",
            yLabel: "y-label",
            title: "Dataless Chart",
            color: "blue"
        };

        // Act
        const URL = await generateChartImg(info.type, info.data, info.xLabel, info.yLabel, info.title, info.color);

        // Assert
        expect(URL).toMatch("mockURL");
    });
});