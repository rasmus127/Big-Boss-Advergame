let openWindowWidth = 0;
let openWindowHeight = 0;
let gameIsRunning = false;
// piltide muutujad
let animationData;
let frames = [];
let bg, studentImg, studentImg2, studentGirlImg, studentGirlImg2, monsterImg, monsterLeft, monsterRight, fireBallImg, explosionImg,
shootingPrepImg, boyBackImg, girlBackImg, startImg, cloudImg1, cloudImg2, cloudImg3, infoImg, nextLevelImg, calcelImg, playAgainImg;
let studentAnimation = [];
let studentAnimation2 = [];
let studentGirlAnimation = [];
let studentGirlFrames = [];
let studentGirlAnimation2 = [];
let studentGirlFrames2 = [];
let fireBallAnimation = [];
let explosionAnimation = [];
let shootingPrepAnimation = [];
let monsterAnimation = [];
let boyBackAnimation = [];
let girlBackAnimation = [];
// monster on koletise objekt
let monster;
let monsterSpeed;
// kas parem/vasak/tyhik nool on üleval
let rightUp = true;
let leftUp = true;
let spaceUp = true;
// tulekera muutujad
let fireBalls = [];
let fireBallDmgRad = 50;
let fireBallMaxDmgRad = 300;
let delay = 500;
let timeToShoot = 0;
// opilase muutujad
let students = [];
let studentCounter = 0;
let date;
let timeToSpawn = 0;
let spawnRate = 750;
let studentsAreSpawning = false;
// GUI
let dmgGUI;
// plahvatus
let explosion;
let explosionFrameCountDown = 0;
// sisenemine
let goInAnim;
let goInFrameCountDown = 0;
// level
let studentsPassed = 0;
let studentsPassedTotal = 0;
let studentsEncountered = 0;
let levelStudentCount = 10;
let levelInfo = [];
let levelNumber = 1;
let nextLevelDelay = 3000;
let gameOver = false;
let levelSpeed;
let levelCutScene;
let playCutScene = false;
let showFeedback = false;
let levelSound = 1000;
let levelTimeToPlay = 0;
//Pilved
let clouds = [];
// text
let tutorial = 'You are invited to the Tallinn University big boss fight. You are the Big Boss. Move your character with left and right arrows and ask \nquestions by pressing the space bar. Difficulty of the question depends how long you hold down the space bar. Be strict but fair and have fun!';
let credits = 'Supervisor: Martin Sillaots. Project manager: Kaspar Rasmus Eelmaa. Design: Kaspar Rasmus Eelmaa, Karl-Daniel Karu. \nProgrammers: Rando Talviste, Kent Pirma.';
let feedbackText;
// helid
let shootSound, passedSound, fireSound, gameOverSound, monsterMoving, militarySound, kidsSound, studentSound;

function preload() {
  bg = loadImage('assets/hoone_uuendus6.png');
  monsterImg = loadImage('assets/monster.png');
  studentImg = loadImage('assets/studentboy.png');
  studentGirlImg = loadImage('assets/studentgirl.png');
  studentImg2 = loadImage('assets/studentboy2.png');
  studentGirlImg2 = loadImage('assets/studentgirl2.png');
  fireBallImg = loadImage('assets/fireBallSpriteSheet.png');
  explosionImg = loadImage('assets/explosionSpriteSheet.png');
  shootingPrepImg = loadImage('assets/shootingPrep.png');
  monsterImg = loadImage('assets/monster.png');
  monsterLeft = loadImage('assets/monsterLeft.png');
  monsterRight = loadImage('assets/monsterRight.png');
  boyBackImg = loadImage('assets/boyBack.png');
  girlBackImg = loadImage('assets/girlBack.png');
  startImg = loadImage('assets/start_uus.png');
  cancelImg = loadImage('assets/cancel.png');
  playAgainImg = loadImage('assets/playagain.png');
  cloudImg1 = loadImage('assets/pilv1.png');
  cloudImg2 = loadImage('assets/pilv2.png');
  cloudImg3 = loadImage('assets/pilv3.png');
  infoImg = loadImage('assets/info.png');
  nextLevelImg = loadImage('assets/nextLevel.png');
  animationData = loadJSON('animation.json');
  // helide laadimine
  shootSound = loadSound('assets/sounds/monsterShoot.wav');
  passedSound = loadSound('assets/sounds/passed.wav');
  fireSound = loadSound('assets/sounds/fire.wav');
  gameOverSound = loadSound('assets/sounds/gameover.wav');
  monsterMovingSound = loadSound('assets/sounds/monsterMovingShort.wav');
  militarySound = loadSound('assets/sounds/military.wav');
  kidsSound = loadSound('assets/sounds/kids.wav');
  studentSound = loadSound('assets/sounds/pip.wav');
}

