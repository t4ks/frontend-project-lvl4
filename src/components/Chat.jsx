/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import cn from 'classnames'; 
import * as actions from '../actions/index.jsx';
import { Nav, Button, SplitButton, Dropdown, Row, Col } from 'react-bootstrap';


const mapStateToProp = (state) => {
  const { channels, messages } = state;
  return { channels, messages };
}


const actionCreators = {
    fetchChannels: actions.fetchChannels,
}


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
}


const Chat = ({ fetchChannels, channels, messages }) => {
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchChannels(userId);
  }, []);

  const [currentChannelId, setCurrentChannelId] = useState(channels.currentChannelId);
  const currentChannel = _.find(channels.list, (channel) => channel.id === currentChannelId);

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
        <div id='messages-box' className='chat-messages overflow-auto px-5 '>
          {messages.filter((message) => message.channelId === currentChannelId).map(renderMessage)}
        </div>
      </Col>
    </Row>
  );
}

Chat.propTypes = {
  channels: PropTypes.object,
  fetchChannels: PropTypes.func,
  messages: PropTypes.array,
}


export default connect(mapStateToProp, actionCreators)(Chat);
