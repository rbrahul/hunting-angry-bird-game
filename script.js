var positions = {};
var guliPosition = {};
var intervalsArray = [];
var gunAngle = 0;
var perPoint = 10;
var totalPoint = 0;
var totalBullets = 7;
var totalBirds = 4;
var step = 1;
var bulletSpeed=5;

function fire(pos) {
  if (!$(".blasting").is(':animated')) {
    $(".blasting").css({
      left: pos.left,
      top: pos.top
    });
    $(".blasting").fadeIn(500).fadeOut(1500);
  }

}

function playAgain() {
  
   $("#introModal").modal('show');
  $(".sptep-2-boxes").hide();
  step = 1;
  totalBirds = 4;
  totalPoint = 0;
  totalBullets = 7;
  resetAnimation();
  $(".point").text(totalPoint);
  $(".box1,.box2,.box3,.box4").show();
  boxAnimation("box1");
  boxAnimation("box2");
  boxAnimation("box3");
  boxAnimation("box4");
  var i = $(".bullet-item").length;
  for (; i < 7; i++) {
    $("#bullet-list").append('<li class="bullet-item"></li>');
  }
  gunAngle = 0;

  $("#gun").css({
    transform: 'rotate(' + gunAngle + 'deg)'
  });
  $(".guli").css({
    transform: 'rotate(' + gunAngle + 'deg)'
  });
$("#zero-bullet").hide();
}

function step2() {
  step = 2;
  totalBirds = 5;
  totalBullets = 7;
  var i = $(".bullet-item").length;
  for (; i < 7; i++) {
    $("#bullet-list").append('<li class="bullet-item"></li>');
  }
  $(".sptep-2-boxes").show();
  boxAnimation("box5", 40);
  boxAnimation("box6", 40);
  boxAnimation("box7", 40);
  boxAnimation("box8", 40);
  boxAnimation("box9", 40);
}

function resetAnimation() {

  intervalsArray.forEach(function(intv) {
    clearInterval(intv);

  });
}

function updateScore() {
  totalBullets--;
  $(".point").text(totalPoint);
  if (totalBullets > 0) {
    $(".bullet-item:last").remove();
    console.log(totalBullets);


  } else {
    $(".bullet-item:last").remove();
    $("#zero-bullet").show();
  }

}

