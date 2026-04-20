import ExcelJS from "exceljs";

export type ExcelExport = {
    title?: string;
    header?: string[];
    rows: any[];
}

export const exportExcel = async ({ title, header = [], rows }: ExcelExport) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Reporte");


    // ============================
    //  2️⃣ Encabezados
    // ============================
    sheet.columns = header.map((h) => ({ header: h, key: h }));

    const headerRow = sheet.getRow(title ? 2 : 1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "305496" } // Azul oscuro
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };


    // ============================
    //  1️⃣ Insertar título grande
    // ============================
    if (title) {
        sheet.insertRow(1, []);
        // Unir celdas de la primera fila para el título
        const totalCols = header.length;
        sheet.mergeCells(1, 1, 1, totalCols);
        const titleCell = sheet.getCell(1, 1);

        titleCell.value = title;
        titleCell.alignment = { horizontal: "center", vertical: "middle" };
        titleCell.font = { size: 16, bold: true, color: { argb: "FFFFFF" } };
        titleCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4F81BD" } // Azul elegante
        };
    }

    sheet.spliceRows(3,1)

    // ============================
    //  3️⃣ Agregar datos
    // ============================
    rows.forEach(row => {
        sheet.addRow(row);
    });

    // Ajustar ancho de columnas automáticamente
    sheet.columns.forEach((col: any) => {
        let maxLength = 0;
        col.eachCell({ includeEmpty: true }, (cell:any) => {
            const cellLength = cell.value ? cell.value.toString().length : 10;
            if (cellLength > maxLength) maxLength = cellLength;
        });
        col.width = maxLength < 10 ? 10 : maxLength + 2;
    });

    // ============================
    //  4️⃣ Generar archivo en el navegador
    // ============================
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title || "reporte") + ".xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
};
