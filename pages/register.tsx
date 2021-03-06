import React, { FC, useState } from 'react';

import Head from 'next/head';
import {
  TextField, Button, Select, MenuItem,
} from '@material-ui/core';
import styles from '../styles/Home.module.css';
import { store } from '../src/utils/firebase';

const Register: FC = () => {
  const [url, setURL] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [category, setCategory] = useState<string>('select');
  const [isClickable, setIsClickable] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>('リンク保存する');

  const validation = () => {
    if (category === 'select') {
      alert('カテゴリーを選択してください');
      return false;
    }

    if (url.indexOf('www.nicovideo.jp') === -1) {
      alert('www.nicovideo.jpから始まるURLを入力してください');
      return false;
    }

    if (memo.length > 20) {
      alert('メモは20文字以下にしてください');
      return false;
    }

    return true;
  };

  const checkMovieId = async (movieId: string) => {
    const res = await fetch(`/api/movieId/${movieId}`);
    const data: any = await res.json();
    return data.exists;
  };

  const registerAction = async () => {
    if (validation() === false) {
      return;
    }

    setButtonText('リンク保存中...');
    setIsClickable(false);

    const urlAry = url.split('/');
    let movieId = urlAry[urlAry.length - 1];

    if (movieId.indexOf('?') !== -1) {
      [movieId] = movieId.split('?');
    }

    const pattern = /[0-9]+/;
    if (movieId.match(pattern) === null) {
      alert('URLが正しくありません');
      setButtonText('リンク保存する');
      setIsClickable(true);
      return;
    }

    const exists = await checkMovieId(movieId);

    if (exists) {
      alert('既にその動画は登録されています。');
      setButtonText('リンク保存する');
      setIsClickable(true);
      return;
    }

    store.collection('movies').add({
      category,
      movieId,
      memo,
    })
      .then(() => {
        alert('保存されました');
        setCategory('select');
        setMemo('');
        setURL('');
        setIsClickable(true);
        setButtonText('リンク保存する');
      })
      .catch((err) => {
        if (err.code === 'permission-denied') {
          alert('保存するにはログインする必要があります');
          setButtonText('ログインしてください');
        } else {
          alert('保存できませんでした...');
          setButtonText('リンク保存する');
        }
      });
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Link登録</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={category}
          className={styles.inputSelect}
          onChange={(e: any) => setCategory(e.target.value)}
        >
          <MenuItem value="select">Select Category</MenuItem>
          <MenuItem value="cook">料理</MenuItem>
          <MenuItem value="commentary">実況</MenuItem>
          <MenuItem value="rta">RTA</MenuItem>
          <MenuItem value="tas">TAS</MenuItem>
        </Select>
        <TextField
          id="niconico-url"
          label="Input niconico URL"
          type="url"
          variant="outlined"
          className={styles.inputField}
          value={url}
          onChange={(e: any) => setURL(e.target.value)}
        />
        <TextField
          id="memo-field"
          label="Input Memo"
          type="text"
          variant="outlined"
          className={styles.inputField}
          value={memo}
          onChange={(e: any) => setMemo(e.target.value)}
        />
        <div className={styles.inputButtonField}>
          <Button
            variant="contained"
            color="primary"
            className={styles.inputButton}
            onClick={() => registerAction()}
            disabled={!isClickable}
          >
            {buttonText}
          </Button>
        </div>
        <p>
          ※保存するにはログインする必要があります
        </p>
      </div>
    </>
  );
};

export default Register;
