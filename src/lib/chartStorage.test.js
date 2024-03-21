const chartStorage = require('./chartStorage');

beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
});

describe('saveChart()', () => {
    test('saving a chart with valid data', () => {
        // Arrange
        const chart = { title: 'Test Chart', xValues: [1, 2, 3], yValues: [1, 2, 3] };

        // Act
        chartStorage.saveChart(chart);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(1);
        expect(savedCharts[0]).toEqual(chart);
    });

    test('saving a chart with empty data', () => {
        // Arrange
        const chart = { title: '', xValues: [], yValues: [] };

        // Act
        chartStorage.saveChart(chart);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(1);
        expect(savedCharts[0]).toEqual(chart);
    });

    test('saving multiple charts and ensure they are stored separately', () => {
        // Arrange
        const chart1 = { title: 'Chart 1', xValues: [1, 2, 3], yValues: [1, 2, 3] };
        const chart2 = { title: 'Chart 2', xValues: [4, 5, 6], yValues: [4, 5, 6] };

        // Act
        chartStorage.saveChart(chart1);
        chartStorage.saveChart(chart2);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(2);
        expect(savedCharts[0]).toEqual(chart1);
        expect(savedCharts[1]).toEqual(chart2);
    });

    test('saving a chart with a long title', () => {
        // Arrange
        const longTitle = 'a'.repeat(100);
        const chart = { title: longTitle, xValues: [1, 2, 3], yValues: [1, 2, 3] };

        // Act
        chartStorage.saveChart(chart);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(1);
        expect(savedCharts[0]).toEqual(chart);
    });

    test('saving a chart with special characters in the data', () => {
        // Arrange
        const chart = { title: 'Special Chart', xValues: ['a', 'b', 'c'], yValues: ['@', '$', '%'] };

        // Act
        chartStorage.saveChart(chart);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(1);
        expect(savedCharts[0]).toEqual(chart);
    });

    test('saving a chart with a large amount of data', () => {
        // Arrange
        const xValues = Array.from({ length: 10000 }, (_, i) => i);
        const yValues = Array.from({ length: 10000 }, (_, i) => i * 2);
        const chart = { title: 'Large Data Chart', xValues, yValues };

        // Act
        chartStorage.saveChart(chart);

        // Assert
        const savedCharts = JSON.parse(localStorage.getItem('savedCharts'));
        expect(savedCharts.length).toBe(1);
        expect(savedCharts[0]).toEqual(chart);
    });
});

describe('loadAllSavedCharts()', () => {
    test('loading all saved charts when there are multiple charts present', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Chart 2', xValues: [4, 5, 6], yValues: [7, 8, 9] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(2);
        expect(loadedCharts).toEqual(charts);
    });

    test('loading all saved charts when there is one chart present', () => {
        // Arrange
        const chart = { title: 'Chart', xValues: [1, 2, 3], yValues: [4, 5, 6] };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(1);
        expect(loadedCharts[0]).toEqual(chart);
    });

    test('loading all saved charts when there are no charts present', () => {
        // Arrange
        // N/A this is testing where no charts exist

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(0);
        expect(loadedCharts).toEqual([]);
    });

    test('loading charts with various data lengths', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Chart 2', xValues: [4, 5], yValues: [7, 8] },
            { title: 'Chart 3', xValues: [7], yValues: [10] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(3);
        expect(loadedCharts).toEqual(charts);
    });

    test('loading charts including one with empty data', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: '', xValues: [], yValues: [] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(2);
        expect(loadedCharts).toEqual(charts);
    });

    test('loading charts including one with a long title', () => {
        // Arrange
        const longTitle = 'a'.repeat(100);
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: longTitle, xValues: [4, 5, 6], yValues: [7, 8, 9] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(2);
        expect(loadedCharts).toEqual(charts);
    });

    test('loading charts including one with special characters in the data', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Special Chart', xValues: ['@', '#', '$'], yValues: ['%', '^', '&'] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(2);
        expect(loadedCharts).toEqual(charts);
    });

    test('loading charts including one with a large amount of data', () => {
        // Arrange
        const xValues = Array.from({ length: 10000 }, (_, i) => i);
        const yValues = Array.from({ length: 10000 }, (_, i) => i * 2);
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Large Data Chart', xValues, yValues }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedCharts = chartStorage.loadAllSavedCharts();

        // Assert
        expect(loadedCharts.length).toBe(2);
        expect(loadedCharts).toEqual(charts);
    });
});

