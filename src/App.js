import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AthleteList from './AthleteList';
import AthleteDetail from './AthleteDetail';

class App extends Component {
  state = {
    token: process.env.REACT_APP_TOKEN,
    athletes: [],
    loadingStorage: true
  }

  componentDidMount() {
    const storage = localStorage.getItem('storage');
    if (storage) {
      this.setState({ storage: JSON.parse(storage), loadingStorage: false });
    } else {
      this.fetchStorage();
    }
  }

  async fetchStorage() {
    const { token } = this.state;
    const file_list_request = await this.getResponse(
      'https://api.nft.storage/',
      token,
    );

    const storage_directories = file_list_request.value;
    localStorage.setItem('storage', JSON.stringify(storage_directories));
    this.setState({ storage: storage_directories, loadingStorage: false });
  }

  async getResponse(url, token) {
    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: token,
        },
      });
    return response.data;
  }

  render() {
    const { token, storage, loadingStorage } = this.state;
    
    if (loadingStorage) {
      return <div>Loading...</div>;
    }

    return (
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<AthleteList storage={storage} token={token} />} />
            <Route path="/:number" element={<AthleteDetail storage={storage} token={token} />} />
          </Routes>
        </div>
      </Router>
    );
  }
  
}

export default App;
