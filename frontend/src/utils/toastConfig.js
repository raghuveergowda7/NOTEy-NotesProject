import { toast } from 'react-toastify';

const defaultConfig = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  theme: "light"
};

const authConfig = {
  ...defaultConfig,
  autoClose: 2500,
  position: "top-center"
};

const errorConfig = {
  ...defaultConfig,
  autoClose: 3000,
  type: "error"
};

export const showToast = {
  success: (message) => toast.success(message, defaultConfig),
  error: (message) => toast.error(message, errorConfig),
  info: (message) => toast.info(message, defaultConfig),
  auth: {
    success: (message) => toast.success(message, authConfig),
    error: (message) => toast.error(message, { ...authConfig, autoClose: 3000 })
  }
};

export default showToast; 