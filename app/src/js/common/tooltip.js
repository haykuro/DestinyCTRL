define(function() {
  function hasClass(el, className) {
    return el.className.split(' ').some(function(_className) {
      return _className === className;
    });
  }

  function addClass(el, className) {
    cleanClass(el);

    if(! hasClass(el, className)) {
      el.className += ' ' + className;
    }
  }

  function removeClass(el, className) {
    cleanClass(el);

    if(hasClass(el, className)) {
      el.className = el.className.split(' ').filter(function(_className) {
        return _className !== className;
      });
    }
  }

  function cleanClass(el) {
    el.className = el.className.split(' ').filter(function(_className) {
      return _className.length;
    }).join(' ');
  }

  function Tooltip(target, content, delay) {
    var self = this;

    this.delay = delay || 250;
    this.target = target;
    this.content = content.cloneNode(true);

    target.addEventListener('mouseover', function(evt) {
      evt.stopPropagation();

      self.updatePosition(evt.x, evt.y);
      self.showTooltip();
    }, true);

    target.addEventListener('mousemove', function(evt) {
      evt.stopPropagation();

      self.updatePosition(evt.x, evt.y);
    }, true);

    target.addEventListener('mouseout', function(evt) {
      evt.stopPropagation();

      self.updatePosition(evt.x, evt.y);
      self.hideTooltip();
    }, true);
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
    this.clearTimer();

    var tooltip = this.getTooltip();

    document.body.appendChild(tooltip);

    if(! hasClass(tooltip, 'visible')) {
      this.timer = setTimeout(function() {
        addClass(tooltip, 'visible');
      }, this.delay);
    }
  };

  Tooltip.prototype.hideTooltip = function() {
    this.clearTimer();

    var tooltip = this.getTooltip();

    removeClass(tooltip, 'visible');

    tooltip.parentNode.removeChild(tooltip);
  };

  Tooltip.prototype.clearTimer = function() {
    if(this.timer) {
      clearTimeout(this.timer);

      delete this.timer;
    }
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
