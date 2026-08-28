import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import formatDate from '../utils/formatDate';
import {
  optimisticUpVoteThread,
  optimisticDownVoteThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
} from '../store/slices/threadsSlice';

function ThreadCard({ thread, owner = null }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const handleUpVote = () => {
    if (!userId) return;
    const alreadyUp = thread.upVotesBy.includes(userId);
    dispatch(optimisticUpVoteThread({ threadId: thread.id, userId }));
    if (alreadyUp) {
      dispatch(neutralVoteThread({ threadId: thread.id, userId }));
    } else {
      dispatch(upVoteThread({ threadId: thread.id, userId }));
    }
  };

  const handleDownVote = () => {
    if (!userId) return;
    const alreadyDown = thread.downVotesBy.includes(userId);
    dispatch(optimisticDownVoteThread({ threadId: thread.id, userId }));
    if (alreadyDown) {
      dispatch(neutralVoteThread({ threadId: thread.id, userId }));
    } else {
      dispatch(downVoteThread({ threadId: thread.id, userId }));
    }
  };

  const bodyPreview = thread.body.length > 150 ? `${thread.body.slice(0, 150)}...` : thread.body;

  return (
    <article className="thread-card">
      <div className="thread-card__header">
        <Link to={`/threads/${thread.id}`} className="thread-card__title">
          {thread.title}
        </Link>
        {thread.category && (
          <span className="thread-card__category">{`#${thread.category}`}</span>
        )}
      </div>
      <p className="thread-card__body">{bodyPreview}</p>
      <div className="thread-card__footer">
        <div className="thread-card__meta">
          {owner && (
            <div className="thread-card__owner">
              <Avatar src={owner.avatar} name={owner.name} size="sm" />
              <span>{owner.name}</span>
            </div>
          )}
          <span className="thread-card__date">
            {formatDate(thread.createdAt)}
          </span>
          <span className="thread-card__comments">
            {`💬 ${thread.totalComments} komentar`}
          </span>
        </div>
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={userId}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
        />
      </div>
    </article>
  );
}

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    ownerId: PropTypes.string.isRequired,
  }).isRequired,
  owner: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default ThreadCard;
