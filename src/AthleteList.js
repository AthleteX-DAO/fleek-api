import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function fetchDesiredAthleteList(directory, token) {
  const cid = directory.cid;
  return await getResponse(
    "https://" + cid + ".ipfs.nftstorage.link/",
    token,
  );
}

async function getResponse(url, token) {
  // const response = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
  const response = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
}

function AthleteList({ storage, token }) {
  const [loading, setLoading] = useState(true);
  const [athletes, setAthletes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const athlete_request = await fetchDesiredAthleteList(storage[1], token);
      const athletes = athlete_request.athletes;
      setAthletes(athletes);
      setLoading(false);
    }
    fetchData();
  }, [storage, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {athletes.map((athlete, index) => (
          <li key={index}>{athlete}</li>
        ))}
      </ul>
    </div>
  );
}

export default AthleteList;
