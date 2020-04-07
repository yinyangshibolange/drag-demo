(function(window, document) {
  const xstep = 5 // 移动和缩放的横向方向上的步长
  const ystep = 5 // 移动和缩放的竖直方向上的步长
  let rela;

  function init(dom) {
    rela = dom.parentNode
    dom.__proto__.customResize = function(original, widthChange, heightChange, leftChange, topChange) {
      const {
        offsetTop,
        offsetLeft,
        offsetWidth,
        offsetHeight
      } = original
      const minWidth = 10
      const minHeight = 10
      if (widthChange && leftChange && (offsetWidth + widthChange) >= minWidth) {
        this.style.width = offsetWidth + widthChange + 'px'
        this.style.left = offsetLeft + leftChange + 'px'
        if ((offsetLeft + leftChange) < 0) {
          this.style.left = 0
          this.style.width = offsetLeft + offsetWidth + 'px'
        }
      }
      if (widthChange && !leftChange && (offsetWidth + widthChange) >= minWidth) {
        this.style.width = offsetWidth + widthChange + 'px'
        this.style.left = offsetLeft + leftChange + 'px'
        if ((offsetWidth + widthChange + offsetLeft) > rela.offsetWidth) {
          this.style.width = rela.offsetWidth - offsetLeft + 'px'
        }
      }
      if (heightChange && topChange && (offsetHeight + heightChange) >= minHeight) {
        this.style.height = offsetHeight + heightChange + 'px'
        this.style.top = offsetTop + topChange + 'px'
        if ((offsetTop + topChange) < 0) {
          this.style.top = 0
          this.style.height = offsetTop + offsetHeight + 'px'
        }
      }
      if (heightChange && !topChange && (offsetHeight + heightChange) >= minHeight) {
        this.style.height = offsetHeight + heightChange + 'px'
        this.style.top = offsetTop + topChange + 'px'
      }
      updateHeight()
    }

    const pointsContainer = document.createElement('div')
    pointsContainer.style.position = 'relative'
    pointsContainer.style.width = '100%'
    pointsContainer.style.height = '100%'
    pointsContainer.style.display = 'none'
    createZoomPoint(dom, pointsContainer)
    dom.appendChild(pointsContainer)
    unitActive(dom)
  }

  function updateHeight() {
    const children = rela.children
    let maxHeight = 0;
    for (let i = 0; i < children.length; i++) {
      const {
        offsetTop,
        offsetHeight
      } = children[i]
      if ((offsetTop + offsetHeight) > maxHeight) maxHeight = offsetTop + offsetHeight
    }
    rela.style.height = maxHeight + 'px'
    return maxHeight
  }

  function unitActive(unit) {
    for (let i = 0; i < unit.parentNode.children.length; i++) {
      const ele = unit.parentNode.children[i]
      ele.children[0].style.display = 'none'
    }
    unit.children[0].style.display = 'block'
  }

  function ZoomPoint(point) {
    this.point = point
    this.setStyle = function(style) {
      Object.keys(style).forEach(key => {
        this.point.style[key] = style[key]
      })
      return this
    }
    this.onmousedown = function(func) {
      this.point.addEventListener('mousedown', func)
    }

  }

  function createZoomPoint(unit, pointsContainer) {
    let pointBasicStyle = {
      position: 'absolute',
      width: '8px',
      height: '8px',
      'border-radius': '20px',
      'box-sizing': 'border-box',
      'box-shadow': '1px 1px 0 #ccc, -1px 1px 0 #ccc, 1px -1px 0 #ccc, -1px -1px 0 #ccc',
      background: '#0023cc'
    }

    const zoomPoints = [{
      type: 'topleft',
      ownstyle: {
        top: '-4px',
        left: '-4px',
        cursor: 'nw-resize'
      },
      resizemode: [-1, -1, 1, 1]
    }, {
      type: 'topmiddle',
      ownstyle: {
        top: '-4px',
        left: 'calc(50% - 4px)',
        cursor: 'n-resize'
      },
      resizemode: [0, -1, 0, 1]
    }, {
      type: 'topright',
      ownstyle: {
        top: '-4px',
        right: '-4px',
        cursor: 'ne-resize'
      },
      resizemode: [1, -1, 0, 1]
    }, {
      type: 'leftmiddle',
      ownstyle: {
        left: '-4px',
        top: 'calc(50% - 4px)',
        cursor: 'w-resize'
      },
      resizemode: [-1, 0, 1, 0]
    }, {
      type: 'leftbottom',
      ownstyle: {
        left: '-4px',
        bottom: '-4px',
        cursor: 'sw-resize'
      },
      resizemode: [-1, 1, 1, 0]
    }, {
      type: 'rightmiddle',
      ownstyle: {
        right: '-4px',
        top: 'calc(50% - 4px)',
        cursor: 'e-resize'
      },
      resizemode: [1, 0, 0, 0]
    }, {
      type: 'rightbottom',
      ownstyle: {
        right: '-4px',
        bottom: '-4px',
        cursor: 'se-resize'
      },
      resizemode: [1, 1, 0, 0]
    }, {
      type: 'bottommiddle',
      ownstyle: {
        bottom: '-4px',
        left: 'calc(50% - 4px)',
        cursor: 's-resize'
      },
      resizemode: [0, 1, 0, 0]
    }, ]

    zoomPoints.forEach(point => {
      const zoomPoint = new ZoomPoint(document.createElement('div')).setStyle(pointBasicStyle).setStyle(point.ownstyle)
      zoomPoint.onmousedown(function(ev) {
        clearEv(ev)
        const downPageX = ev.pageX
        const downPageY = ev.pageY
        const {
          offsetTop,
          offsetLeft,
          offsetWidth,
          offsetHeight
        } = unit
        document.onmousemove = function(ev) {
          clearEv(ev)
          const {
            pageX,
            pageY
          } = ev
          const xChange = Math.round((pageX - downPageX) / xstep) * xstep
          const yChange = Math.round((pageY - downPageY) / ystep) * ystep
          unit.customResize({
            offsetTop,
            offsetLeft,
            offsetWidth,
            offsetHeight
          }, xChange * point.resizemode[0], yChange * point.resizemode[1], xChange * point.resizemode[2], yChange * point.resizemode[3])
        }
        document.onmouseup = function(ev) {
          document.onmousemove = null
        }
      })

      pointsContainer.appendChild(zoomPoint.point)
    })

  }

  function clearEv(ev) {
    var oEvent = ev || event;
    if (oEvent.preventDefault) oEvent.preventDefault();
    if (oEvent.stopPropagation) oEvent.stopPropagation()
    oEvent.returnValue = false;
    oEvent.cancelBubble = true;
  }

  window.scale = { init, unitActive }
})(window, document)
