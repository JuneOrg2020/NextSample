import React, { useEffect, useState, FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../src/utils/firebase';

const Logout: FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    auth.signOut()
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        alert('予期せぬエラーが発生しました。');
      });
  }, []);

  const logIn = async (e: any) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      router.push('/');
    } catch (err) {
      alert('EmailまたはPasswordが異なります');
    }
  };

  return (
    <div className="wrapper">
      <form className="auth" onSubmit={logIn}>
        <div>
          <label htmlFor="email" className="auth-label">
            Email:
            {' '}
          </label>
          <input
            id="email"
            className="auth-input"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="password" className="auth-label">
            Password:
            {' '}
          </label>
          <input
            id="password"
            className="auth-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="auth-btn" type="submit">
          Login
        </button>
      </form>
      <Link href="/signup">
        <a href="/signup">
          signup
        </a>
      </Link>
    </div>
  );
};

export default Logout;