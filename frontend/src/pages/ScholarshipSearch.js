import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScholarshipSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level_of_study: 'all',
    award_type: 'all',
    min_funds: '',
    max_funds: ''
  });
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch scholarships on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);
  
  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real data from the backend API
      const response = await axios.get("https://scholarpath-ai-backend.onrender.com/scholarships/");
      setScholarships(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching scholarships:", err);
      setError("Failed to fetch scholarships. Please try again.");
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.id]: e.target.value
    });
  };

  const handleSearch = () => {
    fetchScholarships();
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    // Log scholarship data for debugging
    console.log("Scholarship Data:", scholarship);

    // Search term filter (only apply if not using vector search)
    if (searchTerm) {
      const searchFields = [
        scholarship.award_name,
        scholarship.organization,
        scholarship.purpose,
        scholarship.focus,
        scholarship.qualifications,
        scholarship.criteria
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (!searchFields.includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // ✅ FIXED: Level of study filter to handle array format
    if (
      filters.level_of_study !== 'all' &&
      (!scholarship.level_of_study || !scholarship.level_of_study.includes(filters.level_of_study))
    ) {
      return false;
    }

    // Award type filter
    if (filters.award_type !== 'all' && scholarship.award_type !== filters.award_type) {
      return false;
    }

    // Funds filters - simplified for MVP
    if (filters.min_funds && parseFloat(scholarship.funds.replace(/[^0-9.]/g, '')) < parseFloat(filters.min_funds)) {
      return false;
    }

    if (filters.max_funds && parseFloat(scholarship.funds.replace(/[^0-9.]/g, '')) > parseFloat(filters.max_funds)) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <h2 className="mb-4">Find Scholarships</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search scholarships..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex">
            <select 
              className="form-select me-2" 
              id="level_of_study" 
              value={filters.level_of_study}
              onChange={handleFilterChange}
            >
              <option value="all">All Education Levels</option>
              <option value="High School">High School</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Graduate Degree">Graduate Degree</option>
              <option value="Vocational">Vocational</option>
            </select>

            <select 
              className="form-select me-2" 
              id="award_type" 
              value={filters.award_type}
              onChange={handleFilterChange}
            >
              <option value="all">All Award Types</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Grant">Grant</option>
              <option value="Fellowship">Fellowship</option>
              <option value="Prize">Prize</option>
            </select>

            <input 
              type="number" 
              className="form-control me-2" 
              placeholder="Min $" 
              id="min_funds"
              value={filters.min_funds}
              onChange={handleFilterChange}
            />

            <input 
              type="number" 
              className="form-control" 
              placeholder="Max $" 
              id="max_funds"
              value={filters.max_funds}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {loading && <div className="text-center my-4"><div className="spinner-border" role="status"></div></div>}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map(scholarship => (
            <div className="col-md-6 mb-4" key={scholarship.id}>
              <div className="card scholarship-card h-100">
                <div className="card-body">
                  <h3 className="card-title">{scholarship.award_name}</h3>
                  <h6 className="card-subtitle mb-2 text-muted">{scholarship.organization}</h6>
                  <div className="d-flex justify-content-between my-2">
                    <span className="badge bg-success fs-6">{scholarship.funds}</span>
                    <span className="badge bg-warning text-dark fs-6">
                      Deadline: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="mb-2">
                    {scholarship.level_of_study && scholarship.level_of_study.map(level => (
                      <span key={level} className="badge bg-info me-1">{level}</span>
                    ))}
                    <span className="badge bg-secondary">{scholarship.award_type}</span>
                  </div>
                  <p className="card-text"><strong>Purpose:</strong> {scholarship.purpose}</p>
                  <p className="card-text"><strong>Focus:</strong> {scholarship.focus}</p>
                  <p className="card-text"><strong>Qualifications:</strong> {scholarship.qualifications}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button className="btn btn-outline-primary" onClick={() => alert(`Scholarship saved!`)}>Save</button>
                  <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Apply Now</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p>No scholarships found matching your criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScholarshipSearch;
