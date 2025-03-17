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
      
      // For MVP, we'll use mock data that matches the Supabase schema
      // In production, this would call the backend API
      const mockScholarships = [
        {
          id: 1,
          award_name: "Future Leaders Scholarship",
          organization: "National Education Foundation",
          level_of_study: "Bachelor's Degree",
          award_type: "Scholarship",
          purpose: "Supporting future leaders in their academic journey",
          focus: "Leadership",
          qualifications: "Demonstrated leadership skills in community",
          criteria: "Selection based on leadership potential and academic achievement",
          funds: "$5,000",
          deadline: "2025-06-15",
          website: "https://example.com/future-leaders"
        },
        {
          id: 2,
          award_name: "STEM Excellence Award",
          organization: "Tech Innovations Inc.",
          level_of_study: "Bachelor's Degree",
          award_type: "Scholarship",
          purpose: "Promoting excellence in STEM fields",
          focus: "Science, Technology, Engineering, Mathematics",
          qualifications: "High GPA in STEM courses",
          criteria: "Selection based on academic achievement in STEM subjects",
          funds: "$7,500",
          deadline: "2025-05-30",
          website: "https://example.com/stem-excellence"
        },
        {
          id: 3,
          award_name: "Creative Arts Grant",
          organization: "Arts Council",
          level_of_study: "High School",
          award_type: "Grant",
          purpose: "Supporting creative expression in young artists",
          focus: "Visual Arts, Music, Theater, Creative Writing",
          qualifications: "Portfolio of creative work",
          criteria: "Selection based on artistic talent and potential",
          funds: "$3,000",
          deadline: "2025-07-10",
          website: "https://example.com/creative-arts"
        },
        {
          id: 4,
          award_name: "First Generation Scholarship",
          organization: "Education Access Foundation",
          level_of_study: "Associate Degree",
          award_type: "Scholarship",
          purpose: "Supporting first-generation college students",
          focus: "General studies",
          qualifications: "First in family to attend college",
          criteria: "Selection based on academic promise and financial need",
          funds: "$10,000",
          deadline: "2025-04-30",
          website: "https://example.com/first-gen"
        },
        {
          id: 5,
          award_name: "Community Service Scholarship",
          organization: "Volunteer Association",
          level_of_study: "High School",
          award_type: "Scholarship",
          purpose: "Recognizing dedication to community service",
          focus: "Community Service",
          qualifications: "Minimum 100 hours of community service",
          criteria: "Selection based on impact of service and leadership",
          funds: "$2,500",
          deadline: "2025-06-01",
          website: "https://example.com/community-service"
        }
      ];
      
      setScholarships(mockScholarships);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch scholarships. Please try again.");
      setLoading(false);
      console.error(err);
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
    // In production, this would call the backend API with filters
    // For MVP, we'll filter the mock data client-side
    fetchScholarships();
  };
  
  const handleVectorSearch = () => {
    // In production, this would call the vector search API
    // For MVP, we'll use the regular search
    fetchScholarships();
  };
  
  const filteredScholarships = scholarships.filter(scholarship => {
    // Search term filter
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
    
    // Level of study filter
    if (filters.level_of_study !== 'all' && scholarship.level_of_study !== filters.level_of_study) {
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
  
  const saveScholarship = (id) => {
    // In a real app, this would call an API to save the scholarship to the user's saved list
    console.log(`Saving scholarship ${id}`);
    alert(`Scholarship saved to your list!`);
  };
  
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
            <button className="btn btn-secondary" type="button" onClick={handleVectorSearch}>AI Search</button>
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
                    <span className="badge bg-warning text-dark fs-6">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-info me-1">{scholarship.level_of_study}</span>
                    <span className="badge bg-secondary">{scholarship.award_type}</span>
                  </div>
                  <p className="card-text"><strong>Purpose:</strong> {scholarship.purpose}</p>
                  <p className="card-text"><strong>Focus:</strong> {scholarship.focus}</p>
                  <p className="card-text"><strong>Qualifications:</strong> {scholarship.qualifications}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between">
                  <button className="btn btn-outline-primary" onClick={() => saveScholarship(scholarship.id)}>Save</button>
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
