  let rela
  const xstep = 5 // 移动和缩放的横向方向上的步长
  const ystep = 5 // 移动和缩放的竖直方向上的步长
  function draginit(dom) {
    // 将dom转化为可拖拽的dom， 需要获取父级容器参数，父计容器只有，只向上寻找一级
    rela = dom.parentNode
    updateHeight()
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

  function bindDownMove(ev, inUnit = null, cb) {
    const offsetTop = inUnit ? inUnit.offsetTop : 0
    const offsetLeft = inUnit ? inUnit.offsetLeft : 0
    const pageX = ev.pageX
    const pageY = ev.pageY

    function downmousemove(ev) {
      clearEv(ev)
      updatepos({
        offsetTop,
        offsetLeft,
        pageX,
        pageY
      }, ev, inUnit)
      cb()
    }
    document.onmousemove = downmousemove

    document.onmouseup = function(ev) {
      document.onmousemove = null;
      unit = null;
    }
  }

  function updatepos(ori_option, ev, inUnit = null) {
    const xChange = ev.pageX - ori_option.pageX
    const yChange = ev.pageY - ori_option.pageY
    const {
      offsetLeft,
      offsetTop,
      offsetWidth
    } = rela;
    const width = inUnit ? inUnit.offsetWidth : chartInitWidth;
    const height = inUnit ? inUnit.offsetHeight : chartInitHeight;
    const unitTop = inUnit ? ori_option.offsetTop : (-chartInitHeight / 2 + ori_option.pageY - offsetTop)
    const unitLeft = inUnit ? ori_option.offsetLeft : (-chartInitWidth / 2 + ori_option.pageX - offsetLeft)

    // 相对位置
    let realtiveOffsetTop;
    let relativeOffsetLeft;

    if ((unitTop + yChange) >= 0) {
      realtiveOffsetTop = unitTop + yChange
    } else {
      realtiveOffsetTop = 0;
    }
    if ((unitLeft + xChange) >= 0) {
      if ((unitLeft + xChange + width) <= offsetWidth) {
        relativeOffsetLeft = unitLeft + xChange
      } else {
        relativeOffsetLeft = offsetWidth - width;
      }
    } else {
      relativeOffsetLeft = 0;
    }
    if (inUnit) {
      inUnit.style.left = relativeOffsetLeft + 'px'
      inUnit.style.top = realtiveOffsetTop + 'px'
    }

    updateHeight()
  }


  function scaleinit(dom) {
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


  export default {
    draginit,
    scaleinit,
    bindDownMove,
    unitActive
  }
