export default function lookup(languagesObj) {
    return function(languageName) {
        const normalizedString = languageName.toLowerCase()
        const matchingKey = Object.keys(languagesObj).find(
          key => key.toLowerCase() === normalizedString
        )
        return matchingKey ? languagesObj[matchingKey].color : '#FFF'
    }
}

// closure function usage:

// takes in large object once
// allows lookup for mutiple components
// way more efficient, generates less memory garbage
// it also works in a case-insensitive way


// const getColorCode = lookup(languages); 
// console.log(getColorCode('yaml'));   // Output: #cb171e
// console.log(getColorCode('unknown')); // Output: #FFF