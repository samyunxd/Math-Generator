function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAdditionQuestion(min = 1, max = 9) {
  const a = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  return {
    a,
    b,
    op: '+',
    answer: a + b
  };
}

function generateSubtractionQuestion(min = 1, max = 9, allowNeg = false) {
  let a = getRandomInt(min, max);
  let b = getRandomInt(min, max);
  if (!allowNeg && a < b) [a, b] = [b, a];
  return {
    a,
    b,
    op: '-',
    answer: a - b
  };
}

function generateMultiplicationQuestion(min = 1, max = 9) {
  const a = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  return {
    a,
    b,
    op: '×',
    answer: a * b
  };
}

function generateDivisionQuestion(min = 1, max = 9, answerType = 'whole') {
  let a, b, answer;
  if (answerType === 'whole') {
    b = getRandomInt(min, max);
    answer = getRandomInt(min, max);
    a = b * answer;
  } else {
    b = getRandomInt(min, max);
    a = getRandomInt(min, max);
    answer = a / b;
  }
  return {
    a,
    b,
    op: '÷',
    answer: answerType === 'whole' ? a / b : (a / b).toFixed(2)
  };
}

function generateMixedQuestion(settings) {
  const ops = ['add', 'sub', 'mul', 'div'];
  const op = ops[getRandomInt(0, 3)];
  return generateQuestionByType(op, settings);
}

function generateQuestionByType(type, settings) {
  const { min, max, allowNeg, divAnswerType } = settings;
  switch (type) {
    case 'add':
      return generateAdditionQuestionMulti(min, max, settings.numAddends);
    case 'sub':
      return generateSubtractionQuestionMulti(min, max, 2, allowNeg);
    case 'mul':
      return generateMultiplicationQuestionWorksheet(min, max);
    case 'div':
      return generateDivisionQuestionWorksheet(min, max, divAnswerType);
    case 'mix':
      return generateMixedQuestion(settings);
    default:
      return generateAdditionQuestionMulti(min, max, 2);
  }
}

function renderDigitsRow(str, maxLen, color = '', tag = 'td', invisible = false) {
  const pad = maxLen - str.length;
  let tds = '';
  for (let i = 0; i < pad; i++) tds += `<${tag} style=\"width:1.1ch;\"></${tag}>`;
  for (let i = 0; i < str.length; i++) tds += `<${tag}${color ? ` style=\"color:${color};width:1.1ch;\"` : ' style=\"width:1.1ch;\"'}>${invisible ? `<span style='opacity:0;'>${str[i]}</span>` : str[i]}</${tag}>`;
  return tds;
}

function renderVerticalEquation({addends, op, answer}, showAnswer = false) {
  // addends: array of numbers (as strings)
  const addendStrs = addends.map(String);
  const ansStr = String(answer);
  const maxLen = Math.max(...addendStrs.map(s => s.length), ansStr.length, 6); // 6 is a reasonable min for stability
  const tableWidth = `${maxLen * 1.1}ch`;
  // Calculate how many empty digit cells are before the leftmost digit
  function opTranslateX(str) {
    const pad = maxLen - str.length;
    return `translateX(${(pad * 1.1 - 1)}ch)`;
  }
  return `
    <div style=\"display:inline-block; text-align:center; font-size:2.2rem; line-height:1.2; font-family:'Fira Mono','Consolas','Menlo',monospace; font-weight:600; width:${tableWidth}; min-width:${tableWidth}; max-width:${tableWidth};\">
      <table style=\"border-collapse:collapse; margin:0 auto; width:100%; table-layout:fixed;\">
        ${addendStrs.map((s, i) => `
          <tr>
            <td style=\"text-align:left; font-family:'Fira Mono','Consolas','Menlo',monospace; font-weight:600; padding:0; transform:${i === addendStrs.length - 1 ? opTranslateX(s) : 'none'};\">${i === addendStrs.length - 1 ? op : ''}</td>
            ${renderDigitsRow(s, maxLen)}
          </tr>`).join('')}
        <tr>
          <td></td>
          <td colspan=\"${maxLen}\" style=\"border-bottom:2px solid #a7bffc; height:0.3em; padding:0;\"></td>
        </tr>
        <tr>
          <td></td>
          ${showAnswer ? renderDigitsRow(ansStr, maxLen, '#a78bfa') : renderDigitsRow(ansStr, maxLen, '', 'td', true)}
        </tr>
      </table>
    </div>
  `;
}

