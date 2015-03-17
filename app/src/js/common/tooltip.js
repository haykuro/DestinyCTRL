define(function() {
  function Tooltip(target, content) {
    var self = this;

    this.target = target;
    this.content = content.cloneNode(true);

    target.addEventListener('mouseover', function(evt) {
      self.updatePosition(evt.x, evt.y);
      self.showTooltip();
    });

    target.addEventListener('mousemove', function(evt) {
      self.updatePosition(evt.x, evt.y);
    });

    target.addEventListener('mouseout', function() {
      self.hideTooltip();
    });
  }

  Tooltip.prototype.updatePosition = function(x, y) {
    var tooltip = this.getTooltip();
    var gap = 15;
    var xDelta = x + gap;
    var yDelta = y - (tooltip.offsetHeight / 2);
    var topEdge = yDelta - gap;
    var bottomEdge = (yDelta + gap) + tooltip.offsetHeight;
    var leftEdge = xDelta - gap;
    var rightEdge = (xDelta + gap) + tooltip.offsetWidth;

    if(rightEdge > document.body.offsetWidth) {
      xDelta -= rightEdge - document.body.offsetWidth;
    } else if(leftEdge < 0) {
      xDelta -= leftEdge;
    }

    if(document.body.offsetHeight > tooltip.offsetHeight) {
      var offCanvasTop = topEdge < 0;
      var offCanvasBottom = bottomEdge > document.body.offsetHeight;

      if(offCanvasTop) {
        yDelta -= topEdge;
      } else if(offCanvasBottom) {
        yDelta -= bottomEdge - document.body.offsetHeight;
      }
    }

    tooltip.style.top = yDelta + 'px';
    tooltip.style.left = xDelta + 'px';
  };

  Tooltip.prototype.showTooltip = function() {
    var tooltip = this.getTooltip();

    document.body.appendChild(tooltip);
  };

  Tooltip.prototype.hideTooltip = function() {
    var tooltip = this.getTooltip();

    tooltip.parentNode.removeChild(tooltip);
  };

  Tooltip.prototype.getTooltip = function() {
    if(! this.cachedTooltip) {
      var tooltip = document.createElement('div');

      tooltip.appendChild(this.content);

      tooltip.className = 'awesome-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.top = 0;
      tooltip.style.left = 0;
      tooltip.style.width = 250;
      tooltip.style.pointerEvents = 'none';

      this.cachedTooltip = tooltip;
    }

    return this.cachedTooltip;
  };

  return Tooltip;
});
