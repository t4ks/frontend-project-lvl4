import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../actions/index.jsx';
import { Nav, Button, SplitButton, Dropdown, Row, Col } from 'react-bootstrap';


const mapStateToProp = (state) => {
  const { channels } = state;
  return { channels };
}


const actionCreators = {
    fetchChannels: actions.fetchChannels,
}


const createChannel = ({ id, name, removable }) => {
  if (removable) {
    return (
      <Nav.Item key={id}>
          <SplitButton
            className='rounded-0 text-start'
            title={name}
            variant='light'
          >
            <Dropdown.Item eventKey={1}>Remove</Dropdown.Item>
            <Dropdown.Item eventKey={2}>Re-name</Dropdown.Item>
          </SplitButton>
      </Nav.Item>
    );
  }
  return (
    <Nav.Item key={id}>
      <Button
        className='rounded-0 text-start'
        variant='light'
        title={name}  
      >{name}
      </Button>
    </Nav.Item>
  )
}

const Chat = ({ fetchChannels, channels }) => {
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    fetchChannels(userId);
  }, []);
  return (
    <Row>
      <Col xs={2}>
        <Nav fill variant="pills" className="flex-column">
          {channels.map(createChannel)}
        </Nav>
      </Col>
      <Col>
        <div className='bg-light mb-4 p-3 shadow-sm small'>
          # general
        </div>
      </Col>
    </Row>
  );
}

Chat.propTypes = {
  channels: PropTypes.array,
  fetchChannels: PropTypes.func,
}

export default connect(mapStateToProp, actionCreators)(Chat);
