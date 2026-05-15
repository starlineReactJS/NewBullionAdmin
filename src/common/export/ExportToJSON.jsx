export const ExportJSON = (jsonData, fileName = "data.json") => {
  const jsonString = JSON.stringify(jsonData, null, 2);

  const blob = new Blob([jsonString], {
    type: "application/json;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};