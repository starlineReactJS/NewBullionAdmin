import SecureLS from "secure-ls";

const SecureLSClass = SecureLS.default || SecureLS;


const secureLS = new SecureLSClass({
    encodingType: "aes",     // strongest option
    isCompression: false,    // optional
});

export const setSecureItem = (key, value) => {
    secureLS.set(key, value);
};

export const getSecureItem = (key) => {
    try {
        return secureLS.get(key);
    } catch (e) {
        return null;
    }
};

export const removeSecureItem = (key) => {
    secureLS.remove(key);
};
