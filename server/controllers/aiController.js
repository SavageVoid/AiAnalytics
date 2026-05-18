// server/controllers/aiController.js — AI Recommendation logic (Q5)

const axios    = require('axios');
const Employee = require('../models/Employee');

/**
 * POST /api/ai/recommend
 * Accepts employee data (or employee ID) and returns AI-generated:
 * - Promotion recommendation
 * - Training suggestions
 * - Performance feedback
 */
const getRecommendation = async (req, res) => {
  try {
    const { employeeId, employeeData } = req.body;

    let employee;

    // If employeeId provided, fetch from DB; otherwise use inline data
    if (employeeId) {
      employee = await Employee.findById(employeeId);
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
    } else if (employeeData) {
      employee = employeeData;
    } else {
      return res.status(400).json({ message: 'Provide either employeeId or employeeData' });
    }

    // ─── Build AI Prompt ────────────────────────────────────────────────────────
    const prompt = `
You are an expert HR analytics AI. Analyze the following employee profile and provide:
1. **Promotion Recommendation**: Should this employee be promoted? Give clear reasoning.
2. **Training Suggestions**: What skills or training programs would benefit this employee?
3. **Performance Feedback**: Provide constructive feedback based on their score.
4. **Overall Rating**: Rate this employee out of 10.

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Skills: ${Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}

Provide a structured, professional response with clear headings.
    `.trim();

    // ─── Call OpenRouter API (OpenAI-compatible) ─────────────────────────────────
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',  // Free model on OpenRouter
        messages: [
          { role: 'system', content: 'You are a professional HR analytics assistant.' },
          { role: 'user',   content: prompt },
        ],
        max_tokens: 800,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  'http://localhost:3000',
          'X-Title':       'AI Employee Analytics',
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    res.status(200).json({
      message: 'AI recommendation generated ✅',
      employee: employee.name || employee.name,
      recommendation: aiText,
    });
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'AI recommendation failed',
      error: error.response?.data?.error?.message || error.message,
    });
  }
};

/**
 * POST /api/ai/rank
 * Ranks multiple employees by performance score + AI analysis
 */
const rankEmployees = async (req, res) => {
  try {
    // Get all employees sorted by performance score (descending)
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    // Build ranking with simple scoring logic
    const ranked = employees.map((emp, index) => ({
      rank: index + 1,
      name: emp.name,
      department: emp.department,
      performanceScore: emp.performanceScore,
      experience: emp.experience,
      skills: emp.skills,
      promotionEligible: emp.performanceScore >= 80 && emp.experience >= 2,
    }));

    res.status(200).json({ message: 'Employee ranking ✅', ranked });
  } catch (error) {
    res.status(500).json({ message: 'Ranking failed', error: error.message });
  }
};

module.exports = { getRecommendation, rankEmployees };