function generateAdditionQuestionMulti(min = 1, max = 9, addends = 2) {
  const nums = Array.from({length: addends}, () => getRandomInt(min, max));
  return {
    addends: nums,
    op: '+',
    answer: nums.reduce((a, b) => a + b, 0)
  };
}

function generateSubtractionQuestionMulti(min = 1, max = 9, addends = 2, allowNeg = false) {
  // For now, only two numbers (minuend - subtrahend)
  let a = getRandomInt(min, max);
  let b = getRandomInt(min, max);
  if (!allowNeg && a < b) [a, b] = [b, a];
  return {
    addends: [a, b],
    op: '-',
    answer: a - b
  };
}

function generateMultiplicationQuestionWorksheet(min = 1, max = 9) {
  const a = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  return {
    addends: [a, b],
    op: '×',
    answer: a * b
  };
}

function generateDivisionQuestionWorksheet(min = 1, max = 9, answerType = 'whole') {
  let a, b, answer;
  if (answerType === 'whole') {
    b = getRandomInt(min, max);
    answer = getRandomInt(min, max);
    a = b * answer;
  } else {
    b = getRandomInt(min, max);
    a = getRandomInt(min, max);
    answer = a / b;
  }
  return {
    addends: [a, b],
    op: '÷',
    answer: answerType === 'whole' ? a / b : (a / b).toFixed(2)
  };
}