function setup() {
  // kui kasutaja avab akna, salvestatakse akna suurus siia
  openWindowWidth = windowWidth/1;
  openWindowHeight = windowHeight/1;

  levelSpeed = openWindowWidth/500;
  monsterSpeed = openWindowWidth/200;
  fireBallMaxDmgRad = openWindowWidth / 6.4;
  fireBallDmgRad = openWindowWidth / 38.4;
  // koletise objekti loomine
  monster = new Monster(monsterSpeed, openWindowWidth / 2, openWindowHeight/6, (openWindowHeight)/7)
  //tekitab canvase
  createCanvas(openWindowWidth, openWindowHeight);
  noStroke(50);
  fill(100);

  // animatioonid
  frames = animationData.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img;
    img = fireBallImg.get(pos.x, pos.y, pos.w, pos.h);
    fireBallAnimation.push(img);
    img = explosionImg.get(pos.x, pos.y, pos.w, pos.h);
    explosionAnimation.push(img);
    img = studentImg.get(pos.x, pos.y, pos.w, pos.h);
    studentAnimation.push(img);
    img = studentImg2.get(pos.x, pos.y, pos.w, pos.h);
    studentAnimation2.push(img);
    img = studentGirlImg.get(pos.x, pos.y, pos.w, pos.h);
    studentGirlAnimation.push(img);
    img = studentGirlImg2.get(pos.x, pos.y, pos.w, pos.h);
    studentGirlAnimation2.push(img);
    img = shootingPrepImg.get(pos.x, pos.y, pos.w, pos.h);
    shootingPrepAnimation.push(img);
    img = monsterImg.get(pos.x, pos.y, pos.w, pos.h);
    monsterAnimation.push(img);
    img = boyBackImg.get(pos.x, pos.y, pos.w, pos.h);
    boyBackAnimation.push(img);
    img = girlBackImg.get(pos.x, pos.y, pos.w, pos.h);
    girlBackAnimation.push(img);
  }

  // Pilvede animatsioon
  for (let i = 0; i < 3; i++){
    if(i == 1){
      clouds.push(new Cloud(1, openWindowWidth/35, openWindowWidth / 1.5, openWindowHeight / 20, cloudImg1));
    } else if (i == 2){
      clouds.push(new Cloud(1.3, openWindowWidth/35, openWindowWidth * 0.1, openWindowHeight / 60, cloudImg2));
    } else {
      clouds.push(new Cloud(1.5, openWindowWidth/35, openWindowWidth / 0.75, openWindowHeight / 20, cloudImg3));
    }
  }

  // GUI
  dmgGUI = new GUI(openWindowWidth / 20, openWindowHeight / 167);
}

