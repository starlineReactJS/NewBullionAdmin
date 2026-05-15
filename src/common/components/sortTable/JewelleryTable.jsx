import React from "react";
import Skeleton from "../skeleton";
import { Spinner } from "react-bootstrap";

const JewelleryTable = ({
    data = [],
    columns = [],       // ["Name", "URL", "Image"]
    visibleColumns = {}, // { Name:true, URL:true }
    columnRender,       // function(col, row)
    isLoading = false,
    isFetchingMore = false,
    hasMore = true,
    mode = ""
}) => {
    return (
        <div className="table-wrapper table-cover">
            <table>
                {/* ------------ HEADER ------------ */}
                <thead>
                    <tr className="common-bg">
                        {columns.map((col) => {
                            if (!visibleColumns[col]) return null;
                            if (mode === "excel" && (col === "Resend" || col === "Delete")) return null;

                            return <th key={col}>{col}</th>;
                        })}
                    </tr>
                </thead>

                {/* ------------ BODY ------------ */}
                <tbody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => {
                                    if (!visibleColumns[col]) return null;
                                    if (mode === "excel" && (col === "Resend" || col === "Delete")) return null;

                                    return (
                                        <td key={col}>
                                            <div className="content">
                                                {columnRender ? columnRender(col, row) : row[col]}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                {isLoading ? (
                                    <Skeleton height="350px" />
                                ) : (
                                    <div className="content"><p className="no-records">No Records Found</p></div>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ------------ FOOTER ------------ */}
            <div style={{ textAlign: "center", padding: "12px" }}>
                {isFetchingMore && !isLoading && <Spinner animation="border" variant="info" />}
                {!hasMore && data.length > 0 && (
                    <div className="end-result">
                        ★ End of results ★
                    </div>
                )}
            </div>
        </div>
    );
};

export default JewelleryTable;