function boxAnimation(box, speeds) {

  var speed = (typeof speeds != 'undefined') ? speeds : 50;
  var startX = 0;
  var startY = 0;
  console.log(speeds);

  var pos = {};
  positions[box] = pos;
  positions[box].direction = 'bottom';
  positions[box].forWordDirection = 'right';
  //console.log(positions[box].direction);
  var containerWidth = $(".anim-pan").width();
  var containerHeight = 300; //$(".anim-pan").height();

  var interval = setInterval(function() {
    // startX+=3;

    var topMargin = $("." + box).offset().top;
    var leftMargin = $("." + box).offset().left;


    if (!positions.hasOwnProperty(box)) {
      //  console.log("not found");
      pos = {
        "left": leftMargin,
        "top": topMargin
      };
      positions[box] = pos;
      // console.log(positions[box].left);
    } else {

      pos = {
        "left": leftMargin,
        "top": topMargin
      };
      positions[box].left = leftMargin;
      positions[box].top = topMargin;
      // console.log(positions[box].left);
      var animate = false;
      for (var ball in positions) {
        // console.log(ball);
        if (
          ball != box &&
          leftMargin >= positions[ball].left &&
          leftMargin <= (positions[ball].left + 70) &&
          topMargin >= positions[ball].top &&
          topMargin <= (positions[ball].top + 70)

        ) {

          /*======== I DONT want to show fire on boll collisionts withe each other=====*/
          // animate=true;

          if (positions[box].direction == "bottom") {
            positions[box].direction = "up";

          } else {
            positions[box].direction = "bottom";

          }
          if (positions[box].forWordDirection == "right") {
            positions[box].forWordDirection = "left";

          } else {
            positions[box].forWordDirection = "right";

          }


        }

        if (

          guliPosition.left > leftMargin &&
          guliPosition.left < leftMargin + 70 &&
          guliPosition.top > topMargin &&
          guliPosition.top < topMargin + 70) {
          //if animate set true then bomb will fire
          animate = true;
          $("." + box).hide();


        } // match with guli



      }

    } //property defined


    if (positions[box].direction == 'bottom' && topMargin <= containerHeight - 70) {

      if (topMargin > containerHeight - 80) {
        positions[box].direction = 'up';
      }
      startY += 5;

    } else {
      startY -= 5;
      //  console.log(direction);
      if (topMargin <= 10) {
        positions[box].direction = 'bottom';
      }

    }


    if (positions[box].forWordDirection == 'right' && leftMargin <= containerWidth - 10) {

      if (leftMargin > containerWidth - 30) {
        positions[box].forWordDirection = 'left';
      }
      startX += 5;

    } else {
      //console.log();
      startX -= 5;
      // console.log(direction);
      if (leftMargin <= 10) {
        positions[box].forWordDirection = 'right';
      }

    }

    $("." + box).css({
      "margin-left": startX + 'px',
      'margin-top': startY + 'px'
    });

    if (animate === true) {
      fire(pos);
      animate = false;
      totalPoint += perPoint;
      $(".point").text(totalPoint);
      document.getElementById("blasting-sound").play();
      delete positions[box];
      --totalBirds;
      if (totalBirds == 0 && step == 1) {
        step2();
       
      }
        if (totalBirds == 0 && step == 2) {
          $("#score-point").html(totalPoint);
          $("#scoreModal").modal("show");
        }

    }

  }, speed);
  intervalsArray.push(interval);


} //method ends here
$(document).ready(function() {
  boxAnimation("box1");
  boxAnimation("box2");
  boxAnimation("box3");
  boxAnimation("box4");
  $("#stop").click(resetAnimation);
  // clearInterval(interval);


  /*========== MOVING GUN=========*/
  var
    dragStart = false;
  var gunPosition = {
    old: 0,
    new: 0
  };
  $("#gun").on("mousedown", function(e) {
    gunPosition.old = event.pageX;
    console.log(gunPosition.old);
    dragStart = true;
  });
  $(".anim-pan").on("mouseup", function(e) {
    gunPosition.new = event.pageX;
    dragStart = false;
  });

  $(".anim-pan").on("mousemove", function(e) {
    if (dragStart === true) {
      gunPosition.new = event.pageX;
      var distance = gunPosition.new - gunPosition.old;
      gunAngle = distance;
      if (distance < 50 && distance > -50) {
        $("#gun").css({
          transform: 'rotate(' + gunAngle + 'deg)'
        });
        $(".guli").css({
          transform: 'rotate(' + gunAngle + 'deg)'
        });
      }
    }
  });

  /*========trigger guli=========*/
  $(".gun-trigger").click(function() {

    if (totalBullets > 0) {

      document.getElementById("shoot").play();
      var guliInterval = setInterval(function() {
        var top = $(".guli").offset().top;
        var left = $(".guli").offset().left;
        guliPosition.left = left;
        guliPosition.top = top;
        var containerWidth = $(".anim-pan").width();
        var containerHeight = $(".anim-pan").height();
        // console.log(top+" and "+left);
var radiun=gunAngle*(Math.PI/180);
var distanceEdge=Math.tan(radiun)*100;
var Xunit=distanceEdge/20;//smaller unit about 5px 
var Yunit=100/20;// here 100 is height 100px asumed
if(gunAngle<0){
  Xunit=(-1)*Xunit;
}
console.log(Xunit);
        $(".guli").css({
          top: top - 5,
          left: left + Xunit
        });
        // && left>=0&&left<=containerWidth

        if (top < 50 || left > containerWidth) {

          $(".guli").css({
            top: containerHeight - 30,
            left: (containerWidth / 2) + 75
          });
          clearInterval(guliInterval);
          guliPosition.left = 0;
          guliPosition.top = 0;

        }

      }, bulletSpeed);//bulletSpeed

      updateScore();
    } //if bullete avail able
  });

  $(window).on("load,resize", function() {
    var containerWidthcontainerWidth = $(".anim-pan").width();
    var containerHeight = $(".anim-pan").height();
    $(".anim-pan").css({
      "background-size": containerWidth + "px," + containerHeight + "px",
      "background-repeat": "no-repeat"
    });
  });


  $(".replay-btn").click(function(e) {
    e.preventDefault();

    playAgain();
  });
  
  $(window).load(function(){
       $("#introModal").modal('show');
  });



});