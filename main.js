// Select Element:
let countSpan = document.querySelector(".quiz-app .count span");
let bullets_Spans_Container = document.querySelector(
  ".bullets .spans-container"
);
// Set Options For Questions Number
let currentIndex = 0;
let quizArea = document.querySelector(".quiz-app .quiz-area");
let quizAnswers = document.querySelector(".quiz-app .answers-area");

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //   console.log(this.responseText);
      let questionObject = JSON.parse(this.responseText);
      let questionsCount = questionObject.length;
      console.log(questionsCount);

      // Create Bullets and Set Questions Count
      createBullets(questionsCount);

      // Create Function To Add Questions To UI
      addQuestions(questionObject[currentIndex], questionsCount);
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
