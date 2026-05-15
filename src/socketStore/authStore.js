let authData = {
  token: null,
  name: "",
  permissions: {}
};

export const setAuthData = (data) => {
  authData = data;
};

export const getAuthToken = () => authData.token;
export const getAuthName =()=>authData.name;


export const clearAuthData = () => {
  authData = { token: null, name: "", permissions: {} };
};
