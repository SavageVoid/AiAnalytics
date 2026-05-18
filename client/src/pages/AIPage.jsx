// client/src/pages/AIPage.jsx — Standalone AI Recommendation Page

import AIRecommendation from '../components/AIRecommendation';

const AIPage = () => {
  return (
    <div className="container" style={{ paddingTop: '20px', maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">AI Insights</h1>
        <p className="page-subtitle">
          Enter any employee profile to get AI-powered promotion & training recommendations
        </p>
      </div>
      <AIRecommendation />
    </div>
  );
};

export default AIPage;
