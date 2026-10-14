import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users?_limit=1')
      .then((res) => res.json())
      .then((result) => {
        const formattedData = result.map((item) => ({
          id: item.id,
          name: item.name,
          status: 'Active',
        }));
        setData(formattedData);
      })
      .catch((err) => console.error('Lỗi khi fetch API:', err));
  }, []);

  return (
    <div className="app-container">
      {/* 1. Header */}
      <header className="header">
        <div className="logo">MY APP</div>
        <nav className="nav-links">
          <a href="#home" className="nav-item">Home</a>
          <a href="#link" className="nav-item">Link</a>
          <div className="dropdown">
            <span className="nav-item">Options ▾</span>
          </div>
        </nav>
      </header>

      {/* 2. Banner */}
      <section className="banner">
        <button className="arrow left-arrow">‹</button>
        <div className="banner-content">
          <h1>Good Morning</h1>
          <p>Cybers and Spaces.</p>
          <div className="carousel-indicators">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <button className="arrow right-arrow">›</button>
      </section>

      {/* 3. Content */}
      <main className="content">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.id}</td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {/* 4. Footer */}
      <footer className="footer">
        <p>📍 Hanoi, August 2026</p>
      </footer>
    </div>
  );
}

export default App;