// eslint-disable-next-line no-unused-vars
import React from 'react';
import VoteButtons from '../components/VoteButtons';

/**
 * Komponen VoteButtons menampilkan tombol up-vote dan down-vote.
 * Komponen ini murni (presentational) — semua logic dikirim via props.
 */
export default {
  title: 'Components/VoteButtons',
  component: VoteButtons,
  tags: ['autodocs'],
  argTypes: {
    onUpVote: { action: 'up-voted' },
    onDownVote: { action: 'down-voted' },
  },
};

export const Default = {
  args: {
    upVotesBy: [],
    downVotesBy: [],
    userId: 'user-1',
  },
};

export const WithVotes = {
  args: {
    upVotesBy: ['user-a', 'user-b', 'user-c'],
    downVotesBy: ['user-d'],
    userId: 'user-1',
  },
};

export const UserHasUpVoted = {
  args: {
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: [],
    userId: 'user-1',
  },
};

export const UserHasDownVoted = {
  args: {
    upVotesBy: [],
    downVotesBy: ['user-1'],
    userId: 'user-1',
  },
};

export const NotLoggedIn = {
  args: {
    upVotesBy: ['user-a', 'user-b'],
    downVotesBy: ['user-c'],
    userId: null,
  },
};
