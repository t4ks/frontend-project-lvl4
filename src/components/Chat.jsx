/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import cn from 'classnames'; 
import { useFormik } from 'formik';
import * as actions from '../actions/index.jsx';
import { Nav, Button, SplitButton, Dropdown, Row, Col, Form } from 'react-bootstrap';
import useAuth, { useSocket } from '../hooks/index';


const mapStateToProp = (state) => {
  const { channels, messages } = state;
  return { channels, messages };
};


const actionCreators = {
    fetchChannels: actions.fetchChannels,
    addMessage: actions.addMessage,
};


// eslint-disable-next-line react/prop-types
const renderChannel = (currentChannelId, setCurrentChannelId) => ({ id, name, removable }) => {
  if (removable) {
    return (
      <Nav.Item key={id}>
          <SplitButton
            className='w-100 px-4 rounded-0 text-start btn'
            title={name}
            variant='light'
          >
            <Dropdown.Item eventKey={1}>Remove</Dropdown.Item>
            <Dropdown.Item eventKey={2}>Re-name</Dropdown.Item>
          </SplitButton>
      </Nav.Item>
    );
  }
  const defaultClassNames = ['w-100', 'px-4', 'rounded-0', 'text-start', 'btn'];
  const pickChannel = (channelId) => () => setCurrentChannelId(channelId);
  return (
    <Nav.Item key={id}>
      <Button
        className={cn(defaultClassNames, {'btn-secondary': currentChannelId === id})}
        variant='light'
        title={name}
        onClick={pickChannel(id)}
      >{name}
      </Button>
    </Nav.Item>
  )
};


const renderMessage = ({ body, username, id }) => {
  return (
    <div key={id} className='text-break mb-2'>
        <b>{username}</b>: {body}
    </div>
  )
};


const Chat = ({ fetchChannels, channels, messages, addMessage }) => {
  const socket = useSocket();
  const auth = useAuth();
  const messageInputRef = useRef(null);
  useEffect(() => {
    fetchChannels(auth.userId);
    socket.on('newMessage', (message) => {
      addMessage({ message });
    });
    messageInputRef.current.focus();
    return () => {
      socket.off('newMessage');
    }
  }, []);

  const [currentChannelId, setCurrentChannelId] = useState(channels.currentChannelId);
  const currentChannel = _.find(channels.list, (channel) => channel.id === currentChannelId);

  const initialValues = {
    message: '',
  }

  const withTimeout = (onSuccess, onTimeout, timeout) => {
    let called = false;
  
    const timer = setTimeout(() => {
      if (called) return;
      called = true;
      onTimeout();
    }, timeout);
  
    return (...args) => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      onSuccess.apply(this, args);
    }
  }

  const messageSendTimeout = 1000;  // 1 sec

  const formik = useFormik({
    initialValues,
    onSubmit: (values, { setFieldError, setSubmitting, resetForm }) => {
      socket.emit(
        'newMessage',
        { body: values.message, channelId: currentChannelId, username: auth.userName },
        withTimeout(
          (response) => {
            if (response.status !== 'ok') {
              setFieldError('message', 'the server returned invalid status.');
              console.log(response);
            } else {
              resetForm(initialValues);
            }
            setSubmitting(false);
            messageInputRef.current.focus();
          },
          () => {
            setFieldError('message', 'the message has not been sent, please check network connection.');
            setSubmitting(false);
          },
          messageSendTimeout,
        ),
      );
    },
  });

  return (
    <Row>
      <Col xs={2}>
        <Nav fill variant="pills" className="flex-column">
          {channels.list.map(renderChannel(currentChannelId, setCurrentChannelId))}
        </Nav>
      </Col>
      <Col>
        <div className='bg-light mb-4 p-3 shadow-sm small'>
          # {currentChannel && currentChannel.name}
        </div>
        <div id='messages-box' className='chat-messages overflow-auto px-5'>
          {messages.filter((message) => message.channelId === currentChannelId).map(renderMessage)}
        </div>
        <div className='mt-auto px-5 py-3'>
          <Form className='py-1 border rounded-2' onSubmit={formik.handleSubmit}>
            <Row>
              <Col xs={10}>
                <Form.Control
                  name='message'
                  className='border-0 p-0 ps-2'
                  data-testid='new-message'
                  onChange={formik.handleChange}
                  value={formik.values.message}
                  isInvalid={formik.errors.message || false}
                  autoComplete="message"
                  required={true}
                  placeholder="message"
                  ref={messageInputRef}
                />
                <Form.Control.Feedback type="invalid">{formik.errors.message}</Form.Control.Feedback>
              </Col>
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                  >Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

Chat.propTypes = {
  channels: PropTypes.object,
  fetchChannels: PropTypes.func,
  messages: PropTypes.array,
  addMessage: PropTypes.func,
};


export default connect(mapStateToProp, actionCreators)(Chat);
