let configData = {};

const fetchConfig = async () => {
    const response = await fetch('/config.json');
    const config = await response.json();
    configData = config;
};

await fetchConfig();

export const apiUrl = configData?.apiUrl;
export const instrument = configData?.instrument;

export const signalRBaseUrl = `${apiUrl}:${configData?.signalRPort}`;

export const getSignalRUrl = (userName) => {
  return `${signalRBaseUrl}/bullion?user=${userName}&auth=1&type=web`;
}