window.SimonNameSpace = {

  DefaultMixName: "New Mix",
  DefaultCocktailHeight: "600px",
  DefaultCocktailWidth: "300px",

  Cocktail: function(){
    this.addMix = addMix;
    this.getHtmlElement = getHtmlElement;
    this.getMixList = getMixList;
    this.getTotalParts = getTotalParts;
    this.empty = empty;
    
    var mixList = {};
    var $cocktailElement = $(document.createElement("div")).addClass("cocktail");
    var $menuElement = $(document.createElement("div")).addClass("mix_menu");


    function addMix(mix){
      typeof mixList[mix.name] === "undefined"?
        mixList[mix.name] = mix :
        mixList[mix.name].parts += mix.parts;

      redraw();
    }

    function getMixList(){
      return mixList;
    }

    function getTotalParts(){
      var count = 0;
      for(var s in mixList){
        count += mixList[s].parts;
      }
      return count;
    }

    function empty(){
      mixList = {};
      redraw();
    }

    function redraw(){
      if(typeof $cocktailElement !== "undefined")
        $cocktailElement.find(".mix").remove();
      drawMixes();
    }

    function drawGlass(){
      var $glass = $(document.createElement("div"));
      $glass.addClass("glass").css({height: "100%"});

      $cocktailElement.append($glass);
    }

    function drawMixes(){
      $cocktailElement.find(".mix").remove();
      var totalParts = getTotalParts();
      if(totalParts > 0){
        var eHeight = $cocktailElement.outerHeight();
        var width = $cocktailElement.width();
        var offset = eHeight;
        var mixHeight = (eHeight*3/4)/totalParts;
        for(var s in mixList){
          var delta = mixHeight * mixList[s].parts;
          offset -= delta;
          var $mixElement = mixList[s].getHtmlElement();
          $mixElement.css({height: delta, width: width, top: offset});
          $mixElement.append("<p class='parts'>" + (mixList[s].parts/totalParts*100).toFixed(2) + "%</p>")
          $cocktailElement.append($mixElement);
        }
      }
    }

    function getMenu(){

    }

    function getHtmlElement(height, width){
      if(!(typeof height === "undefined" || height === null)){
        if(typeof height === "number")
          height = height + "px";
      }else{
        height = SimonNameSpace.DefaultCocktailHeight;
      }
      if(!(typeof width === "undefined" || width === null)){
        if(typeof width === "number")
          width = width + "px";
      }else{
        width = SimonNameSpace.DefaultCocktailWidth;
      }

      $cocktailElement.height(height).width(width);
      //drawGlass();
      drawMixes();
      return $cocktailElement[0];
    }

  },


  Mix: function(name, parts, colour){
    this.getHtmlElement = getHtmlElement;

    if(!(typeof name !== "string" || name === null))
      this.name = name;
    else
      this.name = DefaultMixName;

    if(!(typeof parts !== "number" || parts === null))
      this.parts = parts;
    else
      this.parts = 1;

    if(!(typeof colour !== "string" || colour === ""))
      this.colour = colour;
    else
      this.colour = "#000";

    function getHtmlElement(){
      var $element = $(document.createElement("div"));
      $element.addClass("mix").addClass(this.name).css({backgroundColor: this.colour});
      var $dragPoint = $(document.createElement("div")).addClass("dragPoint").append($(document.createElement("img")).attr({"src": "drag.png", "height": "50px", "width": "50px"})).css({height: "50px", width: "50px"})
      //$dragPoint.css({"marginTop":"-25px"})
      $element.append($dragPoint)

      return $element;
    }
  }


}