function draw() {
  date = Date.now();
  background(bg);
  // leveli heli
  if (levelTimeToPlay < date && !gameOver && gameIsRunning && studentsAreSpawning) {
    levelTimeToPlay = date + levelSound;
    studentSound.play();
  }
  // Pilvede funktsioonide väljakutsumine
  for(let i = 0; i < clouds.length; i++){
    clouds[i].render();
    clouds[i].move();
  }
  // koletise funktsioonide v2lja kutsumine
  monster.move();
  monster.render();
  // opilasega seotud toimingud
  // opilase lisamine vastavalt tekkimise sagedusele
  if (date > timeToSpawn && studentCounter < levelStudentCount && !gameOver && gameIsRunning) {
    studentsAreSpawning = true;
    let dir = int(random(0, 2));
    let isGirl = int(random(0, 2));
    let x;
    if (dir == 0) {
      x = openWindowWidth + openWindowWidth/10;
    } else {
      x = -openWindowWidth/10;
    }
    students.push(new Student(levelSpeed, x, openWindowHeight/1.3, openWindowHeight/5, 100, dir, isGirl));
    timeToSpawn = date + spawnRate;
    studentCounter ++;
  } else if (!gameIsRunning) {
    // alguse tekst ja nupp
    push();
    textSize(openWindowWidth/80);
    fill(200);
    stroke(0);
    strokeWeight(openWindowHeight/300);
    rect(openWindowWidth/12.5, openWindowHeight/2.1, openWindowWidth/1.2, openWindowHeight/7);
    strokeWeight(0);
    fill(0);
    if (mouseX < openWindowWidth/2.1 + openWindowWidth/20 && mouseX > openWindowWidth/2.1 && mouseY < openWindowHeight/1.07 + openWindowHeight/50 && mouseY > openWindowHeight/1.07) {
      text(credits, openWindowWidth/9.5, openWindowHeight/1.85);
    } else {
      text(tutorial, openWindowWidth/9.5, openWindowHeight/1.85);
    }
    image(startImg, openWindowWidth/3.45, openWindowHeight/1.4, openWindowWidth/2.4, openWindowHeight/5);
    text('CREDITS', openWindowWidth/2.1, openWindowHeight/1.05);
    pop();
  } else if (showFeedback) {
    // FeedBack
    push();
    textSize(openWindowWidth/80);
    fill(255);
    stroke(0);
    strokeWeight(openWindowHeight/300);
    rect(openWindowWidth/4, openWindowHeight/1.27, openWindowWidth/2, openWindowHeight/20);
    strokeWeight(0);
    fill(0);
    text(feedbackText, openWindowWidth/3.9, openWindowHeight/1.22);
    image(cancelImg, openWindowWidth/3.5, openWindowHeight/1.15, openWindowWidth/5, openWindowHeight/10);
    image(playAgainImg, openWindowWidth/1.95, openWindowHeight/1.15, openWindowWidth/5, openWindowHeight/10);
  }
  // iga opilase kohta kutsutakse funktsioonid
  for (let i = 0; i < students.length; i++) {
    if (students[i].pos.x > (openWindowWidth/2) && students[i].dir == 1 && !students[i].isRunning) {
      goInAnim = new GoIn(students[i].rad, openWindowWidth/2, openWindowHeight/1.5, students[i].isGirl);
      goInFrameCountDown = 27;
      students.splice(i, 1);
      studentsPassed ++;
      studentsPassedTotal ++;
      studentsEncountered ++;
      passedSound.play();
    } else if (students[i].pos.x < (openWindowWidth/2) && students[i].dir == 0 && !students[i].isRunning) {
      goInAnim = new GoIn(students[i].rad, openWindowWidth/2, openWindowHeight/1.5, students[i].isGirl);
      goInFrameCountDown = 27;
      students.splice(i, 1);
      studentsPassed ++;
      studentsPassedTotal ++;
      studentsEncountered ++;
      passedSound.play();
    } else if (students[i].pos.x > openWindowWidth+students[i].rad && students[i].dir == 1 && students[i].isRunning) {
      if (levelNumber == 5) {
        students[i].dir = 0;
        students[i].isRunning = false;
        students[i].speed = students[i].speed/2;
      } else {
        students.splice(i, 1);
        studentsEncountered ++;
      }
    } else if (students[i].pos.x < 0 && students[i].dir == 0 && students[i].isRunning) {
      if (levelNumber == 5) {
        students[i].dir = 1;
        students[i].isRunning = false;
        students[i].speed = students[i].speed/2;
      } else {
        students.splice(i, 1);
        studentsEncountered ++;
      }
    }
    if (i < students.length) {
      students[i].move();
      students[i].render();
    }
  }
  // tulekeraga seotud toimingud
  for (let i = 0; i < fireBalls.length; i++) {
    fireBalls[i].render();
    fireBalls[i].move();
    if (fireBalls[i].pos.y > openWindowHeight/1.2) {
      for (let j = 0; j < students.length; j++) {
        if (abs(fireBalls[i].pos.x - (students[j].pos.x)) < fireBalls[i].dmgRad && !students[j].isRunning) {
          students[j].dirChange();
          students[j].speed = students[j].speed * 2;
          students[j].isRunning = true;
        }
      }
      explosion = new Explosion(fireBalls[i].dmgRad, fireBalls[i].pos.x, fireBalls[i].pos.y-fireBalls[i].dmgRad/2);
      fireSound.play();
      explosionFrameCountDown = 27;
      fireBalls.splice(i, 1);
    }
  }

  // m2ngib animatsiooni
  if (explosionFrameCountDown > 0) {
      explosion.render();
      explosionFrameCountDown --;
  }
  if (goInFrameCountDown > 0) {
    goInAnim.render();
    goInFrameCountDown --;
  }

  // tulepalli füüsika (suurendab kahju ulatust)
  if (fireBallDmgRad < fireBallMaxDmgRad && !spaceUp) {
    fireBallDmgRad += 2;
  }

  // GUI funktsioonid
  //dmgGUI.fillPercent = fireBallDmgRad / 3;
  //dmgGUI.pos.x = monster.pos.x;
  //dmgGUI.pos.y = monster.pos.y;
  dmgGUI.render();

  // cutscene
  if (playCutScene) {
    if (gameOver) {
      levelCutScene.render("Game Over");
    } else {
      levelCutScene.render("Level " + levelNumber.toString());
    }
  }

  // Kuvatakse leveli numbrit jms
  textSize(openWindowWidth / 60);
  //fill('rgb(165, 50, 58)');
  fill(0);
  text('Level ' + levelNumber, openWindowWidth/192, openWindowHeight/30);
  text('Passed: ' + studentsPassedTotal + '/10', openWindowWidth/192, openWindowHeight/15);
  text('Computer Games Final Presentation', openWindowWidth / 1.38, openWindowHeight/30);
  text('Tallinn University Narva mnt 29, Room A543', openWindowWidth / 1.495, openWindowHeight/15);
  text('June 21, 10:00', openWindowWidth / 1.13, openWindowHeight/10);
  // kontroll, kas hiir on info peal
  if (gameIsRunning) {
    image(infoImg, openWindowWidth/192, openWindowHeight/13, openWindowHeight/15, openWindowHeight/15);
    if (mouseX > 10 && mouseX < 10 + openWindowHeight/12 && mouseY > 70 && mouseY < 70 + openWindowHeight/13) {
      push();
      textSize(openWindowWidth/80);
      fill(200);
      rect(10, openWindowHeight/6, openWindowWidth/1.25, openWindowHeight/15);
      fill(0);
      text(tutorial, 20, openWindowHeight/5.2);
      pop();
    }
  }

  // kontrollitakse, kas minna järgmisesse levelisse
  if (studentsEncountered >= levelStudentCount && !gameOver && (levelStudentCount > studentsPassed)){
    nextLevel();
  }
  if ((levelNumber >= 6) || (studentsEncountered == levelStudentCount) && !gameOver) {
    levelInfo.push(studentsPassed);
    calcFeedback2();
    gameOver = true;
    levelCutScene = new CutScene();
    playCutScene = true;
    studentsAreSpawning = false;
    setTimeout(function() {
      if (typeof chart !== 'undefined') {
        chart.destroy();
      }
      drawChart();
      document.getElementById("chartId").style.display = "block";
      showFeedback = true;
      //calcFeedback2();
    }, 3000);
  }
}

