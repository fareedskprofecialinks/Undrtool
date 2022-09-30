import config from '../config/config';
import APICallingService from './APICallingService';

const callToLanguageListService = (url) => {
    return APICallingService.sendRequestForGet(url, '', (res) => {
    });
}

const callToLanguageService = (url, payload) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToLoginService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToRegisterService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToVisiterPostService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToForgotpasswordService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToChangepasswordService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callToQuetionSaveService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

const callTogetLocations = (url) => {
    return APICallingService.sendRequestForGet(url, '', (res) => {
    });
}

const callToSaveFeedBackService = (payload, url) => {
    return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
    });
}

async function fetchLanguageListService(CB) {
    let url = config.url.languageListUrl;
    const response = await callToLanguageListService(url);
    if (response) {
        CB(response)
    }
}

async function fetchLanguageService(payload, CB) {
    let url = config.url.languageUrl;
    const response = await callToLanguageService(url, payload);
    if (response) {
        CB(response);
    }
}

async function fetchLoginService(payload, CB) {
    let url = config.url.loginUrl;
    const response = await callToLoginService(payload, url);
    if (response) {
        CB(response)
    }
}

async function fetchRegisterService(payload, CB) {
    let url = config.url.signupUrl;
    const response = await callToRegisterService(payload, url);
    if (response) {
        CB(response)
    }
}
async function fetchVisitorService(payload, CB) {
    let url = config.url.visitorpost;
    const response = await callToVisiterPostService(payload, url);
    if (response) {
        CB(response)
    }
}
async function fetchforgotService(payload, CB) {
    let url = config.url.resetPasswordUrl;
    const response = await callToForgotpasswordService(payload, url);
    if (response) {
        CB(response)
    }
}

async function changePasswordService(payload, token, CB) {
    let url = config.url.changePasswordUrl;
    const response = await callToChangepasswordService(payload, url);
    if (response) {
        CB(response)
    }
}

async function saveQuesionsService(payload, CB) {
    let url = config.url.savequetionUrl;
    const response = await callToQuetionSaveService(payload, url);
    if (response) {
        CB(response)
    }
}

async function getLocations(urlAppend, CB) {
    let url = config.url.getLocations + urlAppend;
    const response = await callTogetLocations(url);
    if (response) {
        CB(response)
    }
}

async function sendFeedback(payload, CB) {
    let url = config.url.sendFeedback;
    const response = await callToSaveFeedBackService(payload, url);
    if (response) {
        CB(response)
    }
}

export {
    fetchLanguageListService,
    fetchLanguageService,
    fetchLoginService,
    saveQuesionsService,
    getLocations,
    changePasswordService,
    sendFeedback,
    fetchRegisterService,
    fetchforgotService,
    fetchVisitorService
};