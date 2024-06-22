import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransTable = ({ transactions: initialTransactions, month }) => {
  const [transactions, setTransactions] = useState(initialTransactions.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setTransactions(initialTransactions.products);
    setSearch('');
    setPage(1);
  }, [initialTransactions, month]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${month}&search=${search}&page=1`);
      setTransactions(response.data.products);
      setPage(1);
    } catch (error) {
      console.error('Error searching transactions:', error);
    }
  };

  const handlePagination = async (newPage) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${month}&search=${search}&page=${newPage}`);
      setTransactions(response.data.products);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="transactions-table">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search transactions"
      />
      <button onClick={handleSearch}>Search</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>${transaction.price.toFixed(2)}</td>
              <td>{transaction.category}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePagination(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => handlePagination(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransTable;