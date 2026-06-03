import './Greeting.css';

const Greeting = () => {
  return (
    <div className="greeting-container">
      <h2 className="greeting-title">Halo, Pelopor<br/>Kesehatan</h2>
      <p className="greeting-subtitle text-muted">
        Berikut adalah ringkasan nutrisi Anda hari ini.
      </p>
    </div>
  );
};

export default Greeting;
