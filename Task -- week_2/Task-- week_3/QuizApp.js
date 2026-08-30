// ============ Quiz App logic ============

document.addEventListener('DOMContentLoaded', function () {

  // ---- Question bank ----
  const questions = [
    {
      question: "Which HTML tag is used to link an external CSS file?",
      options: ["Href", "script", "link", "css"],
      correctIndex: 2
    },
    {
      question: "Which CSS property is used to change text color?",
      options: ["font-color", "text-color", "color", "background-color"],
      correctIndex: 2
    },
    {
      question: "Which JavaScript method adds a new element to the end of an array?",
      options: ["push()", "pop()", "shift()", "concat()"],
      correctIndex: 0
    },
    {
      question: "What does 'CSS' stand for?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Sheets"
      ],
      correctIndex: 1
    },
    {
      question: "Which CSS layout module is best suited for one-dimensional layouts?",
      options: ["Grid", "Flexbox", "Float", "Table"],
      correctIndex: 1
    }
  ];

  // ---- State ----
  let currentIndex = 0;
  let selectedOption = null;
  const userAnswers = new Array(questions.length).fill(null);

  // ---- DOM references ----
  const questionScreen  = document.getElementById('questionScreen');
  const resultScreen    = document.getElementById('resultScreen');
  const questionText    = document.getElementById('questionText');
  const optionsList     = document.getElementById('optionsList');
  const nextBtn         = document.getElementById('nextBtn');
  const counterEl       = document.getElementById('quizCounter');
  const progressFill    = document.getElementById('progressFill');
  const resultScoreEl   = document.getElementById('resultScore');
  const resultRing      = document.getElementById('resultRing');
  const resultMessage   = document.getElementById('resultMessage');
  const reviewList      = document.getElementById('reviewList');
  const restartBtn      = document.getElementById('restartBtn');

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  function renderQuestion() {
    const q = questions[currentIndex];

    // header
    counterEl.textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
    progressFill.style.width = ((currentIndex) / questions.length * 100) + '%';

    // question + options
    questionText.textContent = q.question;
    optionsList.innerHTML = '';
    selectedOption = userAnswers[currentIndex];

    q.options.forEach(function (optionText, i) {
      const optionEl = document.createElement('div');
      optionEl.className = 'option' + (selectedOption === i ? ' selected' : '');
      optionEl.innerHTML =
        '<span class="option-letter">' + optionLetters[i] + '</span>' +
        '<span>' + optionText + '</span>';

      optionEl.addEventListener('click', function () {
        selectedOption = i;
        userAnswers[currentIndex] = i;
        renderQuestion(); // re-render to reflect the new selection
      });

      optionsList.appendChild(optionEl);
    });

    // next / submit button
    nextBtn.disabled = selectedOption === null;
    nextBtn.textContent = (currentIndex === questions.length - 1) ? 'Submit' : 'Next question';
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      showResults();
    }
  }

  function calculateScore() {
    let score = 0;
    questions.forEach(function (q, i) {
      if (userAnswers[i] === q.correctIndex) score++;
    });
    return score;
  }

  function showResults() {
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100);

    progressFill.style.width = '100%';
    questionScreen.classList.add('is-hidden');
    resultScreen.classList.remove('is-hidden');

    resultRing.style.setProperty('--pct', pct);
    resultScoreEl.textContent = score + '/' + questions.length;

    let message;
    if (pct === 100) {
      message = "Perfect score — every answer correct.";
    } else if (pct >= 70) {
      message = "Solid result. A little more practice and you'll ace it.";
    } else if (pct >= 40) {
      message = "Decent attempt — worth another pass through the material.";
    } else {
      message = "That was a tough one. Try again and see how much sticks the second time.";
    }
    resultMessage.textContent = message;

    // build the answer review list
    reviewList.innerHTML = '';
    questions.forEach(function (q, i) {
      const isCorrect = userAnswers[i] === q.correctIndex;
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML =
        '<span class="review-icon ' + (isCorrect ? 'correct' : 'incorrect') + '">' +
          (isCorrect ? '✓' : '✕') +
        '</span>' +
        '<div class="review-text">' +
          '<div class="review-q">' + (i + 1) + '. ' + q.question + '</div>' +
          '<div class="review-a">Correct answer: ' + q.options[q.correctIndex] + '</div>' +
        '</div>';
      reviewList.appendChild(item);
    });
  }

  function restartQuiz() {
    currentIndex = 0;
    selectedOption = null;
    userAnswers.fill(null);
    resultScreen.classList.add('is-hidden');
    questionScreen.classList.remove('is-hidden');
    renderQuestion();
  }

  nextBtn.addEventListener('click', goNext);
  restartBtn.addEventListener('click', restartQuiz);

  // initial render
  renderQuestion();
});