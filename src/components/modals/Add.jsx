import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { withTimeout } from '../../utils.js';


const messageSendTimeout = 1000;

const Add = ({ onHide, socket }) => {
  const formik = useFormik({ 
    initialValues: { body: '' },
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      socket.emit(
        'newChannel',
        { name: values.body },
        withTimeout(
          (response) => {
            if (response.status !== 'ok') {
              setFieldError('body', 'the server has returned invalid status.');
              console.log(response);
            } else {
              onHide();
            }
            setSubmitting(false);
          },
          () => {
            setFieldError('body', 'the channel has not been created, please check a network connection.');
            setSubmitting(false);
          },
          messageSendTimeout,
        ),
      );
    },
  });

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, [null]);

  return (
    <Modal show={true}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
              data-testid="input-body"
              name="body"
            />
          </FormGroup>
          <input type="submit" className="btn btn-primary" value="submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

Add.propTypes = {
  onHide: PropTypes.func,
  socket: PropTypes.object,
}

export default Add;