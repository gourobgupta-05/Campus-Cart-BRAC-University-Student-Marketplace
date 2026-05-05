import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} from '../slices/messagesApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCreateReportMutation } from '../slices/reportsApiSlice';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const ChatScreen = () => {
  const { id: urlUserId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [activePartnerId, setActivePartnerId] = useState(urlUserId || null);
  const [messageText, setMessageText] = useState('');
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [createReport, { isLoading: isReporting }] = useCreateReportMutation();

  const {
    data: conversations,
    isLoading: loadingConversations,
    error: errorConversations,
    refetch: refetchConversations
  } = useGetConversationsQuery();

  const {
    data: messages,
    isLoading: loadingMessages,
    error: errorMessages,
    refetch: refetchMessages
  } = useGetMessagesQuery(activePartnerId, {
    skip: !activePartnerId,
    pollingInterval: 3000,
  });

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  useEffect(() => {
    if (urlUserId) {
      setActivePartnerId(urlUserId);
    }
  }, [urlUserId]);

  useEffect(() => {
    if (activePartnerId && messages) {
      markAsRead(activePartnerId).then(() => {
        refetchConversations();
      });
    }
  }, [activePartnerId, messages, markAsRead, refetchConversations]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId) return;
    try {
      await sendMessage({ receiverId: activePartnerId, content: messageText }).unwrap();
      setMessageText('');
      refetchMessages();
      refetchConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectPartner = (partnerId) => {
    navigate(`/chat/${partnerId}`);
  };

  const submitReportHandler = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting');
      return;
    }
    try {
      await createReport({ reportedUserId: activePartnerId, reason: reportReason }).unwrap();
      toast.success('User reported successfully');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row>
      <Col md={4}>
        <h2>Conversations</h2>
        {loadingConversations ? (
          <Loader />
        ) : errorConversations ? (
          <Message variant="danger">
            {errorConversations?.data?.message || 'Error fetching conversations'}
          </Message>
        ) : (
          <ListGroup>
            {conversations.length === 0 && <ListGroup.Item>No conversations yet</ListGroup.Item>}
            {conversations.map((conv) => (
              <ListGroup.Item
                key={conv.partnerId}
                action
                active={conv.partnerId === activePartnerId}
                onClick={() => handleSelectPartner(conv.partnerId)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{conv.name}</strong>
                  <br />
                  <small className="text-muted">
                    {conv.latestMessage.length > 20
                      ? conv.latestMessage.substring(0, 20) + '...'
                      : conv.latestMessage}
                  </small>
                </div>
                {conv.unreadCount > 0 && conv.partnerId !== activePartnerId && (
                  <span className="badge bg-danger rounded-pill">
                    {conv.unreadCount} Unread
                  </span>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={8}>
        <h2>Chat</h2>
        {!activePartnerId ? (
          <Message>Select a conversation from the sidebar to start chatting.</Message>
        ) : (
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-light">
              <span><strong>Conversation</strong></span>
              <Button size="sm" variant="outline-danger" onClick={() => setShowReportModal(true)}>
                Report User
              </Button>
            </Card.Header>
            <Card.Body style={{ height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {loadingMessages ? (
                <Loader />
              ) : errorMessages ? (
                <Message variant="danger">
                  {errorMessages?.data?.message || 'Error fetching messages'}
                </Message>
              ) : (
                <>
                  {messages.length === 0 && <p className="text-center text-muted mt-auto mb-auto">Be the first to send a message!</p>}
                  {messages.map((msg) => {
                    const isMine = msg.sender === userInfo._id;
                    return (
                      <div
                        key={msg._id}
                        className={`mb-2 p-2 rounded ${isMine ? 'bg-primary text-white align-self-end' : 'bg-light text-dark align-self-start'}`}
                        style={{ maxWidth: '75%', width: 'fit-content' }}
                      >
                        {msg.content}
                        <div style={{ fontSize: '0.7rem', textAlign: isMine ? 'right' : 'left', opacity: 0.8, marginTop: '4px' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </Card.Body>
            <Card.Footer>
              <Form onSubmit={submitHandler} className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={sending}
                />
                <Button type="submit" variant="primary" className="ms-2" disabled={sending || !messageText.trim()}>
                  Send
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        )}
      </Col>

      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitReportHandler}>
            <Form.Group controlId='reportReason' className='my-2'>
              <Form.Label>Reason for reporting</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Why are you reporting this user?'
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <div className='d-flex justify-content-end mt-3'>
              <Button variant='secondary' onClick={() => setShowReportModal(false)} className='me-2'>
                Cancel
              </Button>
              <Button type='submit' variant='danger' disabled={isReporting}>
                {isReporting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Row>
  );
};

export default ChatScreen;
