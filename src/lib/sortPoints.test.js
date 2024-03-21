//verify that sortPoints correctly sorts a valid array of points.

const sortPoints = require('./sortPoints')

test('sortPoints correctly sorts list of (x,y) ints', function() {
        //arrange
        const array = [{x:12, y:3}, {x:4, y:7}, {x:6, y:12}];//input array
        const expectedResult = [{x:4, y:7},{x:6, y:12},{x:12, y:3}];//what the array should be after sorting

        //act
        const result = sortPoints(array);//call function with array param

        //assert
        expect(result).toStrictEqual(expectedResult)//expect the result to be equal to the expected result
})


test('sortPoints correctly sorts list of (x,y) ints with larger array and different array elements', function() {
        //arrange
        const array = [{x:34, y:23421}, {x:100, y:456456}, {x:6, y:46}, {x:21, y:33}, {x:75, y:44}];//input array
        const expectedResult = [{ x: 6, y: 46 }, { x: 21, y: 33 }, { x: 34, y: 23421 }, { x: 75, y: 44 }, { x: 100, y: 456456 }];//what the array should be after sorting

        //act
        const result = sortPoints(array);//call function with array param

        //assert
        expect(result).toStrictEqual(expectedResult)//expect the result to be equal to the expected result
})
