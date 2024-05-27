class Error {
    constructor(message) {
        this.message = message;
        this.name = 'Error';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function isValidDate(dateString) {
    const regExp = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!regExp.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}

function readFileJSON(json) {
    let user;

    try {
        user = JSON.parse(json);
    } catch (e) {
        throw new SyntaxError('Invalid JSON format');
    }

    user.forEach(user => {
        if (!isValidDate(user.ns)) {
            throw new ValidationError('Invalid date of birth');
        }
    });

    return user;
}

const jsonUrl = 'data.json';

fetch(jsonUrl)
    .then(response => response.json())
    .then(json => {
        try {
            const jsonString = JSON.stringify(json);
            const user = readFileJSON(jsonString);
            console.log('User data is valid:', user);
        } catch (err) {
            if (err instanceof ValidationError) {
                console.error('Invalid data: ' + err.message);
            } else if (err instanceof SyntaxError) {
                console.error('Syntax error: ' + err.message);
            } else {
                console.error('Error: ' + err.message);
            }
        }
    })
    .catch(error => console.error('Error fetching JSON:', error));