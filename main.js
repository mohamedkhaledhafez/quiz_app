// Select Element:
let countSpan = document.querySelector(".quiz-app .count span");
let bullets = document.querySelector(".quiz-app .bullets");
let bullets_Spans_Container = document.querySelector(
  ".quiz-app .bullets .spans-container"
);
let quizArea = document.querySelector(".quiz-app .quiz-area");
let quizAnswers = document.querySelector(".quiz-app .answers-area");
let submitBtn = document.querySelector(".quiz-app .submit-btn");
let resultsContainer = document.querySelector(".quiz-app .results");
let countDownSpan = document.querySelector(".quiz-app .countdown");

// Set Options For Questions Number
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let countDownSeconds = 10;
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //   console.log(this.responseText);
      let questionObject = JSON.parse(this.responseText);
      let questionsCount = questionObject.length;
      // console.log(questionsCount);

      // Create Bullets and Set Questions Count
      createBullets(questionsCount);

      // Create Function To Add Questions To UI
      addQuestions(questionObject[currentIndex], questionsCount);

      // CountDown Function
      countDown(countDownSeconds, questionsCount);

      // Click on submit button
      submitBtn.onclick = () => {
        // Get the right answer
        let rightAnswer = questionObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(rightAnswer, questionsCount);

        // Delete Previous Question & Answers
        quizArea.innerHTML = "";
        quizAnswers.innerHTML = "";

        // Show The Next Question
        addQuestions(questionObject[currentIndex], questionsCount);

        // Handle Bullets
        handleBullets();

        // CountDown Function
        clearInterval(countDownInterval);
        countDown(countDownSeconds, questionsCount);

        // show Results
        showResults(questionsCount);
      };
    }
  };

  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans:
  for (i = 0; i < num; i++) {
    // Create bullet:
    let theBullet = document.createElement("span");

    // Append bullet to spans container:
    bullets_Spans_Container.appendChild(theBullet);

    // If it is first span:
    if (i === 0) {
      theBullet.className = "on";
    }
  }
}

function addQuestions(obj, count) {
  if (currentIndex < count) {
    // Create Question Title (H2)
    let questionTitle = document.createElement("h2");

    // Create The Title Text
    let titleText = document.createTextNode(obj["title"]);

    // Add Title Text To H2
    questionTitle.appendChild(titleText);

    // Add The Question Title (H2) To Quiz Area In DOM
    quizArea.appendChild(questionTitle);

    // Create Answers
    for (let i = 1; i <= 4; i++) {
      //Create Answer div
      let answerDiv = document.createElement("div");

      // Add Class To This Answer Div
      answerDiv.className = "answer";

      // Create Answers Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-attribute To Radio Input
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make The First Radio Input Checked By Default
      if (i === 1) {
        // i : is the first radio in the top for loop
        radioInput.checked = true;
      }

      // Create Label After Radio
      let theLabel = document.createElement("label");

      // Add 'for' Attribute To Label
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The LabelText To The Label
      theLabel.appendChild(labelText);

      // Add The Radio Input + The Label To The  Answer Div
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(theLabel);

      // Add This Radio Inputs To Answers Area
      quizAnswers.appendChild(answerDiv);
    }
  }
}

function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("question");

  let chosenAnswer;

  // Search for all answers
  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  // console.log(`The Chosen Answer is : ${chosenAnswer}`);
  // console.log(`The Right Answer is : ${rightAnswer}`);

  // If the chosen answer is equal to the right answer : rightAnswers++
  if (rightAnswer === chosenAnswer) {
    rightAnswers++;
    // console.log("good answer");
    // console.log(rightAnswers);
  }
}

function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans-container span");
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    quizAnswers.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count}`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "#fff";
    resultsContainer.style.marginTop = "10px";
  }
}

// CountDown Function
function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownSpan.innerHTML = `${minutes} : ${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);

        submitBtn.click();
        // console.log("finished");
      }
    }, 1000);
  }
}
