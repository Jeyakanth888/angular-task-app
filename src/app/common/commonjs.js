export function validateEmailMobileInput(userInput) {
    let isvalid_and_type;
    const letterNumber = /^[0-9]+$/;
    if (userInput.match(letterNumber)) {
        if (userInput.length < 6) {
            isvalid_and_type = 'notValidMobile';
        } else {
            isvalid_and_type = 'validMobile';
        }
    } else {
        const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (emailReg.test(userInput)) {
            isvalid_and_type = 'validEmail';
        } else {
            isvalid_and_type = 'notValidEmail';
        }
    }
    return isvalid_and_type ;
}