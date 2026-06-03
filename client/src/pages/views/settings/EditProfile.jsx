import { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
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

  const triggerFileInput = () => {
    document.getElementById('avatar-file-input').click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData(prev => ({
        ...prev,
        avatar: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
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
        <div className="avatar-upload-container">
          <div className="avatar-preview-wrapper" onClick={triggerFileInput}>
            <img src={formData.avatar} alt="Preview" className="avatar-preview-img" />
            <div className="avatar-upload-overlay">
              <Camera size={24} color="#ffffff" />
              <span>Ubah Foto</span>
            </div>
          </div>
          <input 
            type="file" 
            id="avatar-file-input" 
            accept="image/*" 
            onChange={handleImageUpload} 
            style={{ display: 'none' }} 
          />
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
