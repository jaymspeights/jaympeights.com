var num = 0;
var pcount = 0;

var $active;
var timing = false;
$(function () {
	var controls = $("#controls").css("height");
	controls = controls.substr(0, controls.length-2);
	var scoreboard = $(".scoreboard").css("height");
	scoreboard = scoreboard.substr(0, scoreboard.length-2);
	var $player_container = $("#player_container");
	$player_container.css("height", scoreboard-controls + "px");
	$player_container.on('contextmenu', function(ev) {
	  ev.preventDefault();

	  var $popup = $("<div>");
	  $popup.attr("class", "popup");

	  var $delete_all = $("<p>");
	  $delete_all.text("Delete All");
	  $popup.append($delete_all);

	  var $reset_all = $("<p>");
	  $reset_all.text("Reset All");
	  $popup.append($reset_all);

	  placePopup($popup, ev.clientX, ev.clientY);

	  $delete_all.click(function () {
		$player_container.find(".player").remove();
	  });
	  $reset_all.click(function () {
		$player_container.find(".player").each(function () {
		  var score = $(this).attr("score");
		  if (score != undefined)
			$(this).attr("prev", score);
		  $(this).removeAttr("score");
		  $(this).find("h2").text("0:000");
		});


	  });
	  return false;
	});
	$("#start_button").click(function () {
	  if (!$active) {
		alert("Must set an active climber.\n"+
			  "Click the time next to the climbers name to activate them.")
		return;
	  }
	  if (!timing) {
		Timer.reset();
		Timer.start();
		$(this).text("Stop Timer");
		timing = true;
	  }
	  else {
		Timer.stop();
		$(this).text("Start Timer");
		timing = false;
		var score = parseInt($active.attr("score"));
		var prev = parseInt($active.attr("prev"));
		if (isNaN(score) || Timer.time<score) {
		  if (!isNaN(score))
			$active.attr("prev", score);
		  $active.attr("score", Timer.time);
		  $active.find("h2").text(Timer.getTime());
		}
		else if (isNaN(prev) || Timer.time < prev)
		  $active.attr("prev", Timer.time);
	  }
	});



	$("#standings_button").click(function () {
	  var players = getPlayers();
	  if(players.length == 0) {
		alert("Must have at least one score to show standings.")
		return;
	  }

	  var $scorecard = $("<div>");
	  $scorecard.attr("class", "scorecard");

	  var $buttons = $("<div>");
	  $buttons.attr("class", "buttons");

	  var $return = $("<h2>");
	  $return.text("Return to competition");
	  $return.click(function () {
		$scorecard.remove();
	  });

	  var $save = $("<h2>");
	  $save.text("Save scores");
	  $save.click(function () {
		var text = "";
		for (var i = 0; i < players.length; i++) {
		  text += `${i+1}. ${players[i].name} - ${players[i].time}\r\n`
		}
		var date = new Date();
		var name = `scores-${date.getMonth()+1}_${date.getDate()}_${date.getFullYear()}.txt`;
		download(name, text);
	  });

	  $buttons.append($return);
	  $buttons.append($save);

	  var $standings = $("<div>");
	  $standings.attr("class", "standings");

	  for (var i = 0; i < players.length; i++) {
		var $p = $("<h2>");
		$p.text(`${i+1}. ${players[i].name} - ${players[i].time}`);
		$standings.append($p);
	  }
	  $scorecard.append($buttons);
	  $scorecard.append($standings);
	  $("body").append($scorecard);
	});



	$(".canvas").dblclick(function (e) {
	  var width = 66;
	  var height = 66;
	  var $container = $("<div>")
	  $container.attr("class", "container");
	  $container.css({"left":e.clientX - width/2, "top":e.clientY - height/2, "width":width, "height": height, "position":"absolute"})
	  $container.draggable();

	  var $tag = $("<input>");
	  $tag.attr("value", ++num);

	  var $img = $("<img>");
	  $img.attr("src", "white.png");
	  $container.append($img);
	  $container.append($tag);
	  $(this).append($container)
	  $container.on('contextmenu', function(ev) {
		ev.preventDefault();

		var $popup = $("<div>");
		$popup.attr("class", "popup");

		var $delete = $("<p>");
		$delete.text("Delete");
		$popup.append($delete);

		placePopup($popup, ev.clientX, ev.clientY);

		$delete.click(function () {
		  $container.remove();
		});
		return false;
	  });
	});

	$("#add_button").click(function () {
	  var $player = $("<div>");
	  $player.attr("class", "player");

	  var $name = $("<input>");
	  $name.attr("value", "Climber " + ++pcount)
	  $name.attr("maxlength", "12");

	  var $score = $("<h2>");
	  $score.text("0:000");

	  $score.click(function () {
		if ($active) {
		  $active.css("background-color", "inherit");
		}
		$active = $player;
		$player.css("background-color", "#444444");
	  });


	  $player.append($name);
	  $player.append($score);
	  $("#player_container").append($player);

	  $score.on('contextmenu', function(ev) {
		ev.preventDefault();

		var $popup = $("<div>");
		$popup.attr("class", "popup");

		var $reset = $("<p>");
		$reset.text("Reset Score");
		$popup.append($reset);

		var $remove = $("<p>");
		$remove.text("Delete");
		$popup.append($remove);

		var $undo = $("<p>");
		$undo.text("Undo");
		$popup.append($undo);

		placePopup($popup, ev.clientX, ev.clientY);

		$reset.click(function (e) {
		  var score = $player.attr("score");
		  if (score != undefined)
			$player.attr("prev", score);
		  $player.removeAttr("score");
		  $score.text("0:000");
		});

		$undo.click(function (e) {
		  var score = $player.attr("score");
		  var prev = $player.attr("prev");
		  if (prev == undefined)
			return;
		  $player.attr("score", prev);
		  if (score != undefined)
			$player.attr("prev", score);
		  $score.text(Timer.format(prev));
		});

		$remove.click(function (e) {
		  $player.remove();
		});

		return false;
	  });
	});
});

function download(filename, text) {
  var $temp = $("<a>");
  $temp.attr("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  $temp.attr("download", filename);

  $temp.css("display", "none");
  $("body").append($temp)
  $temp.get(0).click();
  $temp.remove();
}

function getPlayers() {
  var players = [];
  var dna = [];
  $(".player").each(function () {
    var name = $(this).find("input").get(0).value;
    var score = $(this).attr("score");

    if (score == undefined) {
      dna[dna.length] = {"name": name, "time":"Did Not Complete"};
      return;
    }
    players[players.length] = ({"name": name, "score": parseInt(score), "time":Timer.format(parseInt(score))});
  });
  players.sort(function (a, b) {
    if (a.score<b.score) return -1;
    else return 1;
  });
  return players.concat(dna);
}

function placePopup($popup, x, y) {
  var width = parseInt(x);
  width = width+100 > window.innerWidth? window.innerWidth-100 : width;
  $popup.css({"left":width, "top":y});

  $(window).click( function () {
    $popup.remove();
  });
  $("body").append($popup);
}
