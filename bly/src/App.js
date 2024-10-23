import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [graphUrl, setGraphUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(''); // Reset previous errors
    setAnalysisResult(''); // Reset previous analysis result
    setGraphUrl(''); // Reset previous graph
  };

  // Handle DDoS Detection (/detect)
  const handleDetect = () => {
    if (!selectedFile) {
      setError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true); // Show "Analyzing..." while processing
    setError('');
    setAnalysisResult('');

    fetch('http://localhost:5000/detect', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to analyze the file. Please try again.');
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false); // Hide loading indicator
        if (data.error) {
          setError(data.error);
        } else {
          setAnalysisResult(data);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  // Handle Traffic Visualization (/visualize_traffic)
  const handleVisualize = () => {
    if (!selectedFile) {
      setError('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true); // Show "Generating graph..." while processing

    fetch('http://localhost:5000/visualize_traffic', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          setError(data.error);
        } else {
          setGraphUrl(`http://localhost:5000/${data.image_path}`);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError('Error generating graph: ' + error.message);
      });
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
        <div className="container">
          <button className="navbar-brand" onClick={() => window.location.href = '/'}>Network Security Posture</button>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="nav-link active" type="button" onClick={() => window.location.href = '/home'}>Home</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" type="button" onClick={() => console.log('Features clicked')}>Features</button>
              </li>
              <li className="nav-item">
                <button className="nav-link" type="button" onClick={() => console.log('Documentation clicked')}>Documentation</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="container text-center text-white hero-content">
          <h1 className="display-4 hero-title">Secure Your Network</h1>
          <p className="lead hero-subtitle">Analyze & Visualize PCAP files for DDoS & Malware Threats</p>

          {/* File Upload Input */}
          <div className="mb-3 file-upload-area">
            <input type="file" onChange={handleFileChange} className="form-control form-control-lg" />
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button onClick={handleDetect} className="btn btn-lg btn-outline-light mx-2 px-4 shadow-sm">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Analyzing...
                </>
              ) : (
                'Detect DDoS'
              )}
            </button>
            <button onClick={handleVisualize} className="btn btn-lg btn-outline-secondary mx-2 px-4 shadow-sm">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Visualizing...
                </>
              ) : (
                'Visualize Traffic'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Results Section */}
      <section className="py-5 results-section">
        <div className="container">
          {error && <div className="alert alert-danger shadow-sm">{error}</div>}
          {analysisResult && (
            <div className="card mb-4 shadow-lg result-card">
              <div className="card-body">
                <h4 className="card-title text-success">Analysis Complete</h4>
                <p className="card-text"><strong>Status:</strong> {analysisResult.status}</p>
                <p className="card-text"><strong>Message:</strong> {analysisResult.message}</p>
                <p className="card-text"><strong>Result:</strong> {analysisResult.result}</p>
                <p className="card-text"><strong>Recommendation:</strong> {analysisResult.recommendation}</p>
              </div>
            </div>
          )}
          {graphUrl && (
            <div className="card shadow-lg result-card">
              <div className="card-body text-center">
                <h4 className="card-title">Traffic Visualization</h4>
                <img src={graphUrl} alt="Traffic Graph" className="img-fluid rounded traffic-graph" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p>&copy; 2024 Network Security Framework. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
