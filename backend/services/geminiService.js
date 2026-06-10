const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK_QUESTIONS = {
  aptitude: [
    { question: "A tank is filled by Pipe A in 8 hours and Pipe B in 12 hours. Pipe C empties it in 6 hours. If A and B run together for 2 hours and then C is opened, how long will it take to empty the tank from that point?", options: ["3 hours", "4 hours", "5 hours", "6 hours"], answer: "4 hours" },
    { question: "A train 180 m long crosses a platform 120 m long in 15 seconds. What is its speed in km/h?", options: ["36 km/h", "43.2 km/h", "54 km/h", "72 km/h"], answer: "43.2 km/h" },
    { question: "A mixture contains milk and water in the ratio 5:3. If 8 litres of water are added, the ratio becomes 5:7. Find the original quantity of milk.", options: ["10 litres", "15 litres", "20 litres", "25 litres"], answer: "15 litres" },
    { question: "A sum of money becomes Rs. 1,728 at 20% compound interest compounded annually for 2 years. Find the principal.", options: ["Rs. 1,200", "Rs. 1,250", "Rs. 1,280", "Rs. 1,500"], answer: "Rs. 1,200" },
    { question: "A, B and C invest in a business in the ratio 3:4:5. After 6 months, A increases his capital by 50%. If the annual profit is Rs. 18,000, how much does B get?", options: ["Rs. 4,800", "Rs. 5,000", "Rs. 5,400", "Rs. 6,000"], answer: "Rs. 5,400" },
    { question: "A boat travels 24 km upstream in 6 hours and 36 km downstream in 4 hours. Find the speed of the stream.", options: ["1 km/h", "2 km/h", "3 km/h", "4 km/h"], answer: "2 km/h" },
    { question: "A product has successive discounts of 10% and 20%. What is the equivalent single discount?", options: ["28%", "30%", "32%", "35%"], answer: "28%" },
    { question: "A town's population increases by 10% in the first year and decreases by 10% in the second year. If the current population is 99,000, what was it two years ago?", options: ["100,000", "110,000", "121,000", "90,000"], answer: "100,000" },
    { question: "A cone of height 12 cm is placed inside a cylinder of same height and radius 5 cm. Find the volume of the empty space left in the cylinder.", options: ["100π cm³", "150π cm³", "200π cm³", "250π cm³"], answer: "100π cm³" },
    { question: "A bag contains 4 red, 5 blue and 3 green balls. If two balls are drawn at random without replacement, what is the probability that both are blue?", options: ["10/66", "20/66", "25/66", "30/66"], answer: "10/66" },
    { question: "A number when divided by 6 leaves remainder 4 and when divided by 8 leaves remainder 6. What is the least such number?", options: ["10", "22", "34", "46"], answer: "22" },
    { question: "The ages of three brothers are in the ratio 2:3:5. If the sum of their ages is 60, how old is the youngest?", options: ["10", "12", "15", "20"], answer: "10" },
    { question: "Two cyclists start from the same point at 8 km/h and 12 km/h. After 2 hours, how far apart are they if they move in opposite directions?", options: ["20 km", "24 km", "40 km", "48 km"], answer: "40 km" },
    { question: "A shopkeeper marks an item 25% above cost price and gives 10% discount. What is the profit percentage?", options: ["12.5%", "13.5%", "15%", "17.5%"], answer: "12.5%" },
    { question: "A worker A completes a job in 10 days and worker B in 15 days. They work together for 4 days, then B leaves. How many more days will A take to finish the remaining work?", options: ["1 day", "2 days", "3 days", "4 days"], answer: "2 days" },
  ],
  reasoning: [
    { question: "A is the mother of B. C is the sister of A. D is the daughter of C. How is D related to B?", options: ["Granddaughter", "Daughter", "Sister", "Cannot be determined"], answer: "Granddaughter" },
    { question: "Find the next number in the series: 2, 6, 12, 20, 30, ?", options: ["42", "44", "46", "48"], answer: "42" },
    { question: "If A + B means A is greater than B, A × B means A is equal to B, and A - B means A is less than B, which of the following is true if 5 × 5?", options: ["5 is greater than 5", "5 is less than 5", "5 is equal to 5", "None"], answer: "5 is equal to 5" },
    { question: "All pens are blue. Some blue things are pencils. Some pencils are not pens. Which statement is definitely true?", options: ["All pencils are pens", "Some pens are pencils", "Some blue things are pencils", "All blue things are pens"], answer: "Some blue things are pencils" },
    { question: "In a code, 2413 means 'tea is hot'. 3142 means 'hot and sweet'. 5321 means 'tea is sweet'. Which digit stands for 'tea'?", options: ["2", "3", "4", "5"], answer: "2" },
    { question: "A person walks 5 km north, turns right, walks 3 km, turns right, walks 5 km, turns left, walks 4 km. How far is he from the start?", options: ["3 km", "4 km", "5 km", "7 km"], answer: "4 km" },
    { question: "Six people A, B, C, D, E and F sit in a circle. B is opposite C, A is to the right of B, D is between E and F. Who is between A and C?", options: ["B", "D", "E", "F"], answer: "D" },
    { question: "If INPUT becomes OUTPUT in one step, what will be the output for DATA?", options: ["EBCB", "EBCF", "EBCE", "EBCG"], answer: "EBCB" },
    { question: "If P > Q and Q = R, which of the following is definitely true?", options: ["P > R", "P < R", "P = R", "Cannot be determined"], answer: "P > R" },
    { question: "Which day comes 3 days after the day before yesterday?", options: ["Today", "Tomorrow", "Yesterday", "Day after tomorrow"], answer: "Tomorrow" },
    { question: "If 12 is related to 3, then 20 is related to 5. Which of the following options follows the same pattern?", options: ["28 is related to 7", "30 is related to 6", "24 is related to 4", "18 is related to 3"], answer: "30 is related to 6" },
    { question: "Statements: Some cats are dogs. All dogs are birds. Some birds are not cats. Which conclusion is possible?", options: ["All cats are birds", "Some birds are cats", "All dogs are cats", "No conclusion"], answer: "Some birds are cats" },
    { question: "In a sequence of letters, A, C, F, J, ? what comes next?", options: ["L", "M", "N", "O"], answer: "O" },
    { question: "A man is facing north. He turns 90° clockwise, then 180° anticlockwise, then 45° clockwise. Which direction is he facing now?", options: ["North-East", "South-East", "North-West", "South-West"], answer: "North-East" },
    { question: "Choose the word that best completes the analogy: Book : Read :: Pen : ?", options: ["Write", "Eat", "Sleep", "Run"], answer: "Write" },
  ],
};

