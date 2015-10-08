var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
    PeriodAvailability = mongoose.model('PeriodAvailability'),
    GroupSchedule = mongoose.model('GroupSchedule');

var dayCounts = [];
var population = [];
var members = [];
var tournamentSize = 5;
var uniformRate = 0.5;
var mutationRate = 0.015;

function generate(firstShiftAvail, secondShiftAvail) {
  var daysCount = firstShiftAvail.length;

  var candidate = new Array(daysCount);


}

function evolvePopulation(population, avails) {
  var newPopulation = initializePopulation(population.length, null);
  newPopulation[0] = getFittest(population);

  for (var i = 1; i < population.length; i++) {
    var schedule1 = tournamentSelection(population);
    var schedule2 = tournamentSelection(population);
    var newSchedule = crossover(schedule1, schedule2);
    newPopulation[i] = newSchedule;
  }

  // Mutate population
  for (var i = 1; i < newPopulation.length; i++) {
    newPopulation[i] = mutate(newPopulation[i], avails);
  }

  return newPopulation;
}

function tournamentSelection(population) {
  // Create a tournament population
  var tournament = initializePopulation(tournamentSize, null);
  // For each place in the tournament get a random individual
  for (var i = 0; i < tournamentSize; i++) {
    var randomId = Math.floor(Math.random() * population.length);
    //console.log("random index: " + randomId);
    tournament[i] = population[randomId];
  }

  //console.log("Tournament: " + tournament);
  // Get the fittest
  var fittest = getFittest(tournament);
  return fittest;
}

// Crossover individuals
function crossover(schedule1, schedule2) {
  var newSol = new Array(schedule1.length);
  // Loop through genes
  for (var i = 0; i < schedule1.length; i++) {
    // Crossover
    if (Math.random() < uniformRate) {
      newSol[i] = schedule1[i];
    } else {
      newSol[i] = schedule2[i];
    }
  }
  return newSol;
}

// Mutate an individual
function mutate(schedule, avails) {
  // Loop through genes
  for (var i = 0; i < schedule.length; i++) {
    if (Math.random() <= mutationRate) {
      // Create random gene
      var availability = avails[i];
      var max = availability.length - 1;
      schedule[i] = (availability[Math.floor(Math.random() * max)]);
    }
  }

  return schedule;
}

function initializePopulation(size, avails) {
  var population = new Array(size);
  if (avails) {
    for (var i = 0; i < size; i++) {
      population[i] = generateRandomSchedule(avails);
    }
  }
  //console.log("Population initialized. Size = " + size);
  //console.log(population);
  return population;
}

function getFittest(population) {
  var fittest = population[0];
  for (var i=1; i < population.length;i++) {
    if (getFitness(fittest) < getFitness(population[i])) {
      fittest = population[i];
    }
  }
  return fittest;
}

function generateRandomSchedule(avails) {
  var daysCount = avails.length;
  var candidate = new Array(daysCount);
  avails.forEach(function (availability, index) {
    if (availability.length) {
      var max = availability.length - 1;
      candidate[index] = (availability[Math.floor(Math.random() * max)]);
      dayCounts[candidate[index].id]++;
    }
  });
  return candidate;
}

function initializeDayCounts() {
  for (var i = 0; i < members.length; i++) {
    dayCounts[members[i].id] = 0;
  }
  return dayCounts;
}