function keyReleased () {
  if (gameIsRunning && !showFeedback) {
    if (keyCode == RIGHT_ARROW || keyCode == 68) {
  		rightUp = true;
  	} else if (keyCode == LEFT_ARROW || keyCode == 65) {
  		leftUp = true;
  	}
    if (keyCode == 32 && !spaceUp) {
      if (date > timeToShoot) {
        timeToShoot = date + delay;
        spaceUp = false;
        fireBalls.push(new FireBall(windowHeight/50, (monster.rad/1.6)+(fireBallDmgRad/5), monster.pos.x, monster.pos.y + monster.rad/2, fireBallDmgRad));
        shootSound.play();
        fireBallDmgRad = 50;
        spaceUp = true;
      } else {
        spaceUp = true;
        fireBallDmgRad = 50;
      }
  	}
  }
}

function keyPressed () {
  if (gameIsRunning && !showFeedback) {
    if (keyCode == RIGHT_ARROW || keyCode == 68) {
  		rightUp = false;
  	} else if (keyCode == LEFT_ARROW || keyCode == 65) {
  		leftUp = false;
    }
    if (keyCode == 32) {
      spaceUp = false;
  	}
  }
}

function mousePressed() {
  if (!gameIsRunning && !showFeedback && mouseX > openWindowWidth/3.45 && mouseX < (openWindowWidth/3.45 + openWindowWidth/2.4) && mouseY > openWindowHeight/1.4 && mouseY < (openWindowHeight/1.4 + openWindowHeight/5)) {
    gameIsRunning = true;
  } else if (gameIsRunning && showFeedback && mouseX > openWindowWidth/3.5 && mouseX < (openWindowWidth/3.5 + openWindowWidth/5) && mouseY > openWindowHeight/1.15 && mouseY < (openWindowHeight/1.15 + openWindowHeight/10)) {
    // staatiline leht
    let inv = window.open("/~kpirma/BigBossAdvergame/invitation.html", '_blank');
    inv.focus();
    resetGame(true);
  } else if (gameIsRunning && showFeedback && mouseX > openWindowWidth/1.95 && mouseX < (openWindowWidth/1.95 + openWindowWidth/5) && mouseY > openWindowHeight/1.15 && mouseY < (openWindowHeight/1.15 + openWindowHeight/10)) {
    resetGame(false);
  }
}