const generateQuestions = async (category, count, excludeQuestions = []) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Strong entropy to force different output every single call
  const entropy = `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

  const avoidList = excludeQuestions
    .slice(0, 50)
    .map((q, i) => `${i + 1}. ${q}`)
    .join("\n");

  const aptitudePrompt = `
You are a strict exam question generator for a competitive aptitude test.
Session ID: ${entropy}

YOUR ONLY JOB: Generate ${count} UNIQUE, EXTREMELY HARD quantitative aptitude questions at the hardest competitive-exam level for a community assessment, with deep multi-step reasoning, layered calculations, and elite-level difficulty.

CRITICAL VARIETY RULE:
- Do NOT repeat the same question pattern, same topic, or same solving style.
- Mix different question types across the set: pipes/cisterns, trains, mixtures, compound interest, partnership, work-wages, boats-streams, discounts, population/depreciation, mensuration, probability, percentage change, number system, age problems, and speed/meeting-point problems.
- Make every question feel different from the previous one.

MANDATORY DIFFICULTY RULES — violating any rule means the question is REJECTED:
1. Make the questions genuinely hardest-level, not just ordinary hard.
2. Avoid all simple arithmetic, direct percentage, basic ratio, and one-step formula questions.
3. Every question must require multi-step reasoning, layered calculations, or interpretation of data.
4. Use complex values, realistic data, and non-trivial numbers that demand careful setup.
5. Wrong options must be results of common mistakes (wrong formula, missed step, sign error, wrong assumption).
6. BANNED question types:
   - Basic arithmetic like 10+10, 25% of 240, simple average, direct profit/loss
   - One-step or two-step formula substitution
   - Simple HCF/LCM of small integers
   - Basic number series like 2,4,6,8
   - Easy work, speed, or ratio questions

TOPICS — use a DIFFERENT topic for each question, cycle through all:
1. Pipes & Cisterns with 3 pipes (2 filling + 1 emptying)
2. Trains crossing each other in opposite/same direction with platform
3. Mixture & Alligation with 3 components
4. Compound Interest with half-yearly/quarterly compounding
5. Partnership with time-weighted capital
6. Work & Wages with efficiency ratios
7. Boats & Streams with upstream/downstream time ratio
8. Successive Discount vs equivalent single discount
9. Population growth/depreciation with 2 variables changing
10. Mensuration: cone inside cylinder, sphere inside cube
11. Probability of compound events from a deck or mixed bag
12. Percentage change on base that itself changed
13. Number system: remainder when divided by composite number
14. Age problems with 3 persons and 2 time points
15. Speed: meeting point problems with head-start

