import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOwnProfile } from '../store/slices/authSlice';
import api from '../api';

function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = api.getAccessToken();
    if (token) {
      dispatch(fetchOwnProfile());
    }
  }, [dispatch]);
}

export default useAuth;
