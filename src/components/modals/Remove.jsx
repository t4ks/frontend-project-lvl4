import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { withTimeout } from '../../utils.js';
import { useTranslation } from 'react-i18next';


const messageSendTimeout = 1000;


const renderErrorFooter = (message) => {
  return  (
    <Modal.Footer>
      {message}
    </Modal.Footer>
  )
}

const Remove = ({ onHide, socket, modalInfo }) => {
  const { t } = useTranslation();
  const [submit, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = () => {
    setSubmit(true);
    socket.emit(
      'removeChannel',
      { id: modalInfo.item.id },
      withTimeout(
        (response) => {
          if (response.status !== 'ok') {
            console.log(response);
            setErrorMessage(t('invalid_status'));
          } else {
            return onHide();
          }
          setSubmit(false);
        },
        () => {
          setSubmit(false);
          setErrorMessage(t('network_error'));
        },
        messageSendTimeout,
      ),
    );
  }
  return (
    <Modal show={true}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('Remove Channel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {t('Are you sure wants to delete this channel?')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submit}>
          {t('Close')}
        </Button>
        <Button type="submit" className="btn btn-primary" disabled={submit} onClick={handleClick}>
          {t('Submit')}
        </Button>
      </Modal.Footer>
      {errorMessage && renderErrorFooter(errorMessage)}
    </Modal>
  );
};

Remove.propTypes = {
  onHide: PropTypes.func,
  socket: PropTypes.object,
  modalInfo: PropTypes.object,
}

export default Remove;