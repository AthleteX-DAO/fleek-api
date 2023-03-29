import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [nflList, setNflList] = useState('');
  const [nflPlayers, setNflPlayers] = useState('');

  useEffect(() => {
    async function getNFLTargets() {
      try {
        let nfl_urls = [];
        const token = process.env.REACT_APP_NFL_TOKEN;
        const response = await axios.get('https://raw.githubusercontent.com/AthleteX-DAO/sports-cids/main/nfl.json');
        const { list, directory } = response.data;
        setNflList(`https://${list}.ipfs.nftstorage.link`);
        setNflPlayers(`https://${directory}.ipfs.nftstorage.link`);
      } catch (error) {
        console.error(error);
      }
    }

    getNFLTargets();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home urls={[nflList, nflPlayers]} />} />
          <Route path="/nfl" element={<GETContent url={nflList} />} />
          <Route path="/nfl/:id" element={<GETSubContent url={nflPlayers} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ urls }) {
  const [list, dir] = urls;
  return (
    <div>
      <h1>The following sports are currently available: NFL</h1>
      {(list === '' && dir === '')
        ? <p>NFL: Loading...</p>
        : <div>
            <p>NFL: Done</p>
            <p>To route, first use '/#/' followed by the sport, then you can subroute further into any of those players</p>
            <p>{list}</p>
            <p>{dir}</p>
          </div>}
    </div>
  );
}

function GETContent({ url }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    async function getContent() {
      if (!url) {
        return;
      }
      const response = await axios.get(url);
      setContent(JSON.stringify(response.data));
    }

    getContent();
  }, [url]);

  return (
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
  );
}

function GETSubContent({ url }) {
  const [content, setUrlContent] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function getUrlContent() {
      if (!url) {
        return;
      }
      const response = await axios.get(`${url}/${id}`);
      setUrlContent(JSON.stringify(response.data));
    }

    getUrlContent();
  }, [url, id]);

  return (
    <div dangerouslySetInnerHTML={{ __html: content }}></div>
  );
}

export default App;
