const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


//jwt.sign create Hash
//jwt.verigy

var data = {
  id:10
};

var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc');
console.log('decoded',decoded);



// var message = "I am user Blair";
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
//
// var resultHash = SHA256(JSON.stringify(data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was change. Do not trust!');
// }
