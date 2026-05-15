
export const isBankObjValid = (data = {}) => {
    return Object.entries(data).every(([key, value]) => {
        // must exist (0 is allowed)
        if (value === null || value === undefined || value === "") return false;

        // special rule
        if (key === "division" || key === "multiply") {
            return value > 0;
        }
        // all other fields: any number including 0 is OK
        return true;
    });
};

export const validateEmailMobile = (type, value) => {
    let regex = type === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : (type === "mobile" && /^\d{10}$/);
    return regex.test(value);
};

export const validatePremium = (value) => {
    var isvalid = true;

    // const pattern = /^(?:-?\d+|--)$/;
  const pattern = /^(--|-?\d+(?:\.\d+)?)$/;

    if (value !== "" && !pattern.test(value)) {
        isvalid = false;
    }
    return isvalid;
};