HARD EXAMPLE (this is the minimum difficulty you must match or exceed):
"Pipe A fills a tank in 16 hrs, pipe B in 24 hrs. Pipe C can empty it in 12 hrs. A and B are opened at 8 AM. At what time should C be opened so the tank is exactly full at 8 PM?"
Options: ["2 PM", "3 PM", "4 PM", "5 PM"] Answer: "2 PM"

DO NOT REPEAT OR REPHRASE ANY OF THESE QUESTIONS:
${avoidList || "(none)"}

Return ONLY a raw JSON array. No markdown. No explanation. No extra text whatsoever.
Format:
[{"question":"...","options":["...","...","...","..."],"answer":"..."}]
`;

  const reasoningPrompt = `
You are a strict exam question generator for a competitive reasoning test.
Session ID: ${entropy}

YOUR ONLY JOB: Generate ${count} UNIQUE, EXTREMELY HARD logical reasoning questions at the hardest competitive-exam level for a community assessment, with deep multi-step reasoning, layered deductions, and elite-level difficulty.

CRITICAL VARIETY RULE:
- Do NOT repeat the same question pattern, same topic, or same solving style.
- Mix different reasoning formats across the set: blood relations, number/letter series, syllogism, coding-decoding, directions, seating arrangements, input-output, inequalities, calendars, analogies, ranking, data sufficiency, alphanumeric series, and word decoding.
- Make every question feel different from the previous one.

MANDATORY DIFFICULTY RULES — violating any rule means the question is REJECTED:
1. Make the questions genuinely hardest-level, not just ordinary hard.
2. Blood relation: minimum 4 relationship hops, include gender ambiguity
3. Series: use second-order differences, prime-based gaps, or alternating operations
4. Syllogism: minimum 3 statements, conclusion must test possibility not certainty
5. Coding: use multi-layer encoding (position shift + reversal + symbol swap)
6. Direction: minimum 5 turns, ask for both direction AND distance
7. Seating: circular arrangement with minimum 6 people and 5 conditions
8. BANNED question types:
   - "A is taller than B, B is taller than C, who is shortest"
   - Simple +1 letter series like A,C,E,G
   - "CAT = DBU so DOG = ?" type single-shift coding
   - Two-statement syllogisms
   - Clock angles at exact hours (3:00, 6:00, 9:00)
   - Directions with only 2-3 turns

TOPICS — use a DIFFERENT topic for each question:
1. Blood relation with coded language ("X $ Y means X is father of Y")
2. Number series with mixed operations between alternate terms
3. Letter-number series with positional values and operations
4. Three-statement syllogism with possibility conclusion
5. Clock: angle between hands at non-trivial time (e.g. 7:35, 2:47)
6. Multi-hop direction sense with distance calculation
7. Circular seating with facing conditions
8. Input-output machine with 3-step transformation
9. Coded inequality with conclusion verification
10. Calendar: day of week for a date using odd days method
11. Analogy with domain-specific relationship
12. Ranking from contradictory statements
13. Data sufficiency with 2 statements
14. Alphanumeric series with pattern across positions
15. Decode a word using reverse + shift + vowel substitution

HARD EXAMPLE (this is the minimum difficulty you must match or exceed):
"A % B means A is the mother of B. A @ B means A is the husband of B. A # B means A is the sister of B. If P % Q @ R # S % T, how is P related to T?"
Options: ["Grandmother", "Mother", "Aunt", "Cannot be determined"] Answer: "Grandmother"

DO NOT REPEAT OR REPHRASE ANY OF THESE QUESTIONS:
${avoidList || "(none)"}

Return ONLY a raw JSON array. No markdown. No explanation. No extra text whatsoever.
Format:
[{"question":"...","options":["...","...","...","..."],"answer":"..."}]
`;

  const prompt = category === "aptitude" ? aptitudePrompt : reasoningPrompt;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error(`Gemini generation failed for ${category}:`, error?.message || error);
    return JSON.stringify(FALLBACK_QUESTIONS[category] || []);
  }
};

module.exports = generateQuestions;