const fs = require('fs');
const { stringify } = require('querystring');

//open file
fs.readFile('./PrideAndPrejudice.txt', 'utf-8', (err, data) => {
    if (err) throw err;

    data.toLowerCase();
    // get just letters
    let matches = data.match(/[a-zA-Z\']+/g);

    // let test = String.concat('abc', 'def');
    // console.log(test)

    // make ngram arrays
    let ngrams = ngram(matches, 2);
    // console.log(ngrams);
    // console.log(ngrams[0])
    // console.log(ngrams[0,1])
    // console.log(ngrams[0][1])

    // make conditional frequency distribution
    // let test = {'abc':{'a':1, 'b':2, 'c':3}, 'def':{'d':4, 'e':5, 'f':6}}
    // console.log(typeof(test));
    // console.log((test['def']['f']));
    let cfd = condFreq(ngrams);
    // console.log(cfd);
    // console.log(cfd['Jane']);
    // console.log(cfd['Jane'])

    // console.log(maxFreq(cfd['Jane']));

    // generate sentence
    let words = generateModel(cfd, 'the');
    console.log(words);

    //console.log(matches);
});



function ngram(txt, n) {
    let ngrams = [];

    for (let i=0; i< txt.length - n; i++){
        let tmp = [];
        for (let j=0; j<n; j++){
            tmp.push(txt[i+j]);
        }
        ngrams.push(tmp);
    }
    return ngrams;
}

function condFreq(ngrams) {
    let data = {};

    for (let i=0; i<ngrams.length; i++){
        // console.log(i);
        let cond = ngrams[i][0];
        let freq = ngrams[i][1];
        // console.log(cond)
        // console.log(freq)

        //if condition undefined
        if (data[cond] == undefined){
            data[cond] = {};
        }

        //if frequency undefined
        if (data[cond][freq] == undefined){
            data[cond][freq] = 1;
        }

        //else (if cond and freq are defined), add 1 to freq
        else {
            data[cond][freq] = data[cond][freq] + 1
        }
    }

    return data;
}

function getNextWord(data) {
    let total = 0;
    for (var x in data){
        total += data[x];
    }
    //generate random number from 1 to total
    const num = Math.floor((Math.random() * total) + 1);

    let count = 0;
    for (var x in data){
        count += data[x];
        if (count >= num){
            return x;
        }
    }
}

function maxFreq(data) {
    max = -1;
    word = '';
    for (var x in data){
        if (data[x] > max){
            max = data[x]
            word = x;
        }
    }
    return word;
}

function generateModel(cfd, word, num=15) {
    result = word
    for (let i=0; i<num; i++){
        let nextword = getNextWord(cfd[word]);
        result += ' ' + nextword;
        word = nextword;
    }
    return result;
}