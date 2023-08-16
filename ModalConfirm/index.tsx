import '../../../../layout/constants/blurEffect.scss';

import React, { FC } from 'react';

import CloseIcon from '../../../../layout/assets/close.svg';
import WarnIcon from '../../../../layout/assets/warnIcon.svg';
import Button from '../../Button/Button';
import ModalPortal from '../../ModalPortal/ModalPortal';
import styles from '../Modal.module.scss';

interface IModalConfirmProps {
  isVisible: boolean;
  onReturn: () => void;
  onClose: () => void;
  content?: React.ReactNode;
  buttonSave?: string;
}

const ModalConfirm: FC<IModalConfirmProps> = ({
  onReturn,
  onClose,
  isVisible,
  content,
  buttonSave,
}) => {
  return (
    <ModalPortal isVisible={isVisible}>
      <div className={styles.modalConfirmWrapper}>
        <div className={styles.modalConfirmHeader}>
          <WarnIcon />
          <div className={styles.closeIcon}>
            <div className={styles.modalConfirmHeaderTitle}>Внимание</div>
            <div>
              <span className={styles.modalCloseIcon} onClick={onReturn}>
                <CloseIcon />
              </span>
            </div>
          </div>
        </div>
        <div className={styles.modalConfirmMiddle}>
          {!content ? (
            <>
              <span className={styles.modalConfirmMiddleTop}>
                Вы уверены, что хотите закрыть окно?
              </span>
              <span>Все несохраненные изменения будут утеряны</span>
            </>
          ) : (
            <div>{content}</div>
          )}
        </div>
        <div className={styles.modalConfirmButtons}>
          <Button
            color="orange"
            className={styles.modalConfirmWrapperConfirmButton}
            onClick={onClose}
          >
            {!buttonSave ? 'Закрыть окно' : buttonSave}
          </Button>
          <Button onClick={onReturn}>Отмена</Button>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ModalConfirm;
