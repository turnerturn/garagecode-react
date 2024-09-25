import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/loads.json');
            const jsonData = await response.json();
            setData(jsonData.loads);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRowClick = (index) => {
        const currentExpandedRows = expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(index);

        const newExpandedRows = isRowCurrentlyExpanded
            ? currentExpandedRows.filter(id => id !== index)
            : currentExpandedRows.concat(index);

        setExpandedRows(newExpandedRows);
    };

    const renderRow = (item, index) => {
        const clickCallback = () => handleRowClick(index);
        const itemRows = [
            <tr key={`row-data-${index}`} onClick={clickCallback}>
                {Object.keys(item).map((key, i) => (
                    typeof item[key] !== 'object' ? <td key={i}>{item[key]}</td> : null
                ))}
            </tr>
        ];

        if (expandedRows.includes(index)) {
            itemRows.push(
                <tr key={`row-expanded-${index}`}>
                    <td colSpan={Object.keys(item).length}>
                        <div className="alert alert-info">
                            <strong>Additional Details:</strong>
                            <pre>{JSON.stringify(item, null, 2)}</pre>
                        </div>
                    </td>
                </tr>
            );
        }

        return itemRows;
    };

    return (
        <div className="container-fluid mt-5">
            <div className="alert alert-info">
                <i className="bi bi-lightbulb-fill"></i> <strong>Pro Tips:</strong> Click on a row to see additional details.
            </div>
            <h2>Data Table</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            {data.length > 0 && Object.keys(data[0]).map((key) => (
                                typeof data[0][key] !== 'object' ? <th key={key}>{key}</th> : null
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => renderRow(item, index))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;