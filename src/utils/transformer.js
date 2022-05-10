const transformer = require('enketo-transformer');
const fs = require('fs');

const path = process.argv[2];
const xform = fs.readFileSync(path);

transformer
    .transform({
        xform: xform,
    })
    .then(function (result) {
        console.log(JSON.stringify(result, null, 2));
    });
