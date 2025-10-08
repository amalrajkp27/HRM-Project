# 🎓 Interview Questions - Experience Level Matching

## ✅ **UPDATED: Questions Now Match Experience Level!**

The interview feature now generates **experience-appropriate questions** automatically based on the job's experience level.

---

## 📊 **Experience Level Categories:**

### **1. Entry-Level / Intern / Fresher**
**Keywords:** `entry`, `intern`, `fresher`, `beginner`, `0-2 years`

**Question Difficulty:**
- ✅ **All 5 questions: EASY to MEDIUM**
- Focus on **BASIC concepts** and **fundamental knowledge**
- NO complex problem-solving or advanced scenarios
- Simple, straightforward questions

**Example Questions:**
```
Q1: What is Flutter primarily used for?
   A) Web development
   B) Mobile app development ✓
   C) Database management
   D) Server hosting

Q2: Which programming language does Flutter use?
   A) Java
   B) Python
   C) Dart ✓
   D) JavaScript

Q3: What is a widget in Flutter?
   A) A small gadget
   B) A UI component ✓
   C) A database
   D) A server

Q4: Which command is used to create a new Flutter project?
   A) flutter new
   B) flutter init
   C) flutter create ✓
   D) flutter start

Q5: What does "Hot Reload" do in Flutter?
   A) Restarts the app
   B) Updates code without losing state ✓
   C) Closes the app
   D) Clears cache
```

---

### **2. Mid-Level / Intermediate**
**Keywords:** `mid`, `intermediate`, `2-5 years`

**Question Difficulty:**
- ✅ **2 Easy, 2 Medium, 1 Hard**
- Focus on **practical experience** and **best practices**
- Test understanding of workflows, tools, and scenarios
- Mix of concepts and real-world applications

**Example Questions:**
```
Q1 (Easy): What is the purpose of setState() in Flutter?
Q2 (Medium): How do you optimize a ListView with many items?
Q3 (Medium): Which state management solution is best for X scenario?
Q4 (Hard): How would you implement a complex navigation pattern?
Q5 (Easy): What is the difference between StatefulWidget and StatelessWidget?
```

---

### **3. Senior / Expert / Lead**
**Keywords:** `senior`, `expert`, `lead`, `5+ years`, `architect`

**Question Difficulty:**
- ✅ **1 Easy, 2 Medium, 2 Hard**
- Focus on **deep expertise** and **complex scenarios**
- Test architecture, design patterns, optimization
- Strategic thinking and system design

**Example Questions:**
```
Q1 (Easy): What is dependency injection?
Q2 (Medium): How do you architect a large-scale Flutter app?
Q3 (Hard): Explain the trade-offs between different state management solutions
Q4 (Hard): How would you optimize app performance for 1M+ users?
Q5 (Medium): Describe your approach to implementing CI/CD for Flutter
```

---

## 🎯 **How It Works:**

### **Step 1: Job Creation**
When a recruiter creates a job, they select an experience level:
- Entry-level
- Mid-level
- Senior-level

### **Step 2: Application Submitted**
When a candidate applies, the system:
1. Reads the job's experience level
2. Generates **experience-appropriate** questions
3. Sends interview link via email

### **Step 3: Question Generation**
The AI receives specific difficulty guidance:

**For Entry-Level:**
```
- Questions should be VERY SIMPLE
- Focus on BASIC concepts
- Suitable for little to no professional experience
- Avoid advanced scenarios or complex problems
- All 5 questions: EASY to MEDIUM at most
```

**For Mid-Level:**
```
- Questions test PRACTICAL experience
- Suitable for 2-5 years of experience
- Mix of concepts, best practices, problem-solving
- Questions: 2 Easy, 2 Medium, 1 Hard
```

**For Senior-Level:**
```
- Questions test DEEP expertise
- Suitable for 5+ years of experience
- Focus on architecture, design patterns, optimization
- Questions: 1 Easy, 2 Medium, 2 Hard
```

---

## 💡 **Key Features:**

