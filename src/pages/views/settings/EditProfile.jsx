import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../../context/AppContext';
import './SettingsLayout.css';

const EditProfile = ({ onBack }) => {
  const { userProfile, updateProfile } = useAppContext();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    avatar: userProfile.avatar
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile(formData);
    onBack();
  };

  return (
    <div className="settings-view-container">
      <div className="settings-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="settings-title">Edit Profil</h2>
      </div>
      
      <div className="settings-content">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <img src={formData.avatar} alt="Preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
        </div>
        
        <div className="settings-form-group">
          <label className="settings-label">URL Foto Profil</label>
          <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="settings-input" />
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Nama Lengkap</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="settings-input" />
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="settings-input" />
        </div>

        <button className="settings-save-btn" onClick={handleSave}>Simpan Perubahan</button>
      </div>
    </div>
  );
};

export default EditProfile;
