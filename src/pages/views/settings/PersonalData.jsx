import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../../../context/AppContext';
import './SettingsLayout.css';

const PersonalData = ({ onBack }) => {
  const { userProfile, updateProfile } = useAppContext();
  const [formData, setFormData] = useState({
    age: userProfile.age,
    gender: userProfile.gender,
    weight: userProfile.weight,
    height: userProfile.height
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
        <h2 className="settings-title">Data Personal</h2>
      </div>
      
      <div className="settings-content">
        <div className="settings-form-group">
          <label className="settings-label">Jenis Kelamin</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="settings-input">
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Umur (Tahun)</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="settings-input" />
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Berat Badan (kg)</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="settings-input" />
        </div>

        <div className="settings-form-group">
          <label className="settings-label">Tinggi Badan (cm)</label>
          <input type="number" name="height" value={formData.height} onChange={handleChange} className="settings-input" />
        </div>

        <button className="settings-save-btn" onClick={handleSave}>Simpan Perubahan</button>
      </div>
    </div>
  );
};

export default PersonalData;
