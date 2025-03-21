import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ResetPasswordModal from './ResetPasswordModal';

const MODAL_TYPES = {
  LOGIN: 'login',
  REGISTER: 'register',
  RESET_PASSWORD: 'resetPassword',
  NONE: 'none'
};

const AuthModal = ({ isOpen, onClose, initialType = MODAL_TYPES.LOGIN }) => {
  const [activeModal, setActiveModal] = useState(initialType);

  if (!isOpen) return null;

  const handleSwitchToLogin = () => setActiveModal(MODAL_TYPES.LOGIN);
  const handleSwitchToRegister = () => setActiveModal(MODAL_TYPES.REGISTER);
  const handleSwitchToReset = () => setActiveModal(MODAL_TYPES.RESET_PASSWORD);

  const handleClose = () => {
    onClose();
    // Reset to initial type when closing
    setTimeout(() => {
      setActiveModal(initialType);
    }, 200);
  };

  return (
    <>
      <LoginModal 
        isOpen={isOpen && activeModal === MODAL_TYPES.LOGIN}
        onClose={handleClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToReset={handleSwitchToReset}
      />
      
      <RegisterModal 
        isOpen={isOpen && activeModal === MODAL_TYPES.REGISTER}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      <ResetPasswordModal 
        isOpen={isOpen && activeModal === MODAL_TYPES.RESET_PASSWORD}
        onClose={handleClose}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export { MODAL_TYPES };
export default AuthModal; 