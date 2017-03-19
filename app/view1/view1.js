'use strict';
var DEBUG = true;
var KEY_DOWN=0;
var KEY_UP=0;
angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {
        //console.log($scope);

        var canvas, ballCoord, playerBarY, point, velocity;
        $scope.gamePaused = true;
        $scope.mouseDown = false;

        var Config = {
            playerBarWidth: 10,
            playerBarHeight: 80,
            barMotionFrequency: 1000,
            ballSpeed: 10,
            ballRadios: 5,
            stepsPlayerBar: 1,
            pauseButtonWidth: 75,
            pauseButtonHeight: 100,
            sound: true,
            airFrictionAndWind: 0.3,
            leftIsModeComputer: true,
            rightIsModeComputer: false,
            difficultyModeComputer: 30, //1-100,
            widthHeightRatio: 1.775,
            canvasHeight: 0,
            canvasWidth: 0,
            maxHeightSize: 400
        };

        var keys = {};

        canvas = document.getElementById('game');
        function definesDimensionsCanvas() {
            if (screen.height > Config.maxHeightSize && screen.width > Config.maxHeightSize * Config.widthHeightRatio) {
                Config.canvasHeight = 400;
            }
            else {
                Config.canvasHeight = Math.min(screen.height, screen.width / Config.widthHeightRatio);
            }
            Config.canvasWidth = Config.canvasHeight * Config.widthHeightRatio;
            canvas.height = Config.canvasHeight;
            canvas.width = Config.canvasWidth;
            angular.element(canvas).css(
                {
                    'height': Config.canvasHeight + 'px',
                    'width': Config.canvasWidth + 'px'
                }
            );
        };

        function Start() {
            ballCoord = {
                x: canvas.width / 2,
                y: canvas.height / 2
            };//Initial position of the ball
            playerBarY = {
                left: canvas.height / 2 - Config.playerBarHeight / 2,
                right: canvas.height / 2 - Config.playerBarHeight / 2
            };//Starting position of the bars
            point = {
                left: 0,
                right: 0
            };//Starting points for each player
            velocity = {
                horizontal: (1 - Math.random() * (1 - canvas.height / canvas.width)) * Config.ballSpeed, //Ensures not much vertical movement
                //Random direction
                horizontalSense: Math.random() < 0.5 ? -1 : 1,
                verticalSense: Math.random() < 0.5 ? -1 : 1,
                acceleration: 0
            };
            {//Ensures initial speed is Config.ballSpeed
                //a^2=b^+c^2 => c=(a^2-b^2)^(1/2);
                /*let a2 = Math.pow(Config.ballSpeed, 2);
                 let b2 = Math.pow(velocity.horizontal, 2);
                 let c = Math.sqrt(a2 - b2);
                 velocity.vertical = c;*/
                velocity.vertical = Math.sqrt(Math.pow(Config.ballSpeed, 2) - Math.pow(velocity.horizontal, 2));
            }
            $scope.draw();
        }

        function canvasCurrentTarget($event) {
            if ($event) {
                $scope.lastMouseDown = $event;
            }
            else {
                $event = $scope.lastMouseDown;
            }
            if ($event.offsetX < Config.canvasWidth / 8) {
                console.log("moveleftbar");
                if ($event.offsetY < 1/*centroDaBarra*/) {
                    console.log(playerBarY);
                }
                else {
                    //levantarbarr
                }
            }
            else if ($event.offsetX > Config.canvasWidth - Config.canvasWidth / 8) {
                console.log("moverigthbar");
                console.log($event.offsetY, playerBarY.right + Config.playerBarHeight / 2);
                if ($event.offsetY < playerBarY.right + Config.playerBarHeight / 2) {
                    console.log("levantar barra");
                    var isMouseAction = true;
                    $scope.startMotionIntervalMouse({sense: "up", player: "right"});

                }
                else if ($event.offsetY > playerBarY.right + Config.playerBarHeight / 2) {
                    console.log("abaixar barra");
                    $scope.startMotionIntervalMouse({sense: "down", player: "right"});
                }
            }
            else if (Math.pow($event.offsetX - Config.canvasWidth / 2, 2) + Math.pow($event.offsetY - Config.canvasHeight / 2, 2) < 50 * 50) {
                $scope.pauseStartGame();

            }
            else {
                console.log("none");
            }
        }
        $scope.pauseStartGame=function(){
            console.log("pause game", $scope.gamePaused);
            if ($scope.gamePaused === true) {
                $scope.gamePaused = false;
                window.requestAnimationFrame($scope.draw);
                return;
            }
            else if ($scope.gamePaused) {
                console.log($scope.gamePaused);
                $scope.gamePaused = true;
                return;
            }
            else {
                console.log($scope.gamePaused);
                $scope.gamePaused = true;//false allows starts canvas but not the animation
            }
        }
        $scope.draw = function () {
            var ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Pause Screen
            if ($scope.gamePaused === true) {
                //Play buttom
                ctx.beginPath();
                ctx.fillStyle = "rgba(50,50,50,0.8)";
                ctx.moveTo(canvas.width / 2 + 50, canvas.height / 2);
                ctx.lineTo(canvas.width / 2 - 50 / 2, canvas.height / 2 + Math.sqrt(3) * 50 / 2);
                ctx.lineTo(canvas.width / 2 - 50 / 2, canvas.height / 2 - Math.sqrt(3) * 50 / 2);
                ctx.lineTo(canvas.width / 2 + 50, canvas.height / 2);
                ctx.fill();

                //box
                ctx.fillStyle = "rgba(255,255,255,0.75)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            //console.log(DEBUG);
            if (DEBUG) {
                //centrla area
                ctx.beginPath();
                ctx.fillStyle = "rgb(255, 255, 0)";
                ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2, true); // Outer circle
                ctx.stroke();


            }
            //Left player
            ctx.fillStyle = "rgba(200,0,0,0.5)";
            ctx.fillRect(0, playerBarY.left, Config.playerBarWidth, Config.playerBarHeight);

//Right player
            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(canvas.width - Config.playerBarWidth, playerBarY.right, Config.playerBarWidth, Config.playerBarHeight);

            // middle
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();

            //ball
            ctx.beginPath();
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.arc(ballCoord.x, ballCoord.y, Config.ballRadios, 0, Math.PI * 2, true); // Outer circle
            ctx.fill();

            //scoreboard
            ctx.fillStyle = "rgba(200,0,0,0.5)";
            ctx.font = "50px serif";
            ctx.textAlign = "left";
            ctx.fillText(point.left, 25, 75);
            //scoreboard
            ctx.fillStyle = "rgba(0,0,200,0.5)";
            ctx.font = "50px serif";
            ctx.textAlign = "right";
            ctx.fillText(point.right, canvas.width - 25, 75);

            if ($scope.gamePaused === false) {
                $scope.ballPosition();
                if (Config.leftIsModeComputer || Config.rightIsModeComputer) {
                    $scope.computerPlayer();
                }
                window.requestAnimationFrame($scope.draw);
            }
        };


        $scope.init = function ($event) {
            if ($event.type === "mousedown") {
                $scope.mouseDown = true;
            }
            else {
                console.error("$event.type deveria ser 'mousedown' verifica a diretiva");
            }
            //click on div.canvas allows you to pause and resume play
            //console.log($event);
            var elem;
            canvasCurrentTarget($event);
            // console.log($event.offsetX, Config.canvasWidth/8);
            // console.log($event.offsetX, Config.canvasWidth - Config.canvasWidth / 8);
            //  console.log(Math.pow($event.offsetX - Config.canvasWidth / 2, 2) + Math.pow($event.offsetY - Config.canvasHeight/2,2), 50*50);
            //return;


        };

        //Ball Position
        $scope.ballPosition = function () {
            ballCoord.x += velocity.horizontal * velocity.horizontalSense;
            ballCoord.y += velocity.vertical * velocity.verticalSense + velocity.acceleration;
            //velocity.acceleration = velocity.acceleration-velocity.acceleration/100;//reset acceleration
            //touch the lateral. Without points
            if (ballCoord.y < Config.ballRadios) {//upper side
                ballCoord.y = Config.ballRadios;
                velocity.verticalSense *= -1;//change de sense of the ball
                //make the robote litle random
                //velocity.horizontal+=(Math.random()-0.5)*velocity.horizontal/5;
                //velocity.vertical+=(Math.random()-0.5)*velocity.vertical/5;
            }
            if (ballCoord.y > canvas.height - Config.playerBarWidth + Config.ballRadios) {//lower side
                ballCoord.y = canvas.height - Config.playerBarWidth;
                velocity.verticalSense *= -1;//change de sense of the ball
                //make the robote litle random
                //velocity.horizontal+=(Math.random()-0.5)*velocity.horizontal/5;
                //velocity.vertical+=(Math.random()-0.5)*velocity.vertical/5;
            }

            //to the left's funds
            if (ballCoord.x < Config.ballRadios + Config.playerBarWidth) {
                if (ballCoord.x < Config.ballRadios) {//touch de funds. Point
                    ballCoord.x = Config.ballRadios;
                    velocity.horizontalSense *= -1;//change de sense of the ball
                    point.right++;
                    if (Config.sound) {
                        new Audio('goal.mp3').play();
                    }
                }
                //touch the left's bar. defense
                if (ballCoord.y > playerBarY.left && ballCoord.y < playerBarY.left + Config.playerBarHeight) {
                    ballCoord.x = Config.ballRadios + Config.playerBarWidth;
                    if (velocity.horizontalSense < 0) {//touch in front off the bar
                        velocity.horizontalSense *= -1;//change de sense of the ball
                        if (Config.sound) {
                            new Audio('goalKick.mp3').play();
                        }
                    }
                    else {//touch over/under bar
                        velocity.verticalSense *= -1;//change de sense of the ball
                        if (Config.sound) {
                            new Audio('goalKick.mp3').play();
                        }
                    }
                    if (keys[65]) {//cause an acceleration in the sense of the bar movement
                        //velocity.acceleration = Math.random() * velocity.vertical*10;
                    }
                    if (keys[90]) {//cause an acceleration in the sense of the bar movement
                        //velocity.acceleration = -Math.random() * velocity.vertical*10;
                    }
                }
            }
            //to the right's funds
            if (ballCoord.x > canvas.width - Config.ballRadios - Config.playerBarWidth) {
                if (ballCoord.x > canvas.width - Config.ballRadios) {//touch de funds. Point
                    ballCoord.x = canvas.width - Config.ballRadios;
                    velocity.horizontalSense *= -1;//change de sense of the ball
                    point.left++;
                    if (Config.sound) {
                        new Audio('goal.mp3').play();
                    }
                }
                //touch the right's bar. defense
                if (ballCoord.y > playerBarY.right && ballCoord.y < playerBarY.right + Config.playerBarHeight) {
                    ballCoord.x = canvas.width - Config.ballRadios - Config.playerBarWidth;
                    if (velocity.horizontalSense > 0) {//touch in front off the bar
                        velocity.horizontalSense *= -1;//change de sense of the ball
                        if (Config.sound) {
                            new Audio('goalKick.mp3').play();
                        }
                        else {//touch over/under bar
                            velocity.verticalSense *= -1;//change de sense of the ball
                            if (Config.sound) {
                                new Audio('goalKick.mp3').play();
                            }
                        }
                    }
                }
            }
        };

        //It allows two keys are pressed simultaneously
        //And prevents delay O.S. to change the key pressed
        $scope.startMotionInterval = function () {
            $scope.motionInterval = setInterval(function () {
                var countKeysDown = 0;
                for (var code in keys) {
                    //If key still down, keep moving
                    if (keys[code]) {
                        countKeysDown++;
                        $scope.moveBar(Number(code));
                    }
                }
                //If you have no key down, stop the setInterval, just to save browser resources
                if (countKeysDown === 0) {
                    clearInterval($scope.motionInterval);
                    $scope.motionInterval = false;
                }
            }, 1000 / Config.barMotionFrequency);
        };

        function testContinuitad(motion) {
            var $event = $scope.lastMouseDown;
            if ($event.offsetX < Config.canvasWidth / 8) {
                console.log("moveleftbar");
                if ($event.offsetY < 1/*centroDaBarra*/) {
                    console.log(playerBarY);
                }
                else {
                    //levantarbarr
                }
            }
            else if (motion.player === "right" && $event.offsetX > Config.canvasWidth - Config.canvasWidth / 8) {
                if (motion.sense === "up" && $event.offsetY < playerBarY.right + Config.playerBarHeight / 2) {
                    return true;

                }
                else if (motion.sense === "down" && $event.offsetY > playerBarY.right + Config.playerBarHeight / 2) {
                    return true;
                }
            }
            return false;
        }

        $scope.startMotionIntervalMouse = function (motion) {
            $scope.motionIntervalMouse = setInterval(function () {
                if ($scope.mouseDown === true && testContinuitad(motion)) {
                    if (motion.player === "right") {
                        if (motion.sense === "up") {
                            $scope.moveBar("upRight");
                        }
                        else {
                            $scope.moveBar("downRight");
                        }
                    }
                    else {
                        if (motion.sense === "up") {
                            $scope.moveBar("upLeft");
                        }
                        else {
                            $scope.moveBar("downLeft");
                        }
                    }
                } else {
                    clearInterval($scope.motionIntervalMouse);
                    $scope.motionIntervalMouse = false;
                }
            }, 1000 / Config.barMotionFrequency);
        };

        $scope.moveBar = function (keyCode) {
            switch (keyCode) {
                case "upRight"://mouse
                case 75://(k)
                case 220://upRight (])
                    playerBarY.right = Math.max(playerBarY.right - Config.stepsPlayerBar, 0);
                    break;
                case "downRight"://mouse
                case 77: //(m)
                case 193://downRight (/)
                    playerBarY.right = Math.min(playerBarY.right + Config.stepsPlayerBar, canvas.height - Config.playerBarHeight);
                    break;
                case "upLeft"://mouse
                case 65: //upLeft (a)
                    if (Config.leftIsModeComputer) {
                        return;
                    }
                    playerBarY.left = Math.max(playerBarY.left - Config.stepsPlayerBar, 0);
                    break;
                case "downLeft"://mouse
                case 90://downLeft (z)
                    if (Config.leftIsModeComputer) {
                        return;
                    }
                    playerBarY.left = Math.min(playerBarY.left + Config.stepsPlayerBar, canvas.height - Config.playerBarHeight);
                    break;
            }
        };
        $scope.equilateralTriangleInscribedCircle = function (cicleCenterX, cicleCenterY, cicleRadius) {

        }
        $scope.computerPlayer = function () {
            //console.log(ballCoord);
            for (var i = 0; i < Config.difficultyModeComputer / 10; i++) {
                if (Config.leftIsModeComputer && velocity.horizontalSense < 0) {
                    if (ballCoord.y < playerBarY.left + Config.playerBarHeight && velocity.verticalSense < 0) {
                        playerBarY.left = Math.max(playerBarY.left - Config.stepsPlayerBar, 0);
                    }
                    else if (ballCoord.y > playerBarY.left && velocity.verticalSense > 0) {
                        playerBarY.left = Math.min(playerBarY.left + Config.stepsPlayerBar, canvas.height - Config.playerBarHeight);
                    }
                }
            }
        };
        $scope.motionInterval=false;
        window.onkeydown = window.onkeyup = function (event) {
            console.log(event);

            if (event.code === "Space" && event.type === "keydown") {//bar space = pause
                $scope.pauseStartGame()
            }
            keys[event.keyCode] = event.type === 'keydown';//Saves situation of keys: down = true, up = false
            if ($scope.motionInterval === false) {
                $scope.startMotionInterval();//Initializes the movements of the bars
            }
        };

        definesDimensionsCanvas();
        Start();
    }]);