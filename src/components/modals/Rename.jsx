import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { Modal, FormGroup, FormControl } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { withTimeout } from '../../utils.js';

const messageSendTimeout = 1000;

const Rename = ({ onHide, socket, modalInfo }) => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: { body: '' },
    onSubmit: (values, { setFieldError, setSubmitting }) => {
      socket.emit(
        'renameChannel',
        { name: values.body, id: modalInfo.item.id },
        withTimeout(
          (response) => {
            if (response.status !== 'ok') {
              setFieldError('body', t('invalid_status'));
              console.log(response);
            } else {
              onHide();
            }
            setSubmitting(false);
          },
          () => {
            setFieldError('body', t('network_error'));
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
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('Rename Channel')}</Modal.Title>
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
              data-testid="rename-channel"
              name="body"
            />
          </FormGroup>
          <input type="submit" className="btn btn-primary" value={t('Submit')} />
        </form>
      </Modal.Body>
    </Modal>
  );
};

Rename.propTypes = {
  onHide: PropTypes.shape.isRequired,
  socket: PropTypes.shape.isRequired,
  modalInfo: PropTypes.shape.isRequired,
};

export default Rename;
