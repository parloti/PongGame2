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

        function Browser() {
            this.isMobileBrowser;
        }

        Browser.prototype.checkIfIsMobileBrowser = function () {
            var rg1 = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
            var rg2 = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
            var browserID = navigator.userAgent || navigator.vendor || window.opera;

            if (rg1.test(browserID) || rg2.test(browserID.substr(0, 4))) {
                this.isMobileBrowser = true;
            }
            else {
                this.isMobileBrowser = false;
            }
        }

        function Mouse() {
            //https://docs.angularjs.org/api/ngTouch/service/$swipe
            //http://stackoverflow.com/questions/26170029/ng-touchstart-and-ng-touchend-in-angularjs/26176810#26176810

        }

        function Game() {
            this.isGameStarted = false;
            this.isGamePaused = true;
            this.soundActive = true;
            this.sound = {
                goal: () => {
                    if (this.soundActive === true) {
                        new Audio('goal.mp3').play();
                    }
                },
                goalKick: () => {
                    if (this.soundActive === true) {
                        new Audio('goalKick.mp3').play();
                    }
                },
            }
        }

        Game.prototype.pauseResume = function () {

        }
        Game.prototype.start = function () {

        }

        function Field() {
            this.widthHeightRatio = 1.775;
            this.centralCircleRadius = 50;
            this.height = 0;
            this.width = 0;
            this.maxHeight = 400;
            this.maxWidth = this.maxHeight * this.widthHeightRatio;
            this.maxHeightRelativeToScreenWidth = screen.availWidth / this.widthHeightRatio;
            this.borderColor = "rgba(0, 0, 0,1)";
            this.color = "rgba(255, 255, 255,1)";
            this.center = {
                x: this.width / 2,
                y: this.height / 2
            };
            this.Canvas = document.getElementById('game');
        }

        Field.prototype.calculateSize = function () {
            if (screen.availHeight > this.maxHeight && screen.availWidth > this.maxWidth) {
                this.height = this.maxHeight;
            }
            else {
                this.height = Math.min(screen.availHeight, this.maxHeightRelativeToScreenWidth);
            }
            this.width = this.height * this.widthHeightRatio;
        };
        Field.prototype.setCanvasSize = function () {
            this.Canvas.height = this.height;
            this.Canvas.width = this.width;
        }
        Field.prototype.calculateCenter = function () {
            this.center.x = this.width / 2;
            this.center.y = this.height / 2;
        }
        Field.prototype.draw = function () {
            let canvas = this.Canvas;
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, this.width, this.height);
            let field = () => {
                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.strokeStyle = 'black';
                ctx.fillRect(0, 0, this.width, this.height);
                ctx.strokeRect(0, 0, this.width, this.height);
                ctx.closePath();
            }
            let centralCircle = () => {
                ctx.beginPath();
                ctx.fillStyle = "rgb(255, 255, 0)";
                ctx.arc(this.width / 2, this.height / 2, this.centralCircleRadius, 0, Math.PI * 2, true);
                ctx.stroke();
                ctx.closePath();
            }

            let centralLine = () => {
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.moveTo(this.width / 2, 0);
                ctx.lineTo(this.width / 2, this.height);
                ctx.stroke();
                ctx.closePath();
            }
            field();
            centralCircle();
            centralLine();
        }
        Field.prototype.onClick = function ($event) {
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
                if ($event.offsetY < $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height / 2) {
                    console.log("levantar barra");
                    var isMouseAction = true;
                    $scope.startMotionIntervalMouse({sense: "up", player: "right"});
                    $scope.Players.right.Bar.move({sense: "up", player: "right"});
                }
                else if ($event.offsetY > $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height / 2) {
                    console.log("abaixar barra");
                    $scope.startMotionIntervalMouse({sense: "down", player: "right"});
                    $scope.Players.right.Bar.move({sense: "down", player: "right"});
                }
            }
            else if (Math.pow($event.offsetX - Config.canvasWidth / 2, 2) + Math.pow($event.offsetY - Config.canvasHeight / 2, 2) < 50 * 50) {
                $scope.PauseButton.onClick();

            }
            else {
                console.log("none");
            }
        }

        function PauseButton() {
            this.width = 75;
            this.height = 100;
            this.outsideCircleRadius = $scope.Field.centralCircleRadius;
            this.center = {
                x: $scope.Field.Canvas.width / 2,
                y: $scope.Field.Canvas.height / 2
            }
            this.color = "rgba(50,50,50,0.8)";
        }

        PauseButton.prototype.draw = function () {
            let canvas = $scope.Field.Canvas;
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = this.color;
            let equilateralTriangleCircumscribed = () => {
                let vertex = [
                    {
                        x: this.center.x - this.outsideCircleRadius / 2,
                        y: this.center.y + Math.sqrt(3) * this.outsideCircleRadius / 2
                    },
                    {
                        x: this.center.x - this.outsideCircleRadius / 2,
                        y: this.center.y - Math.sqrt(3) * this.outsideCircleRadius / 2
                    },
                    {
                        x: this.center.x + this.outsideCircleRadius,
                        y: this.center.y
                    }
                ];
                ctx.beginPath();
                ctx.moveTo(vertex[vertex.length - 1].x, vertex[vertex.length - 1].y);
                for (let i = 0; i < vertex.length; i++) {
                    ctx.lineTo(vertex[i].x, vertex[i].y);
                }
                ctx.fill();
            }
            equilateralTriangleCircumscribed();

        }
        PauseButton.prototype.onClick = function () {
            $scope.Game.isGamePaused = !$scope.Game.isGamePaused;
            if ($scope.Game.isGamePaused === false) {
                window.requestAnimationFrame($scope.draw);
            }
        }

        function Ball() {
            function velocity() {
                this.speed = 10;
                this.acceleration = 0;
                this.verticalProportion = {
                    min: 1 / 4,
                    max: 1 / 2
                }
                this.horizontalProportion = {
                    min: 1 / 4,
                    max: 1 / 2
                }
                let crazyMath = (verticalProportion, horizontalProportion) => {
                    let v = this.speed / Math.sqrt(1 + Math.pow($scope.Field.widthHeightRatio * horizontalProportion / verticalProportion, 2));
                    return v;
                }
                this.vertical = getRandomFloat(
                    crazyMath(this.verticalProportion.min, this.horizontalProportion.max),
                    crazyMath(this.verticalProportion.max, this.horizontalProportion.min)
                );
                this.horizontal = Pythagoras({hypotenuse: this.speed, cateto: this.vertical});
                this.horizontalSense = Math.random() < 0.5 ? -1 : 1;
                this.verticalSense = Math.random() < 0.5 ? -1 : 1;


            }

            function Pythagoras(sides) {
                if (sides.hypotenuse) {
                    return Math.sqrt(Math.pow(sides.hypotenuse, 2) - Math.pow(sides.cateto, 2));
                }
                else if (typeof sides.cateto === "object") {
                    return Math.sqrt(Math.pow(sides.cateto[0], 2) + Math.pow(sides.cateto[1], 2));
                }
            }

            function getRandomFloat(min, max) {
                return Math.random() * (max - min) + min;
            }

            this.velocity = new velocity();

            this.color;
            this.radius = 5;
            this.airFriction = 0.3;
            this.position = {
                x: $scope.Field.center.x,
                y: $scope.Field.center.y
            }
        }

        Ball.prototype.move = function () {
            this.position.x += this.velocity.horizontal * this.velocity.horizontalSense;
            this.position.y += this.velocity.vertical * this.velocity.verticalSense;
            let canvas = $scope.Field.Canvas;

            let touchSideLine = () => {
                if (this.position.y < this.radius) {
                    this.position.y = this.radius;
                    this.velocity.verticalSense *= -1;
                }
                else if (this.position.y > canvas.height - this.radius) {
                    this.position.y = canvas.height - this.radius;
                    this.velocity.verticalSense *= -1;
                }
            }
            let toGoalLine = () => {
                let touchedTheGoalLine = (Scoreboard) => {
                    this.velocity.horizontalSense *= -1;
                    Scoreboard.points++;
                    $scope.Game.sound.goal();
                }
                let touchedTheFrontOfTheBar = (width) => {
                    this.velocity.horizontalSense *= -1;
                    $scope.Game.sound.goalKick();
                }
                let ballPassedFrontLineOfLeftBar = this.position.x - this.radius <= $scope.Players.left.Bar.width;
                let ballPassedFrontLineOfRightBar = this.position.x + this.radius >= canvas.width - $scope.Players.right.Bar.width;

                if (ballPassedFrontLineOfLeftBar) {
                    let checksTouchTheLeftGoalLine = () => {
                        let touchedTheLeftGoalLine = this.position.x - this.radius <= 0;
                        if (touchedTheLeftGoalLine) {
                            this.position.x = this.radius;
                            touchedTheGoalLine($scope.Players.right.Scoreboard);
                        }
                    }
                    let checksTouchTheLeftBar = () => {
                        let ballIsBelowTheTopOfTheBar = this.position.y + this.radius >= $scope.Players.left.Bar.position.y;
                        let ballIsAboveTheBaseOfTheBar = this.position.y - this.radius <= $scope.Players.left.Bar.position.y + $scope.Players.left.Bar.height;
                        if (ballIsBelowTheTopOfTheBar && ballIsAboveTheBaseOfTheBar) {
                            let touchedTheTopBaseOfTheBar = () => {
                                if (this.velocity.verticalSense > 0) {
                                    this.position.y = -this.radius + $scope.Players.left.Bar.position.y;
                                }
                                else if (this.velocity.verticalSense < 0) {
                                    this.position.y = this.radius + $scope.Players.left.Bar.position.y + $scope.Players.left.Bar.height;
                                }
                                this.velocity.verticalSense *= -1;
                                $scope.Game.sound.goalKick();
                            }
                            let touchedTheCornerOfTheBar = () => {
                                if (this.velocity.verticalSense > 0) {
                                    this.position.y = -this.radius + $scope.Players.left.Bar.position.y;
                                }
                                else if (this.velocity.verticalSense < 0) {
                                    this.position.y = this.radius + $scope.Players.left.Bar.position.y + $scope.Players.left.Bar.height;
                                }
                                this.position.x = this.radius + $scope.Players.left.Bar.width;
                                this.velocity.verticalSense *= -1;
                                this.velocity.horizontalSense *= -1;
                                $scope.Game.sound.goalKick();
                            }
                            if (this.velocity.horizontalSense > 0) {
                                touchedTheTopBaseOfTheBar();
                            }
                            else {
                                let x = this.position.x;
                                let y = this.position.y;
                                while (true) {
                                    x -= this.velocity.horizontal * this.velocity.horizontalSense;
                                    y -= this.velocity.vertical * this.velocity.verticalSense;
                                    if (x - this.radius > $scope.Players.left.Bar.width && (y + this.radius < $scope.Players.left.Bar.position.y || y - this.radius > $scope.Players.left.Bar.position.y + $scope.Players.left.Bar.height)) {
                                        touchedTheCornerOfTheBar();
                                        break;
                                    }
                                    else if (x - this.radius > $scope.Players.left.Bar.width) {
                                        this.position.x = this.radius + $scope.Players.left.Bar.width;
                                        touchedTheFrontOfTheBar();
                                        break;
                                    }
                                    else {
                                        touchedTheTopBaseOfTheBar();
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    checksTouchTheLeftGoalLine();
                    checksTouchTheLeftBar();
                }
                if (ballPassedFrontLineOfRightBar) {
                    let checksTouchTheRightGoalLine = () => {
                        let touchedTheRightGoalLine = this.position.x + this.radius >= canvas.width;
                        if (touchedTheRightGoalLine) {
                            this.position.x = canvas.width - this.radius;
                            touchedTheGoalLine($scope.Players.left.Scoreboard);
                        }
                    }
                    let checksTouchTheRightBar = () => {
                        let ballIsBelowTheTopOfTheBar = this.position.y + this.radius >= $scope.Players.right.Bar.position.y;
                        let ballIsAboveTheBaseOfTheBar = this.position.y - this.radius <= $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height;
                        if (ballIsBelowTheTopOfTheBar && ballIsAboveTheBaseOfTheBar) {
                            let touchedTheTopBaseOfTheBar = () => {
                                if (this.velocity.verticalSense > 0) {
                                    this.position.y = -this.radius + $scope.Players.right.Bar.position.y;
                                }
                                else if (this.velocity.verticalSense < 0) {
                                    this.position.y = this.radius + $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height;
                                }
                                this.velocity.verticalSense *= -1;
                                $scope.Game.sound.goalKick();
                            }
                            let touchedTheCornerOfTheBar = () => {
                                if (this.velocity.verticalSense > 0) {
                                    this.position.y = -this.radius + $scope.Players.right.Bar.position.y;
                                }
                                else if (this.velocity.verticalSense < 0) {
                                    this.position.y = this.radius + $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height;
                                }
                                this.position.x = canvas.width - this.radius - $scope.Players.right.Bar.width;
                                this.velocity.verticalSense *= -1;
                                this.velocity.horizontalSense *= -1;
                                $scope.Game.sound.goalKick();
                            }
                            if (this.velocity.horizontalSense < 0) {
                                touchedTheTopBaseOfTheBar();
                            }
                            else {
                                let x = this.position.x;
                                let y = this.position.y;
                                while (true) {
                                    x -= this.velocity.horizontal * this.velocity.horizontalSense;
                                    y -= this.velocity.vertical * this.velocity.verticalSense;
                                    if (x + this.radius < canvas.width - $scope.Players.right.Bar.width && (y + this.radius < $scope.Players.right.Bar.position.y || y - this.radius > $scope.Players.right.Bar.position.y + $scope.Players.right.Bar.height)) {
                                        touchedTheCornerOfTheBar();
                                        break;
                                    }
                                    else if (x - this.radius < canvas.width - $scope.Players.right.Bar.width) {
                                        this.position.x = canvas.width - this.radius - $scope.Players.right.Bar.width;
                                        touchedTheFrontOfTheBar();
                                        break;
                                    }
                                    else {
                                        touchedTheTopBaseOfTheBar();
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    checksTouchTheRightGoalLine();
                    checksTouchTheRightBar();
                }
            }
            touchSideLine();
            toGoalLine();
        }
        Ball.prototype.draw = function () {
            let canvas = $scope.Field.Canvas;
            let ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, true);
            ctx.fill();
        }

        function Player() {
            function Bar() {
                this.width = 10;
                this.height = 80;
                this.motionFrequency = 1000;
                this.steps = 1;
                this.centerY = this.height / 2;
                this.position = {
                    x: 0,
                    y: $scope.Field.center.y - this.centerY
                }
                this.isModeComputer = false;
                this.computerSpeed = 3;
                this.computerMoveCondition = false;
            }

            function Scoreboard() {
                this.color;
                this.points = 0;
                this.font = "50px serif";
                this.textAlign;
                this.position = {
                    x: 0,
                    y: 75
                };
            }

            Bar.prototype.move = function (movement) {
                if (movement.sense === "up") {
                    this.position.y = Math.max(this.position.y - this.steps, 0);
                }
                else if (movement.sense === "down") {
                    this.position.y = Math.min(this.position.y + this.steps, $scope.Field.height - this.height);
                }
                else if (movement) {
                    throw new Error("Movement sense is '" + movement.sense + "but need to be either 'up' or 'down'");
                }
                else {
                    throw new Error("");
                }
            }
            Bar.prototype.draw = function () {
                let canvas = $scope.Field.Canvas;
                let ctx = canvas.getContext('2d');
                ctx.fillStyle = this.color;
                ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
            }
            Bar.prototype.computerMove = function () {
                if (this.isModeComputer === true) {
                    let condition = this.computerMoveCondition();
                    if (condition) {
                        for (var i = 0; i < this.computerSpeed; i++) {
                            let canvas = $scope.Field.Canvas;
                            let ball = $scope.Ball;

                            let ballVerticalSense = ball.velocity.verticalSense;
                            let ballPosition = ball.position.y;
                            let barPosition = this.position.y;
                            let ballIsMovingUp = ballVerticalSense < 0;
                            let ballIsMovingDown = ballVerticalSense > 0;

                            let topOfTheBar = barPosition;
                            let bottomOfTheBar = barPosition + this.height;
                            let barCenter = barPosition + this.height / 2;

                            let ballCenterIsAboveTopOfTheBar = ballPosition < topOfTheBar;
                            let ballCenterIsUnderBottomOfTheBar = ballPosition > bottomOfTheBar;

                            let ballCenterIsAboveBarCenter = ballPosition < barCenter;
                            let ballCenterIsUnderBarCenter = ballPosition > barCenter;

                            if (ballCenterIsAboveTopOfTheBar) {
                                this.moveTopUp();
                            }
                            else if (ballCenterIsUnderBottomOfTheBar) {
                                this.moveBottomDown();
                            }
                            else {
                                if (ballIsMovingUp && ballCenterIsAboveBarCenter) {
                                    this.moveTopUp();
                                }
                                else if (ballIsMovingDown && ballCenterIsUnderBarCenter) {
                                    this.moveBottomDown();
                                }
                            }
                        }
                    }
                }
            }
            Bar.prototype.moveTopUp = function () {
                let newBarPosition = this.position.y - this.steps;
                let minimumBarPositionLimit = 0;
                this.position.y = Math.max(newBarPosition, minimumBarPositionLimit);
            }
            Bar.prototype.moveBottomDown = function () {
                let newBarPosition = this.position.y + this.steps;
                let maximumBarPositionLimit = $scope.Field.Canvas.height - this.height;
                this.position.y = Math.min(newBarPosition, maximumBarPositionLimit);
            }
            Scoreboard.prototype.draw = function () {
                let canvas = $scope.Field.Canvas;
                let ctx = canvas.getContext('2d');
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                ctx.textAlign = this.textAlign;
                ctx.fillText(this.points, this.position.x, this.position.y);
            }
            this.Bar = new Bar();
            this.Scoreboard = new Scoreboard();
        }

        function LeftPlayer() {
            Player.call(this);
            this.Bar.color = "rgba(200,0,0,0.5)";
            this.Bar.position.x = 0;

            this.Scoreboard.color = "rgba(200,0,0,0.5)";
            this.Scoreboard.textAlign = "left";
            this.Scoreboard.position.x = 25;

            this.Bar.isModeComputer = true;
            this.Bar.computerMoveCondition = () => {
                return $scope.Ball.velocity.horizontalSense < 0;
            }
        }

        LeftPlayer.prototype = Object.create(Player.prototype);

        function RightPlayer() {
            Player.call(this);
            this.Bar.color = "rgba(0,0,200,0.5)";
            this.Bar.position.x = $scope.Field.Canvas.width - this.Bar.width;
            this.Bar.computerMoveCondition = () => {
                return $scope.Ball.velocity.horizontalSense > 0;
            }

            this.Scoreboard.color = "rgba(0,0,200,0.5)"
            this.Scoreboard.textAlign = "right";
            this.Scoreboard.position.x = $scope.Field.Canvas.width - 25;
        }

        RightPlayer.prototype = Object.create(Player.prototype);

        $scope.Browser = new Browser();
        $scope.Browser

        $scope.Game = new Game();

        $scope.Field = new Field();
        $scope.Field.calculateSize();
        $scope.Field.calculateCenter();
        $scope.Field.setCanvasSize();

        $scope.PauseButton = new PauseButton();

        $scope.Ball = new Ball();

        $scope.Players = {
            left: new LeftPlayer(),
            right: new RightPlayer(),
        }

        var canvas, playerBarY, point, velocity;
        $scope.mouseDown = false;
        var Config = {
            playerBarWidth: 10,//
            playerBarHeight: 80,//
            barMotionFrequency: 1000,//
            ballSpeed: 10,//
            ballRadios: 5,//
            stepsPlayerBar: 1,//
            pauseButtonWidth: 75,//
            pauseButtonHeight: 100,//
            sound: true,//
            airFrictionAndWind: 0.3,//
            leftIsModeComputer: true,//
            rightIsModeComputer: false,//
            difficultyModeComputer: 30, //1-100,
            widthHeightRatio: 1.775,//
            canvasHeight: $scope.Field.height,//
            canvasWidth: $scope.Field.width,//
            maxHeightSize: 400//
        };

        var keys = {};

        canvas = $scope.Field.Canvas;

        function Start() {
            playerBarY = {
                left: $scope.Players.left.Bar.position.y,
                right: $scope.Players.right.Bar.position.y
            };//Starting position of the bars
            velocity = $scope.Ball.velocity;
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
                $scope.PauseButton.onClick();

            }
            else {
                console.log("none");
            }
        }

        $scope.draw = function () {
            let canvas = $scope.Field.Canvas;
            let ctx = canvas.getContext('2d');
            $scope.Field.draw();
            $scope.Players.left.Bar.draw();
            $scope.Players.right.Bar.draw();
            $scope.Players.left.Scoreboard.draw();
            $scope.Players.right.Scoreboard.draw();
            $scope.Ball.draw();
            if ($scope.Game.isGamePaused === true || $scope.Game.isGameStarted === false) {
                $scope.PauseButton.draw();
            }
            $scope.Game.isGameStarted = true;
            if ($scope.Game.isGamePaused === false) {
                $scope.Ball.move();
                $scope.Players.left.Bar.computerMove();
                $scope.Players.right.Bar.computerMove();
                window.requestAnimationFrame($scope.draw);
            }
        };

        $scope.init = function ($event) {
            if ($event.type === "mousedown") {
                $scope.mouseDown = true;
            }
            else {
                console.error("$event.type deveria ser 'mousedown' verifique a diretiva.");
            }
            var elem;
            //canvasCurrentTarget($event);
            $scope.Field.onClick($event);
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
        $scope.computerMove = function () {
            for (var i = 0; i < Config.difficultyModeComputer / 10; i++) {
                if (Config.leftIsModeComputer && velocity.horizontalSense < 0) {
                    if ($scope.Ball.position.y < playerBarY.left + Config.playerBarHeight && velocity.verticalSense < 0) {
                        playerBarY.left = Math.max(playerBarY.left - Config.stepsPlayerBar, 0);
                    }
                    else if ($scope.Ball.position.y > playerBarY.left && velocity.verticalSense > 0) {
                        playerBarY.left = Math.min(playerBarY.left + Config.stepsPlayerBar, canvas.height - Config.playerBarHeight);
                    }
                }
            }
        };
        $scope.motionInterval = false;
        window.onkeydown = window.onkeyup = function (event) {
            console.log(event);

            if (event.code === "Space" && event.type === "keydown") {//bar space = pause
                $scope.PauseButton.onClick();
            }
            keys[event.keyCode] = event.type === 'keydown';//Saves situation of keys: down = true, up = false
            if ($scope.motionInterval === false) {
                $scope.startMotionInterval();//Initializes the movements of the bars
            }
        };

        Start();
    }]);