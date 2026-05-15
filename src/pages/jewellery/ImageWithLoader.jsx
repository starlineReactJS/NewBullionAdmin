import { useEffect, useState } from "react";
import { Spin } from "antd";
import { apiUrl } from "../../../Config";
import CommonModal from "../../common/components/modal";
import "./imagePreviewModal.css";

const ImagePreviewModal = ({
    open,
    onClose,
    src,
    title = "View Image",
    width = 150,
    height = 200,
    fallback = "https://t2.starlinedashboard.in/img/noimage.png",
}) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (open) setLoading(true);
    }, [open, src]);

    return (
        <CommonModal show={open} onClose={onClose} title={title}>
            <div className="image-preview-wrapper">
                {loading && (
                    <div className="image-preview-loader">
                        <Spin size="large" />
                    </div>
                )}

                <img
                    src={src ? `${apiUrl}/${src}` : fallback}
                    height={height}
                    width={width}
                    alt="Preview"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                    className={`image-preview-img ${loading ? "loading" : ""}`}
                />
            </div>
        </CommonModal>
    );
};

export default ImagePreviewModal;
