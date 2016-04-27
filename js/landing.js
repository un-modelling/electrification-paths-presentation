$(document).ready(function() {

  drawConsumptionBar();

  $('[data-toggle="tooltip"]').tooltip()

  //disable fullpage in mobile
  if (screen.width > 1020) {
    $('#fullpage').fullpage({
      'verticalCentered': true,
      'css3': true,
      'navigation': true,
      'navigationPosition': 'right',
      'navigationTooltips': ['Home', 'Introduction', 'Universal Access', 'Technologies', 'Scenarios', 'How to Use this Tool', 'How to Use this Tool'],
      'showActiveTooltip': true,
      'slideTooltips': ["slide 1", "slide 2", "slide 3", "slide 4"],
      'afterLoad': function(anchorLink, index) {

      },

      'onLeave': function(index, nextIndex, direction) {
        $('.access-image').removeClass('animated fadeIn');
        $('.overlay').removeClass('animated fadeIn');

        if (nextIndex == 4) { //technologies
          $('.access-image').addClass('animated fadeIn');
        }
        if (nextIndex == 5) { //country selector
          animateConsBar();
        }
        if (nextIndex == 6) { //country selector
          $('#selector-overlay').addClass('animated fadeIn');
        }
        if (nextIndex == 7) { //last page
          $('#playground-overlay').addClass('animated fadeIn');
          $('#buttonHolder').css("display", "none");
          $('#bottomArrow').css("display", "none");
          $('#staticButton').css("display", "");
        } else {
          $('#buttonHolder').css("display", "");
          $('#bottomArrow').css("display", "");
          $('#staticButton').css("display", "none");
        }
        if (nextIndex == 1) {
          $('#topArrow').css("display", "none");
          $('#arrowDown').css("display", "none");
          $('#staticButton').css("display", "none");
        } else {
          $('#topArrow').css("display", "");
          $('#arrowDown').css("display", "");
        }
        if (nextIndex == 1) {
          $('#scrollText').css('display', '')
          $('#landingButton').css('display', '')
        } else {
          $('#scrollText').css('display', 'none')
          $('#landingButton').css('display', 'none')
        }

      }
    });

  }

  var width = d3.select("#household-consumption").style("width")
  var height = 100;
  var barHeight = height * 0.8;
  var marginTop = height * 0.2;

  var svgContainer = d3.select("#household-consumption").append("svg")
    .attr("width", width)
    .attr("height", height);

  var y = d3.scale.linear()
    .range([barHeight, 0]);

  var consData;

  var formatComma = d3.format("0,000");

  function drawConsumptionBar() {

    d3.tsv("data/household-consumption.tsv", function(error, data) {
      consData = data;
      y.domain([0, d3.max(data, function(d) {
        return +d.value;
      })]);
      var barWidth = width.replace("px", "") / data.length + 1;

      var bar = svgContainer.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return "translate(" + i * barWidth + ",0)";
        });
      bar.append("rect")
        .attr("x", function(d) {
          return barWidth * 0.125;
        })
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("width", barWidth * 0.75)
        .attr("height", function(consData) {
          return barHeight - y(consData.value);
        });

      bar.append("text")
        .attr("x", barWidth * 0.5)
        .attr("y", barHeight)
        .text(function(d) {
          return formatComma(d.value) + " kWh";
        });

    });
  }

  function animateConsBar() {
    bar = svgContainer.selectAll("g")
    bar.selectAll("rect")
      .attr("y", height)
      .transition()
      .duration(1500)
      .attr("y", function(d) {
        return y(d.value) + marginTop;
      })

    bar.selectAll("text")
      .attr("y", height)
      .text(function(d) {
        return formatComma(d.value) + " kWh";
      })
      .transition()
      .duration(1500)
      .attr("y", function(d) {
        return y(d.value) - 5 + marginTop;
      });


  };

  function enlargeImg(obj) {
    var newWindow = window.open(obj);
  }


});