describe('loadSavedChart()', () => {
    test('loading a specific chart by its ID', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Chart 2', xValues: [4, 5, 6], yValues: [7, 8, 9] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedChart = chartStorage.loadSavedChart(1);

        // Assert
        expect(loadedChart).toEqual(charts[1]);
    });

    test('loading a chart that does not exist', () => {
        // Arrange
        const charts = [
            { title: 'Chart 1', xValues: [1, 2, 3], yValues: [4, 5, 6] },
            { title: 'Chart 2', xValues: [4, 5, 6], yValues: [7, 8, 9] }
        ];
        localStorage.setItem('savedCharts', JSON.stringify(charts));

        // Act
        const loadedChart = chartStorage.loadSavedChart(2);

        // Assert
        expect(loadedChart).toEqual({});
    });

    test('loading a chart with valid data', () => {
        // Arrange
        const chart = { title: 'Chart', xValues: [1, 2, 3], yValues: [4, 5, 6] };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedChart = chartStorage.loadSavedChart(0);

        // Assert
        expect(loadedChart).toEqual(chart);
    });

    test('loading a chart with empty data', () => {
        // Arrange
        const chart = { title: '', xValues: [], yValues: [] };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedChart = chartStorage.loadSavedChart(0);

        // Assert
        expect(loadedChart).toEqual(chart);
    });

    test('loading a chart with a long title', () => {
        // Arrange
        const longTitle = 'a'.repeat(100);
        const chart = { title: longTitle, xValues: [1, 2, 3], yValues: [4, 5, 6] };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedChart = chartStorage.loadSavedChart(0);

        // Assert
        expect(loadedChart).toEqual(chart);
    });

    test('loading a chart with special characters in the data', () => {
        // Arrange
        const chart = { title: 'Special Chart', xValues: ['@', '#', '$'], yValues: ['%', '^', '&'] };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedChart = chartStorage.loadSavedChart(0);

        // Assert
        expect(loadedChart).toEqual(chart);
    });

    test('loading a chart with a large amount of data', () => {
        // Arrange
        const xValues = Array.from({ length: 10000 }, (_, i) => i);
        const yValues = Array.from({ length: 10000 }, (_, i) => i * 2);
        const chart = { title: 'Large Data Chart', xValues, yValues };
        localStorage.setItem('savedCharts', JSON.stringify([chart]));

        // Act
        const loadedChart = chartStorage.loadSavedChart(0);

        // Assert
        expect(loadedChart).toEqual(chart);
    });
});

describe('updateCurrentChartData()', () => {
    test('updating current chart data with valid data', () => {
        // Arrange
        const currentChartData = { title: 'Test Chart', xValues: [1, 2, 3], yValues: [4, 5, 6] };

        // Act
        chartStorage.updateCurrentChartData(currentChartData);

        // Assert
        const loadedChartData = JSON.parse(localStorage.getItem('currentChartData'));
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('updating current chart data with empty data', () => {
        // Arrange
        const currentChartData = { title: '', xValues: [], yValues: [] };

        // Act
        chartStorage.updateCurrentChartData(currentChartData);

        // Assert
        const loadedChartData = JSON.parse(localStorage.getItem('currentChartData'));
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('updating current chart data with a long title', () => {
        // Arrange
        const longTitle = 'a'.repeat(100);
        const currentChartData = { title: longTitle, xValues: [1, 2, 3], yValues: [4, 5, 6] };

        // Act
        chartStorage.updateCurrentChartData(currentChartData);

        // Assert
        const loadedChartData = JSON.parse(localStorage.getItem('currentChartData'));
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('updating current chart data with special characters in the data', () => {
        // Arrange
        const currentChartData = { title: 'Special Chart', xValues: ['@', '#', '$'], yValues: ['%', '^', '&'] };

        // Act
        chartStorage.updateCurrentChartData(currentChartData);

        // Assert
        const loadedChartData = JSON.parse(localStorage.getItem('currentChartData'));
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('updating current chart data with a large amount of data', () => {
        // Arrange
        const xValues = Array.from({ length: 10000 }, (_, i) => i);
        const yValues = Array.from({ length: 10000 }, (_, i) => i * 2);
        const currentChartData = { title: 'Large Data Chart', xValues, yValues };

        // Act
        chartStorage.updateCurrentChartData(currentChartData);

        // Assert
        const loadedChartData = JSON.parse(localStorage.getItem('currentChartData'));
        expect(loadedChartData).toEqual(currentChartData);
    });
});

describe('loadCurrentChartData()', () => {
    test('loading current chart data when data is available', () => {
        // Arrange
        const currentChartData = { title: 'Test Chart', xValues: [1, 2, 3], yValues: [4, 5, 6] };
        localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('loading current chart data when no data is available', () => {
        // Arrange
        // N/A testing for no available data

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual({});
    });

    test('loading current chart data with valid data', () => {
        // Arrange
        const currentChartData = { title: 'Test Chart', xValues: [1, 2, 3], yValues: [4, 5, 6] };
        localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('loading current chart data with empty data', () => {
        // Arrange
        const currentChartData = { title: '', xValues: [], yValues: [] };
        localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('loading current chart data with special characters', () => {
        // Arrange
        const currentChartData = { title: 'Special Chart', xValues: ['@', '#', '$'], yValues: ['%', '^', '&'] };
        localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual(currentChartData);
    });

    test('loading current chart data with a large amount of data', () => {
        // Arrange
        const xValues = Array.from({ length: 10000 }, (_, i) => i);
        const yValues = Array.from({ length: 10000 }, (_, i) => i * 2);
        const currentChartData = { title: 'Large Data Chart', xValues, yValues };
        localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

        // Act
        const loadedChartData = chartStorage.loadCurrentChartData();

        // Assert
        expect(loadedChartData).toEqual(currentChartData);
    });
});
