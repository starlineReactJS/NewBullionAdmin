import { toast } from "react-toastify";

export const toastFn = (type, msg) => {
  if (toast[type]) {
    toast[type](msg);
  } else {
    toast(msg);
  }
};