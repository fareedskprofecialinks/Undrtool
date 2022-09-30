let baseurl = 'https://www.businessqre.net/quickrisk2/api/';

const crypto = require('crypto');

const filedisc = new Uint8Array([13,78,135,106,70,102,131,120,79,100,78,208,254,223,30,113,100,32,188,126,40,89,80,175,9,15,139,53,89,149,217,65]);
const fileSizeArr = new Uint8Array([213,4,147,122,191,82,89,155,208,154,204,78,101,51,219,36]);

const encrypt = (text)=> {
    
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(filedisc), fileSizeArr);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {  encryptedData: encrypted.toString('hex') };
}

const decrypt = (text)=> {

    let ivkey = fileSizeArr;
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(filedisc), ivkey);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

const services = {
    url: {
        languageListUrl: baseurl + 'language',
        languageUrl: baseurl + 'getLanguageFile',
        loginUrl: baseurl + 'login',
        signupUrl: baseurl + 'sign-up',
        registrationUrl: baseurl + 'get-all-users',
        resetPasswordUrl: baseurl + 'request-password-reset',
        changePasswordUrl: baseurl + 'reset-password',
        savequetionUrl: baseurl + 'save-questionnaire-result',
        getLocations:baseurl +'find-nearby-places?',
        sendFeedback:baseurl +'submit-feedback',
        visitorpost:baseurl+'postVisitorCount',
        visitorcount:baseurl+'getVisitor',
    },

    setLoginData: (obj) => {
        let temp = encrypt(JSON.stringify(obj));
        localStorage.setItem('LoginData', JSON.stringify(temp));
    },

    getLoginData: () => {
        let LoginData = localStorage.getItem('LoginData');
        let LoginDataEncrypted = JSON.parse(LoginData);
        return LoginDataEncrypted ? JSON.parse(decrypt(LoginDataEncrypted)) : null;
    }
    
}

export default services;