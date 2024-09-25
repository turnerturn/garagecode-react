import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [aliases, setAliases] = useState({});

  const dataFileName = 'loads';
  useEffect(() => {
    fetchData();
    fetchAliases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, deliveryDate]);

  const fetchData = async () => {
    try {
      const response = await fetch('/' + dataFileName + '.json');
      const result = await response.json();
      setData(result.loads);
      setFilteredData(result.loads);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAliases = async () => {
    try {
      const response = await fetch('/' + dataFileName + '.properties');
      const text = await response.text();
      const parsedAliases = parseProperties(text);
      setAliases(parsedAliases);
    } catch (error) {
      console.error('Error fetching aliases:', error);
    }
  };

  const parseProperties = (text) => {
    const lines = text.split('\n');
    const result = {};
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    });
    return result;
  };

  const applyFilters = () => {
    let filtered = data;

    if (searchText) {
      const fuse = new Fuse(data, {
        keys: [
          'spot', 'po', 'carrier', 'fein', 'vtc', 'badge', 'status',
          'compartments.recipe', 'compartments.additives', 'compartments.products', 'compartments.destination', 'compartments.gallons', 'compartments.products.authorization.supplier.name', 'compartments.products.authorization.petroex', 'compartments.products.name', 'compartments.products.description'
        ],
        threshold: 0.3,
      });
      filtered = fuse.search(searchText).map(result => result.item);
    }

    if (deliveryDate) {
      filtered = filtered.filter(item => {
        const deliveryStart = new Date(item.deliveryStart);
        const deliveryEnd = new Date(item.deliveryEnd);
        const selectedDate = new Date(deliveryDate);
        return selectedDate >= deliveryStart && selectedDate <= deliveryEnd;
      });
    }

    setFilteredData(filtered);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderAdditionalDetails = (item) => {
    return (
      <div className="additional-details">
        {Object.keys(item).map((key) => {
          if (key === 'compartments') {
            return item[key].map((compartment, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  <strong>Compartment {index + 1}</strong>
                </div>
                <div className="card-body">
                  {renderNestedObject(compartment)}
                </div>
              </div>
            ));
          } else if (typeof item[key] === 'object') {
            return (
              <div key={key} className="card mb-3">
                <div className="card-header">
                  <strong>{aliases[key] || key}</strong>
                </div>
                <div className="card-body">
                  {renderNestedObject(item[key])}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const renderNestedObject = (obj, level = 0) => {
    return (
      <div style={{ marginLeft: level * 20 + 'px' }}>
        {Object.keys(obj).map((key) => {
          if (key === 'additives') {
            return (
              <div key={key}>

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Additive</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obj[key].map((additive, index) => (
                      <tr key={index}>
                        <td>{additive.name}</td>
                        <td>{additive.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          } else if (key === 'products') {
            return (
              <div key={key}>

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Description</th>
                      <th>Supplier</th>
                      <th>Petroex</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obj[key].map((product, index) => (
                      <tr key={index}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.authorization?.supplier?.name}</td>
                        <td>{product.authorization?.petroex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            return (
              <div key={key}>
                <strong>{aliases[key] || key}:</strong>
                {renderNestedObject(obj[key], level + 1)}
              </div>
            );
          }
          return (
            <div key={key}>
              <strong>{aliases[key] || key}:</strong> {obj[key]}
            </div>
          );
        })}
      </div>
    );
  };

  const getHeaders = () => {
    if (data.length === 0) return [];
    const headers = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] !== 'object' && key !== 'audit') {
          headers.add(key);
        }
      });
    });
    return Array.from(headers);
  };

  const headers = getHeaders();

  return (
    <div className="container mt-5">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Filter</h4>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter for rows containing input..."
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="date"
              className="form-control"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              placeholder="Delivery date..."
            />
            <small className="form-text text-muted" style={{ fontStyle: 'italic' }}>
              Delivery Date.
            </small>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <div className="alert alert-info">
          <i className="bi bi-lightbulb-fill"></i> <strong>Pro Tips:</strong> Click on a row to see additional details.
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{aliases[header] || header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <React.Fragment key={item.id}>
                <tr onClick={() => toggleRow(item.id)}>
                  {headers.map((header) => (
                    <td key={header}>{item[header]}</td>
                  ))}
                </tr>
                {expandedRows[item.id] && (
                  <tr>
                    <td colSpan={headers.length}>
                      {renderAdditionalDetails(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;