import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [nflUrls, setNflUrls] = useState([]);

  useEffect(() => {
    async function getNFLTargets() {
      let nfl_urls = [];
      const token = process.env.REACT_APP_NFL_TOKEN;
      const response = await axios.get(
        'https://api.nft.storage/', {
          headers: {
            Authorization: token,
          },
        });
      const data = response.data.value;
    
      if (data[0].size < data[1].size) {
        nfl_urls.push(`https://${data[0].cid}.ipfs.nftstorage.link`);
        nfl_urls.push(`https://${data[1].cid}.ipfs.nftstorage.link`);
        setNflUrls(nfl_urls);
        return;
      }
    
      nfl_urls.push(`https://${data[1].cid}.ipfs.nftstorage.link`);
      nfl_urls.push(`https://${data[0].cid}.ipfs.nftstorage.link`);
      setNflUrls(nfl_urls);
    }

    getNFLTargets();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home urls={nflUrls} />} />
          <Route path="/nfl" element={<GETContent url={nflUrls[0]} />} />
          <Route path="/nfl/:id" element={<GETSubContent url={nflUrls[1]} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ urls }) {
  return (
    <div>
      <h1>The following sports are currently available: NFL</h1>
      {urls.length === 0
        ? <p>NFL: Loading...</p>
        : <div>
            <p>NFL: Done</p>
            <p>To route, first use '/#/' followed by the sport, then you can subroute further into any of those players</p>
            <p>{urls[0]}</p>
            <p>{urls[1]}</p>
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
