/**
 * Unit tests untuk komponen VoteButtons.
 *
 * Skenario pengujian:
 * - Render: menampilkan jumlah up-vote dan down-vote dengan benar
 * - Render: tombol up-vote memiliki aria-pressed false jika user belum up-vote
 * - Render: tombol up-vote memiliki aria-pressed true jika user sudah up-vote
 * - Render: tombol down-vote memiliki aria-pressed true jika user sudah down-vote
 * - Render: tidak ada status active jika userId null
 * - Interaksi: memanggil onUpVote saat tombol up-vote diklik
 * - Interaksi: memanggil onDownVote saat tombol down-vote diklik
 * - Render: menampilkan 0 jika upVotesBy dan downVotesBy kosong
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButtons from '../../components/VoteButtons';

describe('VoteButtons component', () => {
  const defaultProps = {
    upVotesBy: [],
    downVotesBy: [],
    userId: 'user-1',
    onUpVote: vi.fn(),
    onDownVote: vi.fn(),
  };

  it('should render up-vote and down-vote counts correctly', () => {
    render(
      <VoteButtons
        {...defaultProps}
        upVotesBy={['user-a', 'user-b']}
        downVotesBy={['user-c']}
      />,
    );

    const counts = screen.getAllByRole('button');
    expect(counts[0]).toHaveTextContent('2');
    expect(counts[1]).toHaveTextContent('1');
  });

  it('should show 0 counts when upVotesBy and downVotesBy are empty', () => {
    render(<VoteButtons {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('0');
    expect(buttons[1]).toHaveTextContent('0');
  });

  it('should set aria-pressed false on up-vote button when user has not up-voted', () => {
    render(<VoteButtons {...defaultProps} upVotesBy={[]} />);
    const upVoteBtn = screen.getByLabelText('Up vote');
    expect(upVoteBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('should set aria-pressed true on up-vote button when user has already up-voted', () => {
    render(<VoteButtons {...defaultProps} upVotesBy={['user-1']} />);
    const upVoteBtn = screen.getByLabelText('Up vote');
    expect(upVoteBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('should set aria-pressed true on down-vote button when user has already down-voted', () => {
    render(<VoteButtons {...defaultProps} downVotesBy={['user-1']} />);
    const downVoteBtn = screen.getByLabelText('Down vote');
    expect(downVoteBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('should set aria-pressed false on both buttons when userId is null', () => {
    render(
      <VoteButtons
        {...defaultProps}
        userId={null}
        upVotesBy={['user-1']}
        downVotesBy={['user-1']}
      />,
    );

    expect(screen.getByLabelText('Up vote')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByLabelText('Down vote')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should call onUpVote when up-vote button is clicked', async () => {
    const onUpVote = vi.fn();
    render(<VoteButtons {...defaultProps} onUpVote={onUpVote} />);

    await userEvent.click(screen.getByLabelText('Up vote'));

    expect(onUpVote).toHaveBeenCalledTimes(1);
  });

  it('should call onDownVote when down-vote button is clicked', async () => {
    const onDownVote = vi.fn();
    render(<VoteButtons {...defaultProps} onDownVote={onDownVote} />);

    await userEvent.click(screen.getByLabelText('Down vote'));

    expect(onDownVote).toHaveBeenCalledTimes(1);
  });
});
