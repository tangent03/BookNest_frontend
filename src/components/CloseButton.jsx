import React from 'react';
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const CloseButton = ({ onClose }) => {
  return (
    <Button
      onClick={onClose}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1001, // Ensure it's above the ChatBot
      }}
    >
      Close
    </Button>
  );
};

export default CloseButton;
