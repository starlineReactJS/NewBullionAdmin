import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const ExportToPDF = (jsonData, fileName = "data.pdf") => {
  if (!jsonData?.length) return;

  const tableHeaders = Object.keys(jsonData[0]);

  const widths = [40, 60, 60, "*", "*", 90];

  const tableBody = [
    tableHeaders,
    ...jsonData.map(obj => tableHeaders.map(h => obj[h]))
    // ...jsonData.map(obj =>
    //   tableHeaders.map(key => ({
    //     text:
    //       key === "modifiedDate"
    //         ? dayjs(obj[key]).format("DD/MM/YYYY HH:mm")
    //         : String(obj[key] ?? ""),
    //     fontSize: 8,
    //     noWrap: false
    //   }))
    // )
  ];

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [10, 10, 10, 10], // reduce margins

    defaultStyle: {
      fontSize: 8,
    },

    content: [
      {
        table: {
          headerRows: 1,
          keepWithHeaderRows: 1,
          dontBreakRows: true,
          widths,
          body: tableBody,
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,

          hLineColor: () => "#000",
          vLineColor: () => "#000",

          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        // layout: "lightHorizontalLines"
      },
    ],
  };

  pdfMake.createPdf(docDefinition).download(fileName);
};
