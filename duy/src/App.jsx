import React, { useEffect, useState, useMemo } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  
  // State quản lý Filter, Sort, Paging
  const [search, setSearch] = useState({ name: '', id: '', status: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Mỗi trang hiển thị 10 bản ghi

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((result) => {
        // Tạo thêm dữ liệu mẫu giả lập 50 dòng để test Paging 10 record/trang
        const extendedData = [];
        for (let i = 0; i < 5; i++) {
          result.forEach((user, idx) => {
            const newId = i * 10 + user.id;
            extendedData.push({
              id: newId,
              name: `${user.name} ${i > 0 ? `(${i + 1})` : ''}`,
              status: newId % 2 === 0 ? 'Active' : 'Inactive',
            });
          });
        }
        setData(extendedData);
      })
      .catch((err) => console.error('Lỗi khi fetch API:', err));
  }, []);

  // 1. Xử lý Lọc (Filter)
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = item.name.toLowerCase().includes(search.name.toLowerCase());
      const matchId = item.id.toString().includes(search.id);
      const matchStatus = item.status.toLowerCase().includes(search.status.toLowerCase());
      return matchName && matchId && matchStatus;
    });
  }, [data, search]);

  // 2. Xử lý Sắp xếp (Sort)
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // 3. Xử lý Phân trang (Paging 10 records / page)
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage]);

  // Hàm đổi cột sắp xếp
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Hàm đổi từ khóa tìm kiếm
  const handleSearchChange = (field, value) => {
    setSearch((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset về trang 1 khi lọc
  };

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

      {/* 3. Content (Grid view với Filter, Sort & Paging) */}
      <main className="content">
        <div className="grid-container">
          <table className="data-table">
            <thead>
              {/* Dòng Tiêu đề + Nút Sắp xếp */}
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-th">
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('id')} className="sortable-th">
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
                <th onClick={() => handleSort('status')} className="sortable-th">
                  Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕'}
                </th>
              </tr>
              {/* Dòng Ô nhập Lọc (Filter Inputs) */}
              <tr className="filter-row">
                <th>
                  <input
                    type="text"
                    placeholder="Lọc Name..."
                    value={search.name}
                    onChange={(e) => handleSearchChange('name', e.target.value)}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Lọc ID..."
                    value={search.id}
                    onChange={(e) => handleSearchChange('id', e.target.value)}
                  />
                </th>
                <th>
                  <input
                    type="text"
                    placeholder="Lọc Status..."
                    value={search.status}
                    onChange={(e) => handleSearchChange('status', e.target.value)}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.id}</td>
                    <td>{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                    Không tìm thấy dữ liệu phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Thanh Phân Trang (Paging) ở cuối Grid */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ‹ Trang trước
            </button>
            <span className="page-info">
              Trang <strong>{currentPage}</strong> / {totalPages} (Tổng: {sortedData.length} dòng)
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Trang sau ›
            </button>
          </div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="footer">
        <p>📍 Hanoi, August 2026</p>
      </footer>
    </div>
  );
}

export default App;