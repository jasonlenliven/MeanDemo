angular.module('app').factory('algorithm', function() {
  var members = [];
  var tournamentSize = 5;
  var uniformRate = 0.5;
  var mutationRate = 0.025;
  var maxConsecutiveDays;


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

    //console.log("Tournament");
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
        var max = availability.length;
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
    var fittestVal = getFitness(fittest);
    for (var i=1; i < population.length;i++) {
      if (fittestVal < getFitness(population[i])) {
        fittest = population[i];
        fittestVal = getFitness(fittest);
      }
    }
    //console.log("Fittest: " + fittestVal);
    return fittest;
  }

  function generateRandomSchedule(avails) {
    var daysCount = avails.length;
    var candidate = new Array(daysCount);
    avails.forEach(function (availability, index) {
      if (availability.length) {
        var max = availability.length;
        candidate[index] = (availability[Math.floor(Math.random() * max)]);
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

  function consecutiveWorkingDays(schedule, startIndex, maxDays) {
    var days = 1;
    if (!schedule[startIndex])
      return days;

    var memberId = schedule[startIndex].id;
    for (var i = startIndex + 1; i < schedule.length; i++) {
      if (schedule[i] && (schedule[i].id == memberId)) {
        days++;
        if (days > maxDays) {
          return days;
        }
      } else {
        return days;
      }
    }
    return days;
  }

  function getFitness(schedule) {
    var score = 0;
    var memberCount = members.length;
    var days = schedule.length;
    var averageWorkingDays = Math.floor(days / memberCount);
    //console.log("Member Count: " + memberCount);
    //console.log("days: " + days);
    //console.log("Average days: " + averageWorkingDays);


    var dayCounts = []
    for (var i = 0; i < members.length; i++) {
      dayCounts[members[i].id] = 0;
    }

    for (var i=0; i < schedule.length; i++) {
      if (schedule[i]) {
        dayCounts[schedule[i].id]++;
      }

      var consecutiveDays = consecutiveWorkingDays(schedule, i, maxConsecutiveDays);

      if (consecutiveDays > maxConsecutiveDays) {
        score -= 5000;
        //console.log("Working more than x days in a row. " + ". " + score);
      } else if (consecutiveDays > 1) {
        //console.log("Working x days in a row. ");
        score += 3 * (consecutiveDays);
      }


    }

    for (var i=0; i < schedule.length - 7; i++) {
      var map = {};
      for (var j = i; j <= i + 6; j++) {
        var member = schedule[j];

        if (member && member.id) {
          if (map[member.id]) {
            map[member.id]++;
            if (map[member.id] > maxConsecutiveDays) {
              score -= 5000;
              //console.log("Working more than x days in week. " + member.id + ". "  + member.firstName + " " + member.lastName + ". " + score);
            }
          } else {
            map[member.id] = 1;
          }
        }
      }

    }

    if (averageWorkingDays > maxConsecutiveDays) {
      for (var i = 0; i < memberCount; i++) {
        var days = dayCounts[members[i].id];
        if (days > averageWorkingDays + 1) {
          score -= 50 * (days - averageWorkingDays);
          //console.log("Working more than average. " + members[i].firstName + " " + members[i].lastName + ". " + score);
        } else if (days == averageWorkingDays) {
          score += 20;
        } else if (days < averageWorkingDays && days >= maxConsecutiveDays) {
          score += 5;
        } else if (days < maxConsecutiveDays) {
          score -= 10;
        }

      }
    }

    //console.log("Score : " + score);
    return score;
  }

  return {
    generate: function (avails, groupMembers, consecutiveDays) {
      members = groupMembers;
      maxConsecutiveDays = consecutiveDays;

      var population = initializePopulation(50, avails);
      var fittest;
      var count = 0;
      while (count < 120) {
        count++;
        population = evolvePopulation(population, avails);
        fittest = getFittest(population);
        console.log("Generation #" + count + ". Fittest: " + getFitness(fittest));
      }
      return fittest;
    }
  }
})