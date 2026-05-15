import { Modal } from "antd";

const { confirm } = Modal;

export const deleteModal = ({
  title = "Are you sure you want to delete?",
  okText = "Delete",
  cancelText = "Cancel",
  onConfirm,
}) => {
  confirm({
    title,
    okText,
    okType: "danger",
    cancelText,
      mask: {
      closable: false,
    },
    onOk: onConfirm,
  });
};
