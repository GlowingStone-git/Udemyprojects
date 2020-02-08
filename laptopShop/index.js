const fs = require('fs');
const http = require('http');
const url = require('url');


const jsonData = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
   
    const pathName = url.parse(req.url, true).pathname; //getting url
    const id = url.parse(req.url, true).query.id;  //part of url with id


    if (pathName === '/products' || pathName === '/') {
    
        //shop overview
        res.writeHead(200, {'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/tmp-overview.html`, 'utf-8', (err,data) => {

            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/tmp-shopitem.html`, 'utf-8', (err,data) => {

                const itemOutput = laptopData.map(el => replaceTmp(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%ITEM%}', itemOutput);

                res.end(overviewOutput);
    
            });
        });


    } else if (pathName === '/laptop' && id < laptopData.length) {
        //laptop pages
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/tmp-laptop.html`, 'utf-8', (err,data) => {

            const lap = laptopData[id];
            const output = replaceTmp(data, lap);

            res.end(output);

        });

    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        //img requests
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {

            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);

        })

    } else {
        //indefined url
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('URL not bound'); 

    }

});

server.listen(1337, '127.0.0.1', () => {
    console.log('Listening');
});

const replaceTmp = (original, lap) => {

    let output = original.replace(/{%PRODUCTNAME%}/g, lap.productName);
    output = output.replace(/{%IMAGE%}/g, lap.image);
    output = output.replace(/{%PRICE%}/g, lap.price);
    output = output.replace(/{%SCREEN%}/g, lap.screen);
    output = output.replace(/{%CPU%}/g, lap.cpu);
    output = output.replace(/{%STORAGE%}/g, lap.storage);
    output = output.replace(/{%RAM%}/g, lap.ram);
    output = output.replace(/{%DESCRIPTION%}/g, lap.description);
    output = output.replace(/{%ID%}/g, lap.id);

    return output;
}