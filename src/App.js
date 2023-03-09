import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AthleteList from './AthleteList';
import AthleteDetail from './AthleteDetail';

class App extends Component {
  state = {
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQ1ODQ3Yjk1Qjc4NDA2ODcyRGEwODA0ZjY5MDhmNTNlNEQ4MTQ0ZmQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3ODIzMDI2NzU2NSwibmFtZSI6Ik5GVF9QUk9EIn0.TEz6TsKx4lNZGfirumOimOWoc_G1neOgUMt-ttyRUtQ',
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
    const response = await axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
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
