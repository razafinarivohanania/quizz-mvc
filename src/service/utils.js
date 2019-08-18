const fs = require('fs');

module.exports.File = {
    read: path => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error, data) => {
                if (error)
                    reject(error);
                else
                    resolve(`${data}`);
            });
        });
    }
};

module.exports.Path = {
    getLastPathName: path => {
        path = module.exports.Path.removeLastSlash(path);

        if (path.includes('/'))
            path = module.exports.String.substringAfter(path, '/', true);

        return path;
    },
    removeLastSlash: path => {
        return path.replace(/\/+$/, '');
    },
    removeFirstSlash: path => {
        return path.replace(/^\/+/, '');
    }
}

module.exports.String = {

    /**
    * Substring text before first/last occurence of search
    * 
    * @param {String} text
    * @param {String} search
    * @param {boolean} isLast
    * @returns {String} substring value
    */
    substringBefore: (text, search, isLast) => {
        const position = isLast ?
            text.lastIndexOf(search) :
            text.indexOf(search);

        return position < 0 ?
            text :
            text.substr(0, position);
    },

    /**
    * Substring text after first/last occurence of search
    * 
    * @param {String} text
    * @param {String} search
    * @returns {String} substring value
    */
    substringAfter: (text, search, isLast) => {
        const position = isLast ?
            text.lastIndexOf(search) :
            text.indexOf(search);

        return position < 0 ?
            '' :
            text.substring(position + search.length);
    }
}