document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generate-btn');
  const showAnswerBtn = document.getElementById('show-answer-btn');
  const endSessionBtn = document.getElementById('end-session-btn');
  const equationDiv = document.getElementById('equation');
  const answerDiv = document.getElementById('answer');
  const statusContainer = document.getElementById('status-container');
  const answerInputToggle = document.getElementById('answer-input-toggle');
  const answerInputRow = document.getElementById('answer-input-row');
  const streakCounter = document.getElementById('streak-counter');
  const settingsPanel = document.getElementById('settings-panel');

  // Add keyboard shortcut handler
  document.addEventListener('keydown', function(e) {
    // Only handle shortcuts when not typing in an input
    if (document.activeElement.tagName !== 'INPUT') {
      if (e.key === 'Enter') {
        if (!generateBtn.disabled) {
          generateBtn.click();
        } else if (!showAnswerBtn.disabled) {
          showAnswerBtn.click();
        }
      } else if (e.key === 'Backspace' && !endSessionBtn.disabled) {
        // Prevent browser back navigation
        e.preventDefault();
        endSessionBtn.click();
      }
    }
  });

  // Initialize settings panel
  function initSettingsPanel() {
    // Show settings panel after a brief delay to ensure smooth animation
    setTimeout(() => {
      settingsPanel.classList.add('visible');
    }, 100);
  }

  // Call initialization
  initSettingsPanel();

  // Timer display
  let timerDiv = document.createElement('div');
  timerDiv.id = 'timer-div';
  timerDiv.style.textAlign = 'center';
  timerDiv.style.fontSize = '1.1rem';
  timerDiv.style.color = '#a78bfa';
  timerDiv.style.height = '1.5em';
  timerDiv.style.marginTop = '0';
  statusContainer.appendChild(timerDiv);

  // Progress display
  let progressDiv = document.createElement('div');
  progressDiv.id = 'progress-div';
  progressDiv.style.textAlign = 'center';
  progressDiv.style.fontSize = '1.1rem';
  progressDiv.style.color = '#7b8fa3';
  progressDiv.style.height = '1.5em';
  progressDiv.style.marginTop = '0';
  statusContainer.appendChild(progressDiv);

  // Settings elements
  const operationSel = document.getElementById('operation');
  const minRange = document.getElementById('min-range');
  const maxRange = document.getElementById('max-range');
  const allowNegatives = document.getElementById('allow-negatives');
  const divAnswerType = document.getElementById('div-answer-type');
  const numQuestionsInput = document.getElementById('num-questions');
  const numAddendsInput = document.getElementById('num-addends');
  const addendsRow = document.getElementById('addends-row');
  const timedModeInput = document.getElementById('timed-mode');

  let timer = null;
  let startTime = null;
  let pausedTime = 0;
  let pauseStart = null;

  function startTimer() {
    startTime = Date.now();
    pausedTime = 0;
    timerDiv.textContent = 'Time: 0.0s';
    timer = setInterval(() => {
      const elapsed = (Date.now() - startTime - pausedTime) / 1000;
      timerDiv.textContent = `Time: ${elapsed.toFixed(1)}s`;
    }, 100);
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function resetTimer() {
    timerDiv.textContent = '';
    startTime = null;
    pausedTime = 0;
    pauseStart = null;
  }
  function pauseTimer() {
    if (timer && !pauseStart) {
      pauseStart = Date.now();
      clearInterval(timer);
    }
  }
  function resumeTimer() {
    if (pauseStart) {
      pausedTime += Date.now() - pauseStart;
      pauseStart = null;
      timer = setInterval(() => {
        const elapsed = (Date.now() - startTime - pausedTime) / 1000;
        timerDiv.textContent = `Time: ${elapsed.toFixed(1)}s`;
      }, 100);
    }
  }

  let currentQuestion = null;
  let sessionQuestions = [];
  let sessionIndex = 0;
  let sessionTotal = 0;

  let correctCount = 0;
  let incorrectCount = 0;
  let inputAttempts = 0;

  let streak = 0;
  function updateStreakDisplay() {
    if (streak > 1) {
      streakCounter.textContent = `🔥 ${streak}`;
      streakCounter.classList.add('visible');
    } else {
      streakCounter.textContent = '';
      streakCounter.classList.remove('visible');
    }
  }
  updateStreakDisplay();

  function getSettings() {
    return {
      type: operationSel.value,
      min: parseInt(minRange.value, 10),
      max: parseInt(maxRange.value, 10),
      allowNeg: allowNegatives.checked,
      divAnswerType: divAnswerType.value,
      numQuestions: parseInt(numQuestionsInput.value, 10),
      numAddends: parseInt(numAddendsInput.value, 10)
    };
  }

  function startSession() {
    const settings = getSettings();
    sessionQuestions = [];
    for (let i = 0; i < settings.numQuestions; i++) {
      if (settings.type === 'add') {
        sessionQuestions.push(generateAdditionQuestionMulti(settings.min, settings.max, settings.numAddends));
      } else {
        sessionQuestions.push(generateQuestionByType(settings.type, settings));
      }
    }
    sessionIndex = 0;
    sessionTotal = settings.numQuestions;
    updateProgress();
    showSessionQuestion();
    generateBtn.disabled = true;
    endSessionBtn.disabled = false;  // Enable end session button
    // Timed mode
    if (timedModeInput.checked) {
      startTimer();
    } else {
      resetTimer();
    }
  }

  function endSession() {
    generateBtn.disabled = false;
    showAnswerBtn.disabled = true;
    endSessionBtn.disabled = true;
    equationDiv.innerHTML = '?';
    answerDiv.style.display = 'none';
    progressDiv.textContent = 'Session ended';
    
    // Handle timer if in timed mode
    if (timedModeInput.checked && startTime) {
      stopTimer();
      const elapsed = (Date.now() - startTime - pausedTime) / 1000;
      timerDiv.textContent = `Total time: ${elapsed.toFixed(1)}s`;
    }
    
    // Hide answer input if it's enabled
    answerInputRow.style.display = 'none';
    
    // Show final score
    showScore();
    
    // Reset streak
    streak = 0;
    updateStreakDisplay();
  }

  function showSessionQuestion() {
    currentQuestion = sessionQuestions[sessionIndex];
    if (currentQuestion.addends) {
      equationDiv.innerHTML = renderVerticalEquation(currentQuestion, false);
    } else {
      equationDiv.innerHTML = renderVerticalEquation({addends: [currentQuestion.a, currentQuestion.b], op: currentQuestion.op, answer: currentQuestion.answer}, false);
    }
    answerDiv.style.display = 'none';
    answerDiv.innerHTML = '';
    showAnswerBtn.disabled = false;
    updateProgress();
    answerInputRow.style.display = 'none';
    if (answerInputToggle.checked) {
      let expected = currentQuestion.addends ? currentQuestion.answer : currentQuestion.answer;
      showAnswerInput(expected);
    }
  }

  function updateProgress() {
    if (sessionQuestions.length > 0) {
      progressDiv.textContent = `Question ${sessionIndex + 1} of ${sessionTotal}`;
    } else {
      progressDiv.textContent = '';
    }
  }

  function showAnswerInput(expectedAnswer) {
    const answerLength = String(expectedAnswer).length;
    const inputWidth = Math.max(5, answerLength + 2) + 'em';
    
    // Always recreate the input to ensure it's fresh and enabled
    answerInputRow.innerHTML = `
      <input id='user-answer' type='text' autocomplete='off' style='font-size:1.5rem; width:${inputWidth}; text-align:center; font-family:inherit;' placeholder='Type answer' maxlength='${answerLength + 2}'>
      <span id='answer-feedback' style='margin-left:1em; font-size:1.2rem;'></span>
    `;
    
    answerInputRow.style.display = '';
    const userAnswer = document.getElementById('user-answer');
    const feedback = document.getElementById('answer-feedback');
    userAnswer.value = '';
    feedback.textContent = '';
    userAnswer.focus();
    inputAttempts = 0;
    
    // Debug: log that input is created
    console.log('Input created for answer:', expectedAnswer, 'Length:', answerLength);

    function checkAnswer(val) {
      console.log('checkAnswer called with:', val, 'Expected:', expectedAnswer);
      
      if (val === '') {
        feedback.textContent = '';
        return;
      }

      if (val === String(expectedAnswer) || Number(val) === Number(expectedAnswer)) {
        playChime();
        feedback.textContent = '✓';
        feedback.style.color = '#4ade80';
        userAnswer.classList.add('correct-animation');
        correctCount++;
        streak++;
        updateStreakDisplay();
        
        setTimeout(() => {
          feedback.textContent = '';
          userAnswer.value = '';
          showAnswerBtn.disabled = true;
          
          setTimeout(() => {
            if (sessionIndex < sessionTotal - 1) {
              sessionIndex++;
              showSessionQuestion();
            } else {
              progressDiv.textContent = 'Session complete!';
              generateBtn.disabled = false;
              answerInputRow.style.display = 'none';
              showScore();
              streak = 0;
              updateStreakDisplay();
              // Stop timer if in timed mode
              if (timedModeInput.checked && startTime) {
                stopTimer();
                const elapsed = (Date.now() - startTime - pausedTime) / 1000;
                timerDiv.textContent = `Total time: ${elapsed.toFixed(1)}s`;
              }
            }
          }, 300);
        }, 400);
      } else {
        playBuzz();
        feedback.textContent = '×';
        feedback.style.color = '#f87171';
        userAnswer.classList.add('wrong-animation');
        userAnswer.value = '';
        userAnswer.focus();
        inputAttempts++;
        streak = 0;
        updateStreakDisplay();

        setTimeout(() => {
          userAnswer.classList.remove('wrong-animation');
          if (inputAttempts >= 2) {
            incorrectCount++;
            feedback.textContent = '';
            userAnswer.value = '';
            showAnswerBtn.disabled = true;
            
            setTimeout(() => {
              if (sessionIndex < sessionTotal - 1) {
                sessionIndex++;
                showSessionQuestion();
              } else {
                progressDiv.textContent = 'Session complete!';
                generateBtn.disabled = false;
                answerInputRow.style.display = 'none';
                showScore();
                streak = 0;
                updateStreakDisplay();
                // Stop timer if in timed mode
                if (timedModeInput.checked && startTime) {
                  stopTimer();
                  const elapsed = (Date.now() - startTime - pausedTime) / 1000;
                  timerDiv.textContent = `Total time: ${elapsed.toFixed(1)}s`;
                }
              }
            }, 300);
          } else {
            // Reset isChecking flag for wrong answers that don't advance to next question
            isChecking = false;
          }
        }, 500);
      }
    }

    let isChecking = false;
    
    userAnswer.addEventListener('input', function() {
      let val = userAnswer.value.trim();
      console.log('Input event:', val, 'Length:', val.length, 'Expected length:', String(expectedAnswer).length, 'isChecking:', isChecking);
      
      if (val.length === String(expectedAnswer).length && !isChecking) {
        isChecking = true;
        console.log('Checking answer:', val);
        checkAnswer(val);
      } else if (val.length < String(expectedAnswer).length) {
        // Reset checking flag when user deletes characters
        isChecking = false;
        feedback.textContent = '';
      }
    });

    userAnswer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !isChecking) {
        let val = userAnswer.value.trim();
        console.log('Enter pressed, checking answer:', val);
        isChecking = true;
        checkAnswer(val);
      }
    });
  }

  function showScore() {
    let total = correctCount + incorrectCount;
    let acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    let emoji = acc >= 90 ? '🌟' : acc >= 70 ? '👍' : '💪';
    answerInputRow.innerHTML = `
      <div style='font-size:1.2rem; color:var(--text); margin-top:1em;'>
        ${emoji} Score: ${correctCount} / ${total} correct (${acc}%)
      </div>
    `;
    answerInputRow.style.display = '';
  }

  generateBtn.addEventListener('click', function() {
    correctCount = 0;
    incorrectCount = 0;
    streak = 0;
    updateStreakDisplay();
    startSession();
  });

  endSessionBtn.addEventListener('click', endSession);

  showAnswerBtn.addEventListener('click', function() {
    if (currentQuestion) {
      if (timedModeInput.checked) pauseTimer();
      if (currentQuestion.addends) {
        equationDiv.innerHTML = renderVerticalEquation(currentQuestion, true);
      } else {
        equationDiv.innerHTML = renderVerticalEquation({addends: [currentQuestion.a, currentQuestion.b], op: currentQuestion.op, answer: currentQuestion.answer}, true);
      }
      answerDiv.style.display = 'none';
      showAnswerBtn.disabled = true;
      setTimeout(() => {
        if (sessionIndex < sessionTotal - 1) {
          sessionIndex++;
          showSessionQuestion();
          if (timedModeInput.checked) resumeTimer();
        } else {
          progressDiv.textContent = 'Session complete!';
          generateBtn.disabled = false;
          // Timed mode: show total time
          if (timedModeInput.checked && startTime) {
            stopTimer();
            const elapsed = (Date.now() - startTime - pausedTime) / 1000;
            timerDiv.textContent = `Total time: ${elapsed.toFixed(1)}s`;
          }
        }
      }, 900);
    }
  });

  // Show/hide addends input for addition only
  function updateAddendsVisibility() {
    if (operationSel.value === 'add') {
      addendsRow.style.display = '';
    } else {
      addendsRow.style.display = 'none';
    }
  }
  operationSel.addEventListener('change', updateAddendsVisibility);
  updateAddendsVisibility();

  // Hide answer input row when toggled off
  answerInputToggle.addEventListener('change', function() {
    if (!answerInputToggle.checked) answerInputRow.style.display = 'none';
  });

  // Theme toggle
  const storageKey = 'theme-preference';

  const getColorPreference = () => {
    if (localStorage.getItem(storageKey))
      return localStorage.getItem(storageKey);
    else
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  };

  const theme = {
    value: getColorPreference(),
  };

  const setPreference = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
  };

  const reflectPreference = () => {
    // Apply theme smoothly
    requestAnimationFrame(() => {
      document.firstElementChild.setAttribute('data-theme', theme.value);
      document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
      
      // Update body class for backward compatibility
      if (theme.value === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
      }
    });
  };

  // Initialize theme toggle
  const initThemeToggle = () => {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;

    // Add click handler
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent any default button behavior
      
      // Toggle theme smoothly
      requestAnimationFrame(() => {
        theme.value = theme.value === 'light' ? 'dark' : 'light';
        setPreference();
      });
    });
  };

  // Initialize as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  // Sync with system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches:isDark}) => {
    theme.value = isDark ? 'dark' : 'light';
    setPreference();
  });

  // Sound effect setup
  const soundEffectsToggle = document.getElementById('sound-effects-toggle');
  const SOUND_PREF_KEY = 'sound-effects-enabled';

  function playChime() {
    if (!soundEffectsToggle.checked) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = 880;
    g.gain.value = 0.15;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.12);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18);
    o.stop(ctx.currentTime + 0.18);
    o.onended = () => ctx.close();
  }
  function playBuzz() {
    if (!soundEffectsToggle.checked) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = 120;
    g.gain.value = 0.18;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.09);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.13);
    o.stop(ctx.currentTime + 0.13);
    o.onended = () => ctx.close();
  }
  // Save/load sound setting
  function saveSoundPref() {
    localStorage.setItem(SOUND_PREF_KEY, soundEffectsToggle.checked ? '1' : '0');
  }
  function loadSoundPref() {
    const pref = localStorage.getItem(SOUND_PREF_KEY);
    if (pref !== null) soundEffectsToggle.checked = pref === '1';
  }
  soundEffectsToggle.addEventListener('change', saveSoundPref);
  loadSoundPref();
}); 