function nextLevel(){
  // siin vأµiks kontrollida, kas on aeg minna jأ¤rgmisesse levelisse
  levelStudentCount -= studentsPassed;
  studentCounter = 0;
  levelNumber ++;
  console.log("J2rgmine level", levelNumber);
  levelInfo.push(studentsPassed);
  studentsPassed = 0;
  studentsEncountered = 0;
  timeToSpawn = date + nextLevelDelay;
  levelSpeed = levelSpeed + levelSpeed * 1/2;
  levelCutScene = new CutScene();
  playCutScene = true;
  levelSound -= 150;
  studentsAreSpawning = false;
}

/*function calcFeedback () {
  let perfect = [1, 2, 4, 2, 1];
  let strict = 0;
  let soft = 0;
  let passed = 0;
  let err;
  for (let i = 0; i < levelInfo.length; i++) {
    passed += levelInfo[i];
    err += abs(levelInfo[i] - perfect[i]);
    if (perfect[i] < levelInfo[i] && 10-passed >= perfect[i]) {
      soft ++;
    } else if (perfect[i] > levelInfo[i] && 10-passed >= perfect[i]) {
      strict ++;
    }
  }
  if (err < 2) {
    feedbackText = "Good Enough - you are invited to DLG big boss fight.";
  } else if (soft > strict) {
    feedbackText = "You are too soft teacher - try again!";
  } else if (soft == 0 && strict == 0) {
    feedbackText = "You are excellent teacher - you are invited to DLG big boss fight.";
  } else if (soft < strict) {
    feedbackText = "You are too strict teacher - try again! ";
  } else {
    feedbackText = "You are too strict teacher - try again! ";
  }
}*/

function calcFeedback2 () { // rasmuse versioon
  let perfect = [1, 2, 4, 2, 1];
  let strict = 0;
  let soft = 0;
  let passed = 0;
  for (let i = 0; i < levelInfo.length; i++) {
    if (perfect[i] < levelInfo[i] && ((10-passed) >= perfect[i])) {
      soft += levelInfo[i] - perfect[i];
    } else if (perfect[i] > levelInfo[i] && ((10-passed) >= perfect[i])) {
      strict += perfect[i] - levelInfo[i];
    }
    passed += levelInfo[i];
  }
  if (soft == 0 && strict == 0) {
    feedbackText = "You are excellent teacher - you are invited to DLG big boss fight.";
    gameOverSound.play();
  } else if (soft < 1 && strict < 1) {
    feedbackText = "Good Enough - you are invited to DLG big boss fight.";
    gameOverSound.play();
  } else if (soft > strict) {
    feedbackText = "You are too soft teacher - try again!";
    kidsSound.play();
  } else if (soft < strict) {
    feedbackText = "You are too strict teacher - try again! ";
    militarySound.play();
  } else if (soft == strict && levelInfo.length == 5) {
    feedbackText = "You are too strict teacher - try again! ";
    militarySound.play();
  } else if (soft == strict && levelInfo.length != 5) {
    feedbackText = "You are too soft teacher - try again!";
    kidsSound.play();
  }
}

function resetGame (toMenu) {
  leftUp = true;
  rightUp = true;
  levelSpeed = openWindowWidth/500;
  studentsPassed = 0;
  studentsPassedTotal = 0;
  studentsEncountered = 0;
  levelStudentCount = 10;
  levelInfo = [];
  levelNumber = 1;
  showFeedback = false;
  gameOver = false;
  if (toMenu) {
    gameIsRunning = false;
  } else {
    gameIsRunning = true;
  }
  monster.pos.x = openWindowWidth/2;
  studentCounter = 0;
  document.getElementById("chartId").style.display = "none";
  levelSound = 1000;
  studentsAreSpawning = false;
}
