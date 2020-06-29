var crypto = require('crypto');
function encrypt(text){
var cipher = crypto.createCipher('aes-256-cbc','mAuR1c10***');
var encrypted = cipher.update(text.toString(),'utf8','hex') + cipher.final('hex');
return encrypted;
}
function decrypt(text){
var decipher = crypto.createDecipher('aes-256-cbc','mAuR1c10***');
var decrypted = decipher.update(text.toString(),'hex','utf8') + decipher.final('utf8');
return decrypted ;
}
module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;