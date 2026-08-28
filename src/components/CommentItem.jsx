import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import VoteButtons from './VoteButtons';
import formatDate from '../utils/formatDate';
import {
  optimisticUpVoteComment,
  optimisticDownVoteComment,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../store/slices/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const handleUpVote = () => {
    if (!userId) return;
    const alreadyUp = comment.upVotesBy.includes(userId);
    dispatch(optimisticUpVoteComment({ commentId: comment.id, userId }));
    if (alreadyUp) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id, userId }));
    } else {
      dispatch(upVoteComment({ threadId, commentId: comment.id, userId }));
    }
  };

  const handleDownVote = () => {
    if (!userId) return;
    const alreadyDown = comment.downVotesBy.includes(userId);
    dispatch(optimisticDownVoteComment({ commentId: comment.id, userId }));
    if (alreadyDown) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id, userId }));
    } else {
      dispatch(downVoteComment({ threadId, commentId: comment.id, userId }));
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-item__header">
        <div className="comment-item__owner">
          <Avatar
            src={comment.owner.avatar}
            name={comment.owner.name}
            size="sm"
          />
          <span className="comment-item__name">{comment.owner.name}</span>
        </div>
        <span className="comment-item__date">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <div
        className="comment-item__content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <VoteButtons
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        userId={userId}
        onUpVote={handleUpVote}
        onDownVote={handleDownVote}
      />
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
