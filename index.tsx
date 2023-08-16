/* eslint-disable react-hooks/rules-of-hooks */
import { RESIZE_CORNER } from '@commonComponents/Modal/helper';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import React, {
  FC,
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Rnd } from 'react-rnd';

import { getActiveModalId } from '@src/data/data/actions';
import { useAppDispatch, useAppSelector } from '@src/data/hooks/redux';

import CloseIcon from '../../../layout/assets/close.svg';
import { getDefaultCoords } from '../CustomModal/helper';
import styles from './Modal.module.scss';
import ModalConfirm from './ModalConfirm';

/**
 * @param visible - булево значение, определяющее, будет ли видно модальное окно
 * @param title - строка содержащая текст заголовка
 * @param content - нода, содержащая в себе контент по середину
 * @param footer - строка содержащая ноду для обработки событий окна
 * @param onClose - функция, которая сработает, когда зароется модальное окно
 * @param withModalScroll - булево значение, позволяющее скролить контент модального окна с внутреннем скроллом
 * @param titleClassName - классы для кастомизации title
 * @param dialogClassName - классы для кастомизации dialog
 * @param dialogClassName - классы для кастомизации header
 * @param bodyClassName - класс для тела окна
 */

type DraggableData = {
  node: HTMLElement;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
};

export interface IModalProps {
  modalClassName?: string;
  bodyClassName?: string;
  content?: ReactElement;
  contentClassName?: string;
  dialogClassName?: string;
  withoutTitle?: boolean;
  headerClassName?: string;
  onClose: () => void;
  title?: string | ReactElement;
  icon?: ReactNode;
  iconClassName?: string;
  titleClassName?: string;
  visible: boolean;
  withScroll?: boolean;
  titleIcon?: ReactElement;
  preventClosing?: boolean;
  renderFooter?: (onClose: any) => ReactNode;
  container?: HTMLElement;
  largeContent?: boolean;
  enableResizing?: boolean | true;
  disableDragging?: boolean | false;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
}

/**
 * @deprecated Используйте CustomModal
 * */
const Modal: FC<IModalProps> = ({
  withoutTitle,
  visible,
  title,
  icon,
  iconClassName,
  content,
  onClose,
  withScroll,
  modalClassName,
  titleClassName,
  dialogClassName,
  headerClassName,
  bodyClassName,
  contentClassName,
  preventClosing = false,
  renderFooter,
  container = document.body,
  largeContent,
  disableDragging,
  enableResizing,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
}) => {
  if (!visible) return null;
  const dispatch = useAppDispatch();
  const [isModal, setIsModal] = useState(false);
  const [overlayChecker, setOverlayChecker] = useState<any | null>(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false);
  const [modalId, setModalId] = useState<string>('');
  const [isDraggingDisabled, setIsDraggingDisabled] = useState<boolean>(
    disableDragging ? disableDragging : false,
  );

  useEffect(() => {
    if (withoutTitle || disableDragging) {
      setIsDraggingDisabled(true);
    }
  }, [disableDragging]);

  useEffect(() => {
    const id = nanoid();
    setModalId(id);
  }, []);

  const activeModalId = useAppSelector((state) => state.app.data.activeModalId);

  const closeModalFunction = preventClosing
    ? () => setIsConfirmModalVisible(true)
    : () => {
        onClose();
        setIsModal(false);
      };

  useEffect(() => setIsModal(visible), [visible]);

  const handleKeydown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    if (key === 'Escape') {
      closeModalFunction();
    }
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    setOverlayChecker(e.target);
    dispatch(getActiveModalId(modalId));
  };

  useEffect(() => {
    if (window) window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  if (!visible) return null;

  if (!isModal) return null;

  const modalClasses = clsx(styles.modal, modalClassName, {
    [styles.modalWithScroll]: withScroll,
  });

  const modalDialogClasses = clsx(styles.modalDialog, dialogClassName, {
    [styles.modalDialogWithScroll]: withScroll,
    [styles.modalWithLargeContent]: largeContent,
  });

  const modalBodyClasses = clsx(
    styles.modalBody,
    { [styles.modalBodyWithScroll]: withScroll },
    bodyClassName,
  );

  const titleClasses = clsx(styles.modalTitle, titleClassName);
  const headerClasses = clsx(styles.modalHeader, headerClassName);

  const handleClose = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (overlayChecker.className === target.className) {
      closeModalFunction();
    }
  };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const defaultLocation = {
    x: getDefaultCoords(minWidth, minHeight, windowWidth, windowHeight).x,
    y: getDefaultCoords(minWidth, minHeight, windowWidth, windowHeight).y,
    width: 'auto',
    height: 'auto',
  };

  return createPortal(
    <>
      <Rnd
        default={defaultLocation}
        className={clsx(
          modalId === activeModalId ? styles.topModal : styles.bottomModal,
        )}
        // @ts-ignore
        onMouseDown={(e: MouseEvent) => handleMouseDown(e)}
        enableUserSelectHack={true}
        cancel={'.cancel'}
        dragHandleClassName={'handle'}
        disableDragging={isDraggingDisabled}
        enableResizing={enableResizing ? RESIZE_CORNER : false}
        scale={1}
        minWidth={minWidth}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        minHeight={minHeight}
      >
        {/* <div */}
        {/*   className={modalClasses} */}
        {/*   onMouseDown={(e: MouseEvent) => setOverlayChecker(e.target)} */}
        {/*   onClick={handleClose} */}
        {/* > */}
        <div
          className={modalDialogClasses}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={'handle'}
            style={{
              cursor: 'move',
              paddingTop: withoutTitle || disableDragging ? 0 : '18px',
            }}
          >
            {!withoutTitle && (
              <div className={headerClasses}>
                {icon && <div className={iconClassName}>{icon}</div>}
                <div className={titleClasses}>{title}</div>
                <span className={styles.modalClose} onClick={handleClose}>
                  <CloseIcon />
                </span>
              </div>
            )}
          </div>
          <div
            className={'cancel'}
            style={{ cursor: 'unset', width: '100%', height: '100%' }}
          >
            <div className={modalBodyClasses}>
              <div className={clsx(styles.modalContent, contentClassName)}>
                {content}
                {renderFooter && (
                  <div className={styles.modalFooter}>
                    {renderFooter(closeModalFunction)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}

        <ModalConfirm
          isVisible={isConfirmModalVisible}
          onClose={() => {
            onClose();
            setIsConfirmModalVisible(false);
            setIsModal(false);
          }}
          onReturn={() => setIsConfirmModalVisible(false)}
        />
      </Rnd>
    </>,
    container,
  );
};

export default Modal;
