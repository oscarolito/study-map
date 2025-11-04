export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '20px' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '24px' 
        }}>
          Study Map
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          color: '#4b5563', 
          marginBottom: '32px' 
        }}>
          Explore Masters in Finance Worldwide
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280', 
          marginBottom: '48px' 
        }}>
          Discover and compare top Masters in Finance programs from universities around the globe.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '32px', 
          marginBottom: '48px' 
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>200+</div>
            <div style={{ color: '#4b5563' }}>Programs</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>50+</div>
            <div style={{ color: '#4b5563' }}>Countries</div>
          </div>
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '24px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>100+</div>
            <div style={{ color: '#4b5563' }}>Universities</div>
          </div>
        </div>

        <div>
          <button style={{
            background: '#2563eb',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 32px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '16px'
          }}>
            Start Exploring (Coming Soon)
          </button>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            🚀 Site successfully deployed on Vercel!
          </p>
        </div>
      </div>
    </div>
  )
}