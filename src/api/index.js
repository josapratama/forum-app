const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Something went wrong');
  }
  return data.data;
};

// Auth
const register = async ({ name, email, password }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

const login = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  return data.token;
};

const getOwnProfile = async () => {
  const response = await fetchWithAuth(`${BASE_URL}/users/me`);
  const data = await handleResponse(response);
  return data.user;
};

const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}/users`);
  const data = await handleResponse(response);
  return data.users;
};

// Threads
const getAllThreads = async () => {
  const response = await fetch(`${BASE_URL}/threads`);
  const data = await handleResponse(response);
  return data.threads;
};

const getThreadDetail = async (threadId) => {
  const response = await fetch(`${BASE_URL}/threads/${threadId}`);
  const data = await handleResponse(response);
  return data.detailThread;
};

const createThread = async ({ title, body, category }) => {
  const response = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  });
  const data = await handleResponse(response);
  return data.thread;
};

// Comments
const createComment = async ({ threadId, content }) => {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  const data = await handleResponse(response);
  return data.comment;
};

// Thread Votes
const upVoteThread = async (threadId) => {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
    method: 'POST',
  });
  return handleResponse(response);
};

const downVoteThread = async (threadId) => {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
    method: 'POST',
  });
  return handleResponse(response);
};

const neutralVoteThread = async (threadId) => {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
    method: 'POST',
  });
  return handleResponse(response);
};

// Comment Votes
const upVoteComment = async ({ threadId, commentId }) => {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
};

const downVoteComment = async ({ threadId, commentId }) => {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
};

const neutralVoteComment = async ({ threadId, commentId }) => {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: 'POST' },
  );
  return handleResponse(response);
};

// Leaderboard
const getLeaderboards = async () => {
  const response = await fetch(`${BASE_URL}/leaderboards`);
  const data = await handleResponse(response);
  return data.leaderboards;
};

const api = {
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
  getLeaderboards,
  putAccessToken: (token) => localStorage.setItem('token', token),
  getAccessToken: getToken,
  removeAccessToken: () => localStorage.removeItem('token'),
};

export default api;
