import React from 'react';

export const Loader = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div className="loader" />
      <p>Loading...</p>
      <style>
        {`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};
