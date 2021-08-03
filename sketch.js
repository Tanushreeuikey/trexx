var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var backgroundImg;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("images/trex1.png","images/trex3.png","images/trex4.png");
  trex_collided = loadAnimation("images/trex_collided.png");
  
  groundImage = loadImage("images/ground2.png");
  backgroundImg = loadImage("images/background00.png")
  cloudImage = loadImage("images/cloud2.png");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  
  restartImg = loadImage("images/restart.png")
  gameOverImg = loadImage("images/gameOver.png")
  
  jumpSound = loadSound("sounds/jump.mp3")
  dieSound = loadSound("sounds/die.mp3")
  checkPointSound = loadSound("sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth-50,displayHeight-300);

  //var message = "This is a message";
 //console.log(message)
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale=0.5
  trex.addAnimation("collided", trex_collided);
  
  ground = createSprite(200,300,displayWidth*300,20);
  ground.addImage("ground",groundImage);
  //ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,300,displayWidth*300,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  //trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
 
  
 

  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
   // ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       //checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 201) {
        trex.velocityY = -12;
        //jumpSound.play();
    }
    if(keyDown(RIGHT_ARROW))
    {
      changePosition(5,0)
      camera.position.x=trex.x
      camera.position.y=trex.y
    }
    
     var pos = trex.position.x+350
      text("Score: "+ score, pos,50);
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        //dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart) && gameState===END) 
  {
      reset();
    
  }


  drawSprites();
}

function reset()
{
  gameState=PLAY;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 160 === 0){
   var obstacle = createSprite(displayWidth*100,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150=== 0) {
    var cloud = createSprite(displayWidth-5000,displayHeight-900);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function changePosition(x,y)
{
    //database.ref("balloon/position").set({x:positionn.x+x,y:positionn.y+y})
    trex.x = trex.x + x;
    trex.y = trex.y + y;
}