function getFitness(schedule) {
  var score = 100;
  var memberCount = members.length;
  var days = schedule.length;
  var averageWorkingDays =  days / memberCount;
  //console.log("Member Count: " + memberCount);
  //console.log("days: " + days);
  //console.log("Average days: " + averageWorkingDays);

  for (var i=0; i < schedule.length; i++) {
    var currentWorker = schedule[i];
    if (i < (schedule.length - 2)) {
      var nextDayWorker = schedule[i+1];
      var nextNextDayWorker = schedule[i+2];
      if (currentWorker && currentWorker.id && nextDayWorker && nextNextDayWorker &&
          ((currentWorker.id == nextDayWorker.id) && (currentWorker.id  == nextNextDayWorker.id))) {
        if (i < (schedule.length - 3)) {
          var nextNextNextDayWorker = schedule[i+3];
          if (nextNextNextDayWorker && (currentWorker.id == nextNextNextDayWorker.id)) {
            //console.log("Working more than 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
            score -= 10;
          } else {
            //console.log("Working 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
            score += 1;
          }
        } else {
          //console.log("Working 3 days in a row. " + currentWorker.firstName + " " + currentWorker.lastName);
          score +=1;
        }
      }
    }
  }


  for (var i=0; i < schedule.length - 7; i++) {
    var map = {};
    for (var j = i; j <= i + 6; j++) {
      var member = schedule[j];
      if (member && member.id) {
        if (map[member.id]) {
          map[member.id]++;
          if (map[member.id] == 4) {
            //console.log("Working more than 3 days in week. " + member.id + ". "  + member.firstName + " " + member.lastName);
            score -= 20;
          }
        } else {
          map[member.id] = 1;
        }
      }
    }

  }

  if (averageWorkingDays > 3) {
    for (var i = 0; i < memberCount; i++) {
      if (dayCounts[members[i].id] >= (averageWorkingDays - 1)) {
        //console.log("Working more than average. " + members[i].firstName + " " + members[i].lastName);
        score -= 10;
      }
    }
  }
  return score;
}


function generateSchedule(periodAvailabilities) {
  //var members = [];
  var daysCount = periodAvailabilities[0].availabilities.length;
  var firstShiftAvail = [];
  var secondShiftAvail = [];
  for (var i = 0; i < daysCount; i++) {
    firstShiftAvail.push([]);
    secondShiftAvail.push([]);
  }
  periodAvailabilities.forEach(function (pa) {
    members.push(pa.member);
    for (var i = 0; i < daysCount; i++) {
      if (pa.availabilities[i] == 'AM') {
        firstShiftAvail[i].push(pa.member);
      } else if (pa.availabilities[i] == 'PM') {
        secondShiftAvail[i].push(pa.member);
      }
    }
  });

  //console.log(firstShiftAvail);
  //console.log(secondShiftAvail);

  initializeDayCounts();


  var firstShiftPopulation = initializePopulation(daysCount, firstShiftAvail);
  var secondShiftPopulation = initializePopulation(daysCount, secondShiftAvail);

  var firstShiftSchedule;
  var secondShiftSchedule;
  var count = 0;
  while (count < 10) {
    count++;
    firstShiftPopulation = evolvePopulation(firstShiftPopulation, firstShiftAvail);
    secondShiftPopulation = evolvePopulation(secondShiftPopulation, secondShiftAvail);

    console.log("Generation #" + count + ". 1st Fittest: " + getFitness(getFittest(firstShiftPopulation)) +
        ". 2nd fittest: " + getFitness(getFittest(secondShiftPopulation)));
  }

  firstShiftSchedule = getFittest(firstShiftPopulation);
  secondShiftSchedule = getFittest(secondShiftPopulation);

  return [firstShiftSchedule, secondShiftSchedule];
  //GroupSchedule.findById(periodAvailabilities[0].period_id, function(err, period) {
  //  var days = getDays(period.startDate, period.endDate);
  //  var periodLength = days.length;
  //  console.log('Period length: ' + periodLength);
  //
  //});

};

exports.generatePeriodSchedule = function (req, res) {
  var periodId = req.params.periodId;
  console.log("Generating period schedule using genetic algorithm.");
  PeriodAvailability.find({period_id: periodId}, function (err, periodAvailabilities) {
    if (err) {
      console.log('Cannot get period availabilities. Period Id: ' + periodId);
      res.status(400);
      return res.send({reason: err.toString()});
    }
    res.send(generateSchedule(periodAvailabilities));
    //res.send({status: 'OK'});
  });

};