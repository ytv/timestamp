module.exports = {

    // Returns the natural date of the unix timestamp
    getNaturalDate: function (timestamp) {
        var d = new Date();
        d.setTime(timestamp  * 1000);

        var mm = MONTH[d.getMonth()],
            dd = d.getDate(),
            yy = d.getFullYear();
        return mm + ' ' + dd + ', ' + yy;
    },

    // Parse string where the characters are not alphanumeric
    parse: function(string) {
        return _separateNumAndAlpha(_split(string));
    },

    // Returns unix timestamp of natural date
    getUnixDate: function(mm, dd, yy) {
        var d = new Date();
        d.setMonth(mm);
        d.setDate(dd);
        d.setYear(yy);
        return (d.getTime()/1000).toFixed(0);
    }
}

const MONTH = ['January',
             'February',
             'March',
             'April',
             'May',
             'June',
             'July',
             'August',
             'September',
             'October',
             'November',
             'December'],

    MONTH_ABBR = ['jan',
             'feb',
             'mar',
             'apr',
             'may',
             'jun',
             'jul',
             'aug',
             'sep',
             'oct',
             'nov',
             'dec'];


// Parse string where the characters are not alphanumeric
function _split(string) {
    var parsedStr = [],
        re = /[0-9a-zA-Z]/;
        pointer = 0;
    for(var i = 0; i < string.length; i++) {
        // console.log(i);
        if(!re.test(string[i])) {
            // console.log(i + ': not alphanumeric')
            if(i > pointer)
                parsedStr.push(string.slice(pointer, i));
            pointer = i + 1;
        }
        else {
            // console.log(i + ': alphanumeric')
            if(i === string.length - 1)
                parsedStr.push(string.slice(pointer));
        }
    }

    // Remove empty elements if they exist
    for(var i = 0; i < parsedStr.length; i++) {
        if(parsedStr[i].length === 0)
            parsedStr.splice(i, 1);
    };

    return parsedStr;
}

// Organize 'parsedStr' between numeric and alphabetic elements
function _separateNumAndAlpha(parsedStr) {
    var parsedAlpha = [];
    var parsedNum = [];
    for(var i = 0; i < parsedStr.length; i++) {

        // Element is numeric
        if(!isNaN(parsedStr[i]))
            parsedNum.push(Number(parsedStr[i]));
        else {
            var re = /[0-9]/;
            var numStart = parsedStr[i].search(re);

            // Element is alphabetic
            if(numStart === -1)
                parsedAlpha.push(parsedStr[i]);

            // Element is alphanumeric.  Separate the letters from numbers.
            else {
                var parsedElem = parsedStr[i];
                var pointer = 0,
                    alphaBoolAtPointer = isNaN(parsedElem[0]);

                for(var j = 1; j < parsedElem.length; j++) {
                    if(isNaN(parsedElem[j]) !== alphaBoolAtPointer) {
                        if(alphaBoolAtPointer === true)
                            parsedAlpha.push(parsedElem.slice(pointer, j));
                        else
                            parsedNum.push(Number(parsedElem.slice(pointer, j)));
                        pointer = j;
                        alphaBoolAtPointer = isNaN(parsedElem[j]);
                    }
                    if(j === parsedElem.length - 1) {
                        if(alphaBoolAtPointer === true)
                            parsedAlpha.push(parsedElem.slice(pointer));
                        else
                            parsedNum.push(Number(parsedElem.slice(pointer)));
                    }
                }
            }
        }
    }
    return _assignDate(parsedAlpha, parsedNum);
}

function _assignDate(alphaArr, numArr) {
    var mm, dd, yy;

    // Invalid date cases
    if(numArr.length === 0 || (alphaArr.length === 0 && numArr.length === 1))
        return Null;

    // Month will equal the first valid alphaArr element if it exists
    for(var i = 0; i < alphaArr.length; i++) {
        var elem = MONTH_ABBR.indexOf(alphaArr[i].slice(0,3).toLowerCase());
        if(elem > -1) {
            mm = MONTH[elem];
            break;
        }
    }

    // If month successfully assigned using alphaArr
    if(mm) {
        if(numArr.length >= 2) {
            var dateResult = _assignDateAndYear(mm, numArr[0], numArr[1]);
            if(dateResult) {
                dd = dateResult[0];
                yy = dateResult[1];
            } else return null;
        } else {
            yy = numArr[0];
            dd = 1;
        }
    // Assign month using numArr.  Assume first element of numArr is the month or year
    } else {
        if(_validMonth(numArr[0])) {
            mm = numArr[0];
            if(numArr.length === 2) {
                yy = numArr[1];
                dd = 1;
            } else {
                var dateResult = _assignDateAndYear(mm, numArr[1], numArr[2]);
                if(dateResult) {
                    dd = dateResult[0];
                    yy = dateResult[1];
                } else return null;
            }
        } else {
            yy = numArr[0];
            if(_validMonth(numArr[1])) {
                mm = numArr[1];
                dd = 1;
            } else
                return null;
            if(numArr.length >= 3) {
                if(numArr[2] >= 1 && numArr[2] <= _getMaxDate(mm))
                    dd = numArr[2];
            }
        }
    }

    // Format month and year
    var yy = _formatYear(Number(yy));

    if(isNaN(mm)) {
        var month = mm;
        mm = MONTH.indexOf(month);
    } else
        var month = _formatMonth(mm);

    if(yy) return {'month': mm,
                    'date': dd,
                    'year': yy,
                    'natural': month + ' ' + dd + ', ' + yy};
    else return null;
}


// Returns [date, year] or null
function _assignDateAndYear(month, a, b) {
    var maxDate = _getMaxDate(month);
    // if a is the date and b is the year
    if (a >= 1 && a <= maxDate) {
        return [a, b]
    // if b is the year and a is the date
    } else if (b >= 1 && b <= maxDate) {
        return [b, a]
    } else
        return null;
}

function _validMonth(num) {
    return num <= 12;
}

function _getMaxDate(month) {
    return 31;
}

function _formatMonth(month) {
    return MONTH[month-1];
}

function _formatYear(year) {
    if(year < 50)
        return 2000 + year;
    else if (year < 100)
        return 1900 + year;
    else if (year < 10000)
        return year;
    else
        return null;
}
