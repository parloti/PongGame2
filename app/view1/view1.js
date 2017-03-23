'use strict';
var DEBUG = true;
var KEY_DOWN = 0;
var KEY_UP = 0;
angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', function ($scope) {
        //console.log($scope);
        $scope.isMobileBrowser = (function (browserID) {
            var rg1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
            var rg2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
            if (rg1.test(browserID) || rg2.test(browserID.substr(0, 4))) {
                return true;
            }
            else {
                return false;
            }
        })(navigator.userAgent || navigator.vendor || window.opera);

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

        $scope.pauseStartGame = function () {
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
        $scope.motionInterval = false;
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