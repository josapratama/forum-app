import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../components/Avatar';
import VoteButtons from '../components/VoteButtons';
import CommentItem from '../components/CommentItem';
import formatDate from '../utils/formatDate';
import {
  fetchThreadDetail,
  clearThreadDetail,
  addComment,
  optimisticUpVoteDetail,
  optimisticDownVoteDetail,
  upVoteThreadDetail,
  downVoteThreadDetail,
  neutralVoteThreadDetail,
} from '../store/slices/threadDetailSlice';
import { showLoading, hideLoading } from '../store/slices/loadingSlice';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { thread, isLoading, error } = useSelector(
    (state) => state.threadDetail,
  );
  const { user } = useSelector((state) => state.auth);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = user?.id;

  useEffect(() => {
    const load = async () => {
      dispatch(showLoading());
      await dispatch(fetchThreadDetail(threadId));
      dispatch(hideLoading());
    };
    load();
    return () => {
      dispatch(clearThreadDetail());
    };
  }, [threadId, dispatch]);

  const handleUpVote = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    const alreadyUp = thread.upVotesBy.includes(userId);
    dispatch(optimisticUpVoteDetail({ userId }));
    if (alreadyUp) {
      dispatch(neutralVoteThreadDetail({ threadId, userId }));
    } else {
      dispatch(upVoteThreadDetail({ threadId, userId }));
    }
  };

  const handleDownVote = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    const alreadyDown = thread.downVotesBy.includes(userId);
    dispatch(optimisticDownVoteDetail({ userId }));
    if (alreadyDown) {
      dispatch(neutralVoteThreadDetail({ threadId, userId }));
    } else {
      dispatch(downVoteThreadDetail({ threadId, userId }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentContent.trim()) return;
    setIsSubmitting(true);
    await dispatch(addComment({ threadId, content: commentContent }));
    setCommentContent('');
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-spinner" aria-label="Loading thread">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert--error">{error}</div>
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="page-container page-container--narrow">
      <button
        type="button"
        className="btn btn--outline btn--back"
        onClick={() => navigate(-1)}
      >
        ← Kembali
      </button>

      <article className="thread-detail">
        <header className="thread-detail__header">
          {thread.category && (
            <span className="thread-card__category">
              {`#${thread.category}`}
            </span>
          )}
          <h1 className="thread-detail__title">{thread.title}</h1>
          <div className="thread-detail__meta">
            <div className="thread-card__owner">
              <Avatar
                src={thread.owner.avatar}
                name={thread.owner.name}
                size="md"
              />
              <div>
                <span className="thread-detail__owner-name">
                  {thread.owner.name}
                </span>
                <span className="thread-detail__date">
                  {formatDate(thread.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* eslint-disable-next-line react/no-danger */}
        <div
          className="thread-detail__body"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />

        <div className="thread-detail__votes">
          <VoteButtons
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            userId={userId}
            onUpVote={handleUpVote}
            onDownVote={handleDownVote}
          />
        </div>
      </article>

      <section className="comments-section">
        <h2 className="comments-section__title">
          {`Komentar (${thread.comments.length})`}
        </h2>

        {user ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              className="form-input comment-form__textarea"
              placeholder="Tulis komentar kamu..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              required
              aria-label="Tulis komentar"
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !commentContent.trim()}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </form>
        ) : (
          <div className="alert alert--info">
            <a href="/login">Masuk</a>
            {' '}
            untuk memberikan komentar.
          </div>
        )}

        <div className="comments-list">
          {thread.comments.length === 0 ? (
            <p className="empty-state">
              Belum ada komentar. Jadilah yang pertama!
            </p>
          ) : (
            thread.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                threadId={thread.id}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ThreadDetailPage;
