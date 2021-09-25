import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { withTimeout } from '../../utils.js';


const messageSendTimeout = 1000;


const renderErrorFooter = (message) => {
  return  (
    <Modal.Footer>
      {message}
    </Modal.Footer>
  )
}

const Remove = ({ onHide, socket, modalInfo }) => {

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
            setErrorMessage('The response is not success.');
          } else {
            return onHide();
          }
          setSubmit(false);
        },
        () => {
          setSubmit(false);
          setErrorMessage('Timeout error. Check network connection');
        },
        messageSendTimeout,
      ),
    );
  }
  return (
    <Modal show={true}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Remove Channel</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure wants to delete this channel?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submit}>
          Close
        </Button>
        <Button type="submit" className="btn btn-primary" disabled={submit} onClick={handleClick}>
          Save Changes
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