const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

const models = [
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
  'deepseek/deepseek-v4-flash:free',
  'z-ai/glm-4.5-air:free',
  'cognitivecomputations/dolphin-mistral-24b-venice-edition:free'
];

async function testAll() {
  for (const model of models) {
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: model,
          messages: [{ role: 'user', content: 'Say hello' }]
        },
        { headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}` } }
      );
      console.log(`✅ SUCCESS: ${model} works!`);
    } catch (err) {
      console.error(`❌ FAIL: ${model} - ${err.response ? err.response.data.error.message : err.message}`);
    }
  }
}
testAll();
