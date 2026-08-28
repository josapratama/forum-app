import React from 'react';
import PropTypes from 'prop-types';

function VoteButtons({
  upVotesBy,
  downVotesBy,
  userId = null,
  onUpVote,
  onDownVote,
}) {
  const hasUpVoted = userId && upVotesBy.includes(userId);
  const hasDownVoted = userId && downVotesBy.includes(userId);

  return (
    <div className="vote-buttons">
      <button
        type="button"
        className={`vote-btn vote-btn--up${hasUpVoted ? ' vote-btn--active' : ''}`}
        onClick={onUpVote}
        aria-label="Up vote"
        aria-pressed={!!hasUpVoted}
      >
        <span className="vote-icon">▲</span>
        <span className="vote-count">{upVotesBy.length}</span>
      </button>
      <button
        type="button"
        className={`vote-btn vote-btn--down${hasDownVoted ? ' vote-btn--active-down' : ''}`}
        onClick={onDownVote}
        aria-label="Down vote"
        aria-pressed={!!hasDownVoted}
      >
        <span className="vote-icon">▼</span>
        <span className="vote-count">{downVotesBy.length}</span>
      </button>
    </div>
  );
}

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  userId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
};

export default VoteButtons;
