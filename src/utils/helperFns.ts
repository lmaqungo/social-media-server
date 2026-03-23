
function extractIds(objArray) {
    const arr = []; 
    objArray.forEach(element => {
        const values = Object.values(element)
        arr.push(values[0])
    })
    return arr; 
}

export default {
    extractIds
}