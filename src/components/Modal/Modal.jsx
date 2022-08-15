import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ item, onClose }) {
  useEffect(() => {
    const handleKeyDown = e => e.code === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = e => e.target === e.currentTarget && onClose();

  return createPortal(
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <img src={item.largeImageURL} alt={item.tags} />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
};