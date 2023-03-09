import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

async function fetchFile(directory, fileName, token) {
    let cid = directory.cid;
    const athlete_file = await getResponse(
        "https://" + cid + ".ipfs.nftstorage.link/" + fileName,
        token,
    );
    
    // console.log("Fetched Athlete via ID: " + JSON.stringify(athlete_file));
    return athlete_file;
}

async function getResponse(url, token) {
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
        headers: {
            Authorization: token,
        },
    });
    return response.data;
}

function AthleteDetail({ storage, token }) {
    const [athleteFile, setAthleteFile] = useState(null);
    const { number } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchFile(storage[0], number, token);
            setAthleteFile(JSON.stringify(data));
        };
        fetchData();
    }, [number, storage, token]);

    return (
        <div>
            <h1>Number: {number}</h1>
            {athleteFile ? <p>{athleteFile}</p> : <p>Loading...</p>}
        </div>
    );
}

export default AthleteDetail;
