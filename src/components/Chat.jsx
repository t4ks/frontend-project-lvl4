/* eslint-disable react/display-name */
import React, {
  useEffect, useRef, useState,
} from 'react';
import _ from 'lodash';
import cn from 'classnames';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import {
  Nav, Button, Dropdown, Row, Col, Form, ButtonGroup, DropdownButton,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  fetchChannels, addNewMessage, changeCurrentChannel, addNewChannel, renameChannel, removeChannel,
} from '../slices/chatSlice.js';
import { useAuth, useSocket } from '../hooks';
import getModal from './modals/index.jsx';
import { withTimeout } from '../utils.js';

const renderRemovableChannel = (
  currentChannelId, showModal, t, id, name, pickChannel,
) => (
  <Nav.Item as="li" key={id}>
    <ButtonGroup className="d-flex dropdown">
      <Button
        className="d-flex text-left"
        variant={currentChannelId !== id ? 'light' : 'secondary'}
        onClick={pickChannel(id)}
      >
        {`# ${name}`}
      </Button>
      <DropdownButton
        variant={currentChannelId !== id ? 'light' : 'secondary'}
        as={ButtonGroup}
        title=""
        id="bg-nested-dropdown"
      >
        <Dropdown.Item
          onClick={() => showModal('removing', { id })}
          eventKey={1}
        >
          {t('Remove')}
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => showModal('renaming', { id, name })}
          eventKey={2}
        >
          {t('Rename')}
        </Dropdown.Item>
      </DropdownButton>
    </ButtonGroup>
  </Nav.Item>
);

const renderDefaultChannel = (currentChannelId, id, pickChannel, name) => {
  const defaultClassNames = ['w-100', 'rounded-0', 'text-left'];
  return (
    <Nav.Item as="li" key={id}>
      <Button
        className={cn(defaultClassNames)}
        variant={currentChannelId !== id ? 'light' : 'secondary'}
        onClick={pickChannel(id)}
      >
        {`# ${name}`}
      </Button>
    </Nav.Item>
  );
};

// eslint-disable-next-line react/prop-types
const renderChannel = (
  currentChannelId,
  setCurrentChannelId,
  showModal,
  t,
) => ({ id, name, removable }) => {
  const pickChannel = (channelId) => () => setCurrentChannelId(channelId);

  return removable
    ? renderRemovableChannel(currentChannelId, showModal, t, id, name, pickChannel)
    : renderDefaultChannel(currentChannelId, id, pickChannel, name);
};

const renderMessage = ({ body, username, id }) => (
  <div key={id} className="text-break mb-2">
    <b>{username}</b>
    :
    {body}
  </div>
);

const renderModalComponent = ({ modalInfo, hideModal, socket }) => {
  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} socket={socket} />;
};

const renderModal = ({ modalInfo, hideModal, socket }) => (
  !modalInfo.type
    ? null
    : renderModalComponent({ modalInfo, hideModal, socket })
);

const Chat = () => {
  const { t } = useTranslation();
  const channels = useSelector((state) => state.chat.channels);
  const messages = useSelector((state) => state.chat.messages);
  const currentChannelId = useSelector((state) => state.chat.currentChannelId);
  const dispatch = useDispatch();

  const currentChannel = _.find(channels, (channel) => channel.id === currentChannelId);
  const setCurrentChannelId = (channelId) => dispatch(changeCurrentChannel(channelId));

  const socket = useSocket();
  const auth = useAuth();
  const messageInputRef = useRef(null);
  const defaultChannelId = 1;

  useEffect(() => {
    messageInputRef.current.focus();
    const fetchChannelsData = async () => {
      try {
        await dispatch(fetchChannels(auth.userData.userId)).unwrap();
      } catch (err) {
        const isAuthorizedErr = err.statusCode !== undefined ? err.statusCode === 401 : false;
        if (isAuthorizedErr) {
          auth.logOut();
        }
        console.error(err);
      }
    };
    fetchChannelsData();
    socket.on('newMessage', (message) => {
      dispatch(addNewMessage(message));
    });
    socket.on('newChannel', (channel) => {
      dispatch(addNewChannel(channel));
      dispatch(changeCurrentChannel(channel.id));
    });
    socket.on('renameChannel', (channel) => {
      dispatch(renameChannel(channel));
    });
    socket.on('removeChannel', (channel) => {
      dispatch(removeChannel(channel.id));
      dispatch(changeCurrentChannel(defaultChannelId));
    });
    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('renameChannel');
      socket.off('removeChannel');
    };
  }, [auth, dispatch, socket]);

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  const initialValues = {
    message: '',
  };

  const messageSendTimeout = 1000; // 1 sec
  const formik = useFormik({
    initialValues,
    onSubmit: (values, { setFieldError, setSubmitting, resetForm }) => {
      socket.emit(
        'newMessage',
        { body: values.message, channelId: currentChannelId, username: auth.userData.userName },
        withTimeout(
          (response) => {
            if (response.status !== 'ok') {
              setFieldError('message', t('chat.invalid_status'));
            } else {
              resetForm(initialValues);
            }
            setSubmitting(false);
            messageInputRef.current.focus();
          },
          () => {
            setFieldError('message', t('chat.network_error'));
            setSubmitting(false);
          },
          messageSendTimeout,
        ),
      );
    },
  });

  return (
    <>
      <Row className="h-100 flex-md-row bg-white">
        <Col xs={4} md={2} className="border-end pt-5 px-0 bg-light">
          <div className="d-flex justify-content-between" style={{ paddingLeft: '24px', paddingRight: '8px' }}>
            <span>{t('Channels')}</span>
            <Button onClick={() => showModal('adding')} className="p-0" variant="text-primary" vertical="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
            </Button>
          </div>
          <div id="channes-list">
            <Nav fill as="ul" variant="pills" className="flex-column">
              {channels.map(renderChannel(currentChannelId, setCurrentChannelId, showModal, t))}
            </Nav>
          </div>
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm">
              <p className="m-0">
                <b>
                  #
                  {' '}
                  {currentChannel && currentChannel.name}
                </b>
              </p>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {messages.filter(
                (message) => message.channelId === currentChannelId,
              ).map(renderMessage)}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                <Row>
                  <Col xs={10}>
                    <Form.Control
                      name="message"
                      className="border-0 p-0 ps-2"
                      data-testid="new-message"
                      onChange={formik.handleChange}
                      value={formik.values.message}
                      isInvalid={formik.errors.message || false}
                      autoComplete="message"
                      required
                      placeholder={t('chat.input_message')}
                      ref={messageInputRef}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.message}</Form.Control.Feedback>
                  </Col>
                  <Col>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      {t('Submit')}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      {renderModal({ modalInfo, hideModal, socket })}
    </>
  );
};

export default Chat;