### **1. Automatic Difficulty Adjustment**
✅ No manual configuration needed
✅ AI automatically adjusts based on experience level
✅ Questions match the candidate's expected knowledge

### **2. Fair Assessment**
✅ Entry-level candidates get beginner questions
✅ Senior candidates get challenging questions
✅ Everyone tested at their appropriate level

### **3. All Multiple Choice**
✅ Fast to complete (no typing)
✅ Objective scoring (no bias)
✅ Instant results

### **4. Consistent Format**
✅ 5 questions for all levels
✅ 4 options (A, B, C, D) per question
✅ 3 correct answers required to pass

---

## 📋 **Testing Examples:**

### **Example 1: Flutter Developer Intern**
- **Experience Level:** Entry-level
- **Question 1:** "What is Flutter primarily used for?" → EASY
- **Question 2:** "Which language does Flutter use?" → EASY
- **Question 3:** "What is a StatelessWidget?" → MEDIUM
- **Question 4:** "How do you add a package to Flutter?" → EASY
- **Question 5:** "What is the purpose of pubspec.yaml?" → MEDIUM

### **Example 2: Senior Flutter Developer**
- **Experience Level:** Senior-level
- **Question 1:** "What is Provider in Flutter?" → EASY
- **Question 2:** "How do you implement complex navigation?" → MEDIUM
- **Question 3:** "Explain the trade-offs of BLoC vs Riverpod" → HARD
- **Question 4:** "How would you optimize a 10k item list?" → HARD
- **Question 5:** "Describe your approach to multi-platform development" → MEDIUM

---

## 🚀 **Benefits:**

### **For Candidates:**
✅ **Fair questions** matching their experience level
✅ **Entry-level candidates** don't face senior-level questions
✅ **Senior candidates** get challenging questions to prove expertise
✅ **Quick completion** (multiple choice format)

### **For Recruiters:**
✅ **Better screening** with appropriate difficulty
✅ **Reduced false negatives** (qualified candidates passing)
✅ **Reduced false positives** (unqualified candidates failing)
✅ **Time-saving** (automatic generation)

---

## 🔧 **Technical Implementation:**

### **Backend Logic:**
```javascript
// Detect experience level from job details
const experienceLevel = jobDetails.experienceLevel?.toLowerCase() || 'entry-level';

// Set difficulty guidance
if (experienceLevel.includes('entry') || experienceLevel.includes('intern')) {
  // Generate VERY SIMPLE questions
  // All 5 questions: EASY to MEDIUM
  difficultyGuidance = "Focus on BASIC concepts...";
  
} else if (experienceLevel.includes('mid') || experienceLevel.includes('intermediate')) {
  // Generate PRACTICAL questions
  // 2 Easy, 2 Medium, 1 Hard
  difficultyGuidance = "Test practical experience...";
  
} else if (experienceLevel.includes('senior') || experienceLevel.includes('lead')) {
  // Generate EXPERT questions
  // 1 Easy, 2 Medium, 2 Hard
  difficultyGuidance = "Test deep expertise...";
}

// AI generates questions with this guidance
```

---

## ✅ **Current Status:**

✅ **Experience-level matching IMPLEMENTED**
✅ **Entry-level questions are SIMPLE**
✅ **Mid-level questions are PRACTICAL**
✅ **Senior-level questions are COMPLEX**
✅ **All questions are multiple choice**
✅ **3 correct answers required to pass**

---

## 🎉 **Example Comparison:**

### **Same Job, Different Levels:**

**Flutter Developer (Entry-Level):**
- "What is Flutter?" → Very basic
- "Which language?" → Fundamental knowledge
- "What is a widget?" → Core concept
- "How to create a project?" → Basic command
- "What is Hot Reload?" → Simple feature

**Flutter Developer (Senior-Level):**
- "Provider vs Riverpod?" → Architectural decision
- "Optimize performance?" → Complex problem-solving
- "Multi-platform strategy?" → Strategic thinking
- "CI/CD implementation?" → Advanced workflow
- "State management at scale?" → Expert knowledge

---

**Ready to test!** Create different jobs with different experience levels and see how questions adapt automatically! 🚀

