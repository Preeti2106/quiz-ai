 let currentCategory = 'AI & ML';
    let currentDifficulty = 'Medium';
    let totalQuestionsCount = 5;
    
    let currentQuestionIndex = 0;
    let selectedAnswers = {};
    let timerInterval = null;
    let secondsLeft = 30;
    const questionsDatabase = {
      'AI & ML': [
        { q: "What does AI stand for in ECE-AI?", options: ["Artificial Intelligence", "Automated Interface", "Analog Integration", "Algorithm Index"], correct: 0 },
        { q: "Which activation function is most popular in Deep Learning?", options: ["Sigmoid", "ReLU", "Binary Step", "Linear"], correct: 1 },
        { q: "What does CNN stand for in Computer Vision?", options: ["Convolutional Neural Network", "Central Node Network", "Connected Network Node", "Complex Neuron Net"], correct: 0 },
        { q: "Which algorithm is used for supervised classification?", options: ["K-Means", "Logistic Regression", "PCA", "Apriori"], correct: 1 },
        { q: "In machine learning, what causes overfitting?", options: ["Too little training data", "Model learning noise in training data", "High bias", "Simple linear model"], correct: 1 }
      ],
      'Web Dev': [
        { q: "Which tag is used for main headings in HTML?", options: ["<h6>", "<head>", "<h1>", "<header>"], correct: 2 },
        { q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Syntax", "Creative Sheet System", "Code Style Standard"], correct: 0 },
        { q: "Which JS keyword declares a constant variable?", options: ["var", "let", "const", "static"], correct: 2 },
        { q: "What does DOM stand for?", options: ["Document Object Model", "Data Object Method", "Digital Ordinance Map", "Desktop Output Mode"], correct: 0 },
        { q: "Which HTTP method is used to fetch data?", options: ["POST", "GET", "PUT", "DELETE"], correct: 1 }
      ]
    };
    function showScreen(screenId) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(screenId).classList.add('active');
    }
    function switchAuthTab(tab) {
      document.getElementById('tab-login').classList.toggle('active', tab === 'login');
      document.getElementById('tab-register').classList.toggle('active', tab === 'register');
      document.getElementById('form-login').style.display = tab === 'login' ? 'block' : 'none';
      document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
    }
    function handleAuthSubmit(e) {
      e.preventDefault();
      alert("Authentication Successful! Redirecting to Dashboard...");
      showScreen('screen-dashboard');
    }
    function selectCategory(catName, element) {
      currentCategory = catName;
      document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
      element.classList.add('selected');
    }
    function selectDifficulty(diff, element) {
      currentDifficulty = diff;
      element.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      element.classList.add('active');
    }
    function selectCount(count, element) {
      totalQuestionsCount = count;
      element.parentElement.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      element.classList.add('active');
    }
    function startQuiz() {
      currentQuestionIndex = 0;
      selectedAnswers = {};
      document.getElementById('quiz-running-category').innerText = currentCategory;
      showScreen('screen-quiz');
      loadQuestion();
    }
    function loadQuestion() {
      const qList = questionsDatabase[currentCategory] || questionsDatabase['AI & ML'];
      const qData = qList[currentQuestionIndex];
      document.getElementById('quiz-question-text').innerText = qData.q;
      document.getElementById('quiz-counter').innerText = `Question ${currentQuestionIndex + 1}/${totalQuestionsCount}`;
      const progressPercent = ((currentQuestionIndex + 1) / totalQuestionsCount) * 100;
      document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;
      const container = document.getElementById('quiz-options-container');
      container.innerHTML = '';
      
      qData.options.forEach((optText, index) => {
        const btn = document.createElement('button');
        btn.className = `option-btn ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`;
        btn.innerText = `${String.fromCharCode(65 + index)}) ${optText}`;
        btn.onclick = () => {
          selectedAnswers[currentQuestionIndex] = index;
          loadQuestion();
        };
        container.appendChild(btn);
      });
      document.getElementById('btn-prev-q').disabled = currentQuestionIndex === 0;
      document.getElementById('btn-next-q').innerText = currentQuestionIndex === totalQuestionsCount - 1 ? 'Submit Quiz' : 'Next';
      resetTimer();
    }
    function resetTimer() {
      clearInterval(timerInterval);
      secondsLeft = 30;
      document.getElementById('quiz-timer').innerText = `⏱️ ${secondsLeft}s`;
      timerInterval = setInterval(() => {
        secondsLeft--;
        document.getElementById('quiz-timer').innerText = `⏱️ ${secondsLeft}s`;
        if (secondsLeft <= 0) {
          clearInterval(timerInterval);
          nextQuestion();
        }
      }, 1000);
    }
    function prevQuestion() {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
      }
    }
    function nextQuestion() {
      if (currentQuestionIndex < totalQuestionsCount - 1) {
        currentQuestionIndex++;
        loadQuestion();
      } else {
        finishQuiz();
      }
    }
    function finishQuiz() {
      clearInterval(timerInterval);
      const qList = questionsDatabase[currentCategory] || questionsDatabase['AI & ML'];
      
      let correct = 0;
      for (let i = 0; i < totalQuestionsCount; i++) {
        if (selectedAnswers[i] === qList[i].correct) {
          correct++;
        }
      }
      const wrong = totalQuestionsCount - correct;
      const percentage = Math.round((correct / totalQuestionsCount) * 100);
      const score = correct * 10;
      document.getElementById('res-score').innerText = `${score} / ${totalQuestionsCount * 10}`;
      document.getElementById('res-percentage').innerText = `${percentage}%`;
      document.getElementById('res-correct').innerText = correct;
      document.getElementById('res-wrong').innerText = wrong;
      showScreen('screen-result');
    }
    function restartQuiz() {
      startQuiz();
    }
  