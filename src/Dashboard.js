  import React, { useState, useEffect } from 'react';
  import ReminderService from './ReminderService';
  import { data } from 'react-router-dom';

  function Dashboard({ user, onLogout }) {
    const [reminders, setReminders] = useState([]);
    const [profile, setProfile] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [dueReminders, setDueReminders] = useState([]);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAlert, setShowAlert] = useState(false);
    const [validationError, setValidationError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const logFormSubmitted = (data) => {
      console.log("form submitted successfully!", data);
    };

    const [newReminder, setNewReminder] = useState({
      firstName: '',
      name: '',
      lastName: '',
      email: '',
      mobile: '',
      whatsapp: '',
      pan: '',
      dob: ''
    });

    const [reminderDetails, setReminderDetails] = useState([]);

    const [newDetail, setNewDetail] = useState({
      category: 'Personal',
      lastReminderDate: '',
      description: ''
    });

    useEffect(() => {
      setReminders(ReminderService.getUserReminders());
      setProfile(ReminderService.getUserProfile());
      setDueReminders(ReminderService.getDueReminders());
    }, []);

    const handleSaveProfile = () => {
      ReminderService.saveUserProfile(profile);
      setEditMode(false);
    };

    const handleSubmit = () => {
      const errors = {};
      if (!newReminder.firstName.trim()) errors.firstName = true;
      if (!newReminder.email.trim()) errors.email = true;
      if (!newReminder.mobile.trim()) errors.mobile = true;
      if (!newReminder.mobile.trim()) errors.lastName = true;
      if (!newReminder.whatsapp.trim()) errors.whatsapp= true;
      if (!newReminder.pan.trim()) errors.pan = true;
      if (!newReminder.dob.trim()) errors.dob = true;

      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setValidationError('Please fill all required details');
        return;
      }
      
      if (reminderDetails.length === 0) {
        setValidationError('Please add at least one reminder detail');
        return;
      }
      
      setValidationError('');
      setFieldErrors({});
      
      try {
        ReminderService.saveUserReminder({ 
          ...newReminder,
          date: new Date().toISOString(),
          reminderDetails: reminderDetails
        });
        
        setReminders(ReminderService.getUserReminders());
        setDueReminders(ReminderService.getDueReminders());
        setNewReminder({
          firstName: '',
          name: '',
          lastName: '',
          email: '',
          mobile: '',
          whatsapp: '',
          pan: '',
          dob: ''

        });
        setReminderDetails([]);
        setNewDetail({
          category: 'Personal',
          lastReminderDate: '',
          description: ''
        });
        setShowReminderForm(false);
        setValidationError('');
        

      } catch (error) {
        console.error('Error creating reminder:', error.message);
      }
    };

    const handleSendNotification = (reminderId, type) => {
      ReminderService.sendNotification(reminderId, type);
      setReminders(ReminderService.getUserReminders()); 
      setDueReminders(ReminderService.getDueReminders());

    };

    const handleDeleteReminder = (reminderId) => {
      if (window.confirm('Are you sure you want to delete this reminder?')) {
        ReminderService.deleteUserReminder(reminderId);
        setReminders(ReminderService.getUserReminders());
        setDueReminders(ReminderService.getDueReminders());

      }
    };

    return (
      <div style={{ padding: '0', fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f2f5f9ff 0%, #efefefff 100%)', width: '100vw', height: '100vh', overflow: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '0 0 15px 15px', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ color: 'white', margin: '0' }}>Auto Reminder System</h1>
          </div>
          <div>
            <span style={{ marginRight: '15px', color: 'white', fontWeight: '500' }}>Welcome, {profile.name || user.email}</span>
            <button onClick={onLogout} style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', marginRight: '10px', fontSize: '16px' }}>
              Logout
            </button>
            <button onClick={() => setShowReminderForm(!showReminderForm)} style={{ padding: '8px 16px', background: '#095cd8ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            + New Reminder
            </button>
          </div>
        </header>
        
        {showReminderForm && (
          <div style={{ position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: '1000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '600px', background: 'white', borderRadius: '12px', padding: '30px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: '0', color: '#333', fontSize : '22px', fontWeight: 'bold' }}>Create New Reminder</h3>
                <button onClick={() => { setShowReminderForm(false); setValidationError(''); setFieldErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', padding: '0', width: '30px', height: '30px' }}>×</button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>First Name <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      placeholder="Enter first name" 
                      value={newReminder.firstName} 
                      onChange={(e) => { setNewReminder({...newReminder, firstName: e.target.value}); setValidationError(''); setFieldErrors({...fieldErrors, firstName: false}); }} 
                      style={{ width: '100%', padding: '12px', border: `2px solid ${fieldErrors.firstName ? '#dc3545' : '#e1e5e9'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>Last Name <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      placeholder="Enter last name" 
                      value={newReminder.lastName} 
                      onChange={(e) => setNewReminder({...newReminder, lastName: e.target.value})} 
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>Email <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      type="email"
                      placeholder="Enter email" 
                      value={newReminder.email} 
                      onChange={(e) => { setNewReminder({...newReminder, email: e.target.value}); setFieldErrors({...fieldErrors, email: false}); }} 
                      style={{ width: '100%', padding: '12px', border: `2px solid ${fieldErrors.email ? '#dc3545' : '#e1e5e9'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>Mobile Number <span style={{ color: '#dc3545' }}>*</span></label>
              
                    <input 
                      type="tel"
                      placeholder="Enter mobile number" 
                      value={newReminder.mobile} 
                      onChange={(e) => { setNewReminder({...newReminder, mobile: e.target.value}); setFieldErrors({...fieldErrors, mobile: false}); }} 
                      style={{ width: '100%', padding: '12px', border: `2px solid ${fieldErrors.mobile ? '#dc3545' : '#e1e5e9'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>WhatsApp Number <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      type="tel"
                      placeholder="Enter WhatsApp number" 
                      value={newReminder.whatsapp} 
                      onChange={(e) => setNewReminder({...newReminder, whatsapp: e.target.value})} 
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>PAN Number <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      placeholder="Enter PAN number" 
                      value={newReminder.pan} 
                      onChange={(e) => setNewReminder({...newReminder, pan: e.target.value.toUpperCase()})} 
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                      maxLength="10"
                    />
                  </div>
                  <div style={{ flex: '1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#555', fontSize: '14px' }}>Date of Birth(DOB) <span style={{ color: '#dc3545' }}>*</span></label>
                    <input 
                      type="date"
                      value={newReminder.dob} 
                      onChange={(e) => setNewReminder({...newReminder, dob: e.target.value})} 
                      style={{ width: '100%', padding: '12px', border: '2px solid #e1e5e9', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.3s' }} 
                      onFocus={(e) => e.target.style.borderColor = '#095cd8ff'}
                      onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>Reminder Details</h4>
                
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
                  <select 
                    value={newDetail.category} 
                    onChange={(e) => setNewDetail({...newDetail, category: e.target.value})} 
                    style={{ flex: '1', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Finance">Finance</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                  <input 
                    type="date" 
                    value={newDetail.lastReminderDate} 
                    onChange={(e) => setNewDetail({...newDetail, lastReminderDate: e.target.value})} 
                    style={{ flex: '1', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} 
                  />
                  <input 
                    placeholder="Enter description" 
                    value={newDetail.description} 
                    onChange={(e) => setNewDetail({...newDetail, description: e.target.value})} 
                    style={{ flex: '2', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }} 
                  />
                  <button
                    onClick={() => {
                      if (newDetail.description.trim()) {
                        setReminderDetails([...reminderDetails, { ...newDetail, id: Date.now() }]);
                        setNewDetail({ category: 'Personal', lastReminderDate: '', description: '' });
                        setShowAlert(false);
                        setValidationError('');
                        setFieldErrors({});
                      } else {
                        setShowAlert(true);
                      }
                    }}
                    style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Add
                  </button>
                </div>
                {showAlert && (
                  <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '4px', border: '1px solid #f5c6cb', marginTop: '10px', fontSize: '12px' }}>
                  </div>
                )}
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#555', borderBottom: '1px solid #ddd' }}>Category</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#555', borderBottom: '1px solid #ddd' }}>Last Reminder Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#555', borderBottom: '1px solid #ddd' }}>Description</th>
                        <th style={{ padding: '10px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#555', borderBottom: '1px solid #ddd' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reminderDetails.map((detail, index) => (
                        <tr key={detail.id} style={{ borderBottom: index < reminderDetails.length - 1 ? '1px solid #eee' : 'none' }}>
                          <td style={{ padding: '10px', fontSize: '12px', color: '#333' }}>
                            <span style={{ 
                              background: detail.category === 'Finance' ? '#28a745' : detail.category === 'Insurance' ? '#17a2b8' : '#6f42c1', 
                              color: 'white', 
                              padding: '2px 8px', 
                              borderRadius: '12px', 
                              fontSize: '10px' 
                            }}>
                              {detail.category}
                            </span>
                          </td>
                          <td style={{ padding: '10px', fontSize: '12px', color: '#333' }}>
                            {detail.lastReminderDate || 'Not set'}
                          </td>
                          <td style={{ padding: '10px', fontSize: '12px', color: '#333' }}>
                            {detail.description || 'No description'}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center' }}>
                            <button 
                              onClick={() => setReminderDetails(reminderDetails.filter(d => d.id !== detail.id))}
                            style={{ background: '#dc3545', color: 'white', border: 'none', borderreduce: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '10px' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {validationError && (
                <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', border: '1px solid #f5c6cb', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                  ⚠️ {validationError}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowReminderForm(false); setValidationError(''); setFieldErrors({}); }} style={{ padding: '12px 25px', background: '#ffffffff', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Cancel
                </button>
                <button onClick={handleSubmit} style={{ padding: '12px 25px', background: '#c13030ff', color: '#ebebebff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                  Create Reminder
                </button> 
              </div>
            </div>
          </div>
        )}
        {showProfile && (
          <div style={{ position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #f2f5f9ff 0%, #efefefff 100%)', zIndex: '999', overflow: 'auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', marginBottom: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '0 0 15px 15px', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
                <h1 style={{ color: 'white', margin: '0' }}>User Profile</h1>
              </div>
              <div>
                <span style={{ marginRight: '15px', color: 'white', fontWeight: '500' }}>Welcome, {profile.name || user.email}</span>
                <button onClick={onLogout} style={{ padding: '8px 16px', background: '#de2525ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                  Logout
                </button>
              </div>
            </header>
            <div style={{ padding: '20px', border: 'none', borderRadius: '16px', background: 'linear-gradient(135deg, #ffffffff 0%, #fbfbfbff 100%)', boxShadow: '0 8px 25px rgba(168, 237, 234, 0.3)', margin: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: '0', color: '#2d3436', fontWeight: 'bold' }}>Profile Information</h2>
                <button onClick={() => { if (editMode) { handleSaveProfile(); } setEditMode(!editMode); }} style={{ background: '#1ade00ff', color: '#faf8f8ff', border: '1px solid #ddd', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}>
                  {editMode ?"" : ' Edit'}
                </button>
              </div>
            
            {editMode ? (
              <div>
                <input placeholder="Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} required style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <input placeholder="Email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <input placeholder="Mobile" value={profile.mobile} onChange={(e) => setProfile({...profile, mobile: e.target.value})} required style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <input placeholder="WhatsApp" value={profile.whatsapp} onChange={(e) => setProfile({...profile, whatsapp: e.target.value})} required style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <input placeholder="PAN" value={profile.pan} onChange={(e) => setProfile({...profile, pan: e.target.value})} style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <input type="date" placeholder="DOB" value={profile.dob} onChange={(e) => setProfile({...profile, dob: e.target.value})} style={{ width: '100%', margin: '5px 0', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#ffffff', outline: 'none' }} />
                <button onClick={handleSaveProfile} style={{ padding: '12px 20px', background: '#fcfcfcff', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
                  Save
                </button>
              </div>
            ) : (
              <div>
                <p>Name: {profile.name || 'Not set'}</p>
                <p>Email: {profile.email}</p>
                <p>Mobile: {profile.mobile || 'Not set'}</p>
                <p>WhatsApp: {profile.whatsapp || 'Not set'}</p>
                <p>PAN: {profile.pan ? profile.pan.replace(/(.{4})(.*)(.{4})/, '$1****$3') : 'Not set'}</p>
                <p>DOB: {profile.dob ? '****-**-' + profile.dob.slice(-2) : 'Not set'}</p>
              </div>
            )}
            </div>
          </div>
        )}
        
        {!showProfile && (
          <div style={{ margin: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '15px 20px', background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)', borderRadius: '16px', boxShadow: '0 8px 25px rgba(255, 234, 167, 0.3)' }}>
              <h2 style={{ color: '#333', fontWeight: 'bold', margin: '0', marginRight: '15px' }}>My Reminders</h2>
              <span style={{ background: '#ffffff', color: '#333', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #ddd' }}>({reminders.filter(r => selectedCategory === 'All' || r.category === selectedCategory).length})</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['All', 'Personal', 'Finance', 'Insurance'].map(category => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{ 
                    padding: '8px 16px', 
                    background: selectedCategory === category ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100% ,#667eea)' : '#ffffff', 
                    color: selectedCategory === category ? 'white' : '#333', 
                    border: '1px solid #ddd', 
                    borderRadius: '20px', 
                    cursor: 'pointer', 
                    fontSize: '14px',
                    fontWeight: selectedCategory === category ? 'bold' : 'normal',
                    boxShadow: selectedCategory === category ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
              {reminders.filter(r => {
                if (selectedCategory === 'All') return true;
                if (r.reminderDetails && r.reminderDetails.length > 0) {
                  return r.reminderDetails.some(detail => detail.category === selectedCategory);
                }
                return r.category === selectedCategory;
              
              }).map(r => (
                <div key={r.id} style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <strong style={{ fontSize: '16px', color: '#333' }}>{r.firstName} {r.name} {r.lastName}</strong>
                    <button onClick={() => handleDeleteReminder(r.id)} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Reminder">
                      🗑️
                    </button>
                  </div>
                  {r.reminderDetails && r.reminderDetails.length > 0 && (
                    <div style={{ marginBottom: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px', fontWeight: 'bold' }}>Contact Details</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px' }}>
                        <div><strong>Email:</strong> {r.email || 'Not provided'}</div>
                        <div><strong>Mobile:</strong> {r.mobile || 'Not provided'}</div>
                        <div><strong>WhatsApp:</strong> {r.whatsapp || 'Not provided'}</div>
                        <div><strong>PAN:</strong> {r.pan ? r.pan.replace(/(.{4})(.*)(.{4})/, '$1****$3') : 'Not provided'}</div>
                        <div><strong>DOB:</strong> {r.dob ? r.dob : 'Not provided'}</div>
                      </div>
                    </div>
                  )}
                  {r.reminderDetails && r.reminderDetails.map((detail, index) => (
                    <div key={index} style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <span style={{ 
                          background: detail.category === 'Finance' ? '#28a745' : detail.category === 'Insurance' ? '#17a2b8' : '#6f42c1', 
                          color: 'white', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {detail.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#666' }}>Description: {detail.description || 'No description'}</div>
                      {detail.lastReminderDate && <div style={{ fontSize: '12px', color: '#888', marginTop: '3px' }}>Date: {detail.lastReminderDate}</div>}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '15px' }}>
                    <button onClick={() => handleSendNotification(r.id, 'email')} style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Email</button>
                    <button onClick={() => handleSendNotification(r.id, 'sms')} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>SMS</button>
                    <button onClick={() => handleSendNotification(r.id, 'whatsapp')} style={{ padding: '8px 16px', background: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>WhatsApp</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  export default Dashboard;
