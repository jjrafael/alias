import React from 'react';

class Modal extends React.Component {
  render() {
    const { className, cxOverlay, children, childrenOutside, id, size} = this.props;

    return (
      <div className={`modal-overlay ${cxOverlay || ''}`}>
          {childrenOutside}
          <div className={`modal  ${className || ''}`} id={id} data-size={size}>
              {children}
          </div>
      </div>
    );
  }
}

export default Modal;