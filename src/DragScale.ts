export class DragScale {
  rela;
  dom;
  xstep = 5; // 移动和缩放的横向方向上的步长
  ystep = 5; // 移动和缩放的竖直方向上的步长

  ele_para;

  bindparas;

  listshow = false;
  chartInitHeight = 100;
  chartInitWidth = 100;

  borders = [];

  constructor(dom) {
    this.rela = dom.parentNode;
    this.dom = dom;
    // dom.style.position = 'relative'
  }

  init() {
    this.draginit();
    this.scaleinit();
    // this.bindp = bindp;
  }

  remove() {
    this.rela.removeChild(this.dom);
  }

  bindparams(bindparas) {
    this.bindparas = bindparas;
  }

  draginit() {
    // 将dom转化为可拖拽的dom， 需要获取父级容器参数，父计容器只有，只向上寻找一级
    // rela = dom.parentNode
    this.updateHeight();
  }

  scaleinit() {
    // rela = dom.parentNode
    const dom = this.dom;
    const self = this;
    dom.__proto__.customResize = function(newSize: any) {
      const { left, top, width, height } = newSize;
      if (left !== undefined) this.style.left = left + 'px';
      if (top !== undefined) this.style.top = top + 'px';
      if (width !== undefined) this.style.width = width + 'px';
      if (height !== undefined) this.style.height = height + 'px';
      self.updateHeight();
    };

    // const pointsContainer = document.createElement('div');
    // pointsContainer.style.position = 'relative';
    // pointsContainer.style.width = '100%';
    // pointsContainer.style.height = '100%';
    // // pointsContainer.style.display = 'none';
    // pointsContainer.style.float = 'left'
    // pointsContainer.style.top = '0'
    // pointsContainer.style.left = '0'
    self.createZoomPoint(dom);

    dom.__proto__.isActive = false;
    dom.__proto__.hoverBorder = function() {
      if (this.isActive) return;
      self.domDisplay(this.children, 'cus-border', null).forEach(elem => {
        this.removeChild(elem);
      });
      self.createBorderContainer(this, 'dashed');
    };
    dom.__proto__.hideBorder = function() {
      if (this.isActive) return;
      self.domDisplay(this.children, 'cus-border', null).forEach(elem => {
        this.removeChild(elem);
      });
    };
    dom.__proto__.activeBorder = function() {
      this.isActive = true;
      self.domDisplay(this.children, 'cus-border', null).forEach(elem => {
        this.removeChild(elem);
      });
      self.createBorderContainer(this, 'solid');
    };
    dom.__proto__.unActiveBorder = function() {
      this.isActive = false;
      self.domDisplay(this.children, 'cus-border', null).forEach(elem => {
        this.removeChild(elem);
      });
    };

    dom.addEventListener('mouseover', function(ev) {
      console.log('hover')
      console.log(ev)
      console.log(this.isActive)
      this.hoverBorder();
    });

    dom.addEventListener('mouseout', function(ev) {
      this.hideBorder();
    });

    // dom.appendChild(pointsContainer);
    // self.unitActive(dom);

    // return pointsContainer
  }

  updateHeight() {
    if (!this.rela) {
      return 0;
    }
    const children = this.rela.children;
    let maxHeight = 0;
    for (let i = 0; i < children.length; i++) {
      const { offsetTop, offsetHeight } = children[i];
      if (offsetTop + offsetHeight > maxHeight)
        maxHeight = offsetTop + offsetHeight;
    }
    this.rela.style.height = maxHeight + 'px';
    return maxHeight;
  }

  bindDownMove(ev, inUnit = null, cb) {
    const offsetTop = inUnit ? inUnit.offsetTop : 0;
    const offsetLeft = inUnit ? inUnit.offsetLeft : 0;
    const pageX = ev.pageX;
    const pageY = ev.pageY;

    // const self = this
    // function downmousemove(ev) {

    // }
    document.onmousemove = ev => {
      this.clearEv(ev);
      this.updatepos(
        {
          offsetTop,
          offsetLeft,
          pageX,
          pageY,
        },
        ev,
        inUnit,
      );
      cb();
    };

    document.onmouseup = ev => {
      document.onmousemove = null;
    };
  }

  updatepos(ori_option, ev, inUnit = null) {
    const xChange = ev.pageX - ori_option.pageX;
    const yChange = ev.pageY - ori_option.pageY;
    const { offsetLeft, offsetTop, offsetWidth } = this.rela;
    const width = inUnit ? inUnit.offsetWidth : this.chartInitWidth;
    const height = inUnit ? inUnit.offsetHeight : this.chartInitHeight;
    const unitTop = inUnit
      ? ori_option.offsetTop
      : -this.chartInitHeight / 2 + ori_option.pageY - offsetTop;
    const unitLeft = inUnit
      ? ori_option.offsetLeft
      : -this.chartInitWidth / 2 + ori_option.pageX - offsetLeft;

    // 相对位置
    let realtiveOffsetTop;
    let relativeOffsetLeft;

    if (unitTop + yChange >= 0) {
      realtiveOffsetTop = unitTop + yChange;
    } else {
      realtiveOffsetTop = 0;
    }
    if (unitLeft + xChange >= 0) {
      if (unitLeft + xChange + width <= offsetWidth) {
        relativeOffsetLeft = unitLeft + xChange;
      } else {
        relativeOffsetLeft = offsetWidth - width;
      }
    } else {
      relativeOffsetLeft = 0;
    }
    if (inUnit) {
      if (this.bindparas && this.bindparas.length > 0) {
        this.bindparas.forEach(para => {
          para.left = relativeOffsetLeft;
          para.top = realtiveOffsetTop;
        });
        // this.bindp.left = relativeOffsetLeft
        // this.bindp.top = realtiveOffsetTop
      }
      inUnit.style.left = relativeOffsetLeft + 'px';
      inUnit.style.top = realtiveOffsetTop + 'px';
    }

    this.updateHeight();
  }

  domDisplay(children, className, cb): any[] {
    const doms = [];
    for (let i = 0; i < children.length; i++) {
      const elem = children[i];
      if (elem.className.indexOf(className) > -1) {
        doms.push(elem);
        if (cb) cb(elem);
      }
    }
    return doms;
  }

  unitActive(unit) {
    if (!unit.parentNode) return;
    for (let i = 0; i < unit.parentNode.children.length; i++) {
      const ele = unit.parentNode.children[i];
      this.domDisplay(ele.children, 'zoompoint', function(elem) {
        elem.style.display = 'none';
      });
      ele.unActiveBorder();
    }
    this.domDisplay(unit.children, 'zoompoint', function(elem) {
      elem.style.display = 'block';
    });
    unit.activeBorder();
  }

  createBorderContainer(unit, type) {
    const border = `1.5px ${type} rgb(64, 169, 255)`;
    const containers = [
      {
        style: {
          width: '100%',
          height: '0',
          top: '-1.5px',
          left: '0',
          'border-bottom': border,
        },
        className: 'cus-border-top',
      },
      {
        style: {
          width: '0',
          height: '100%',
          top: '0',
          left: '-1.5px',
          'border-right': border,
        },
        className: 'cus-border-left',
      },
      {
        style: {
          width: '100%',
          height: '0',
          bottom: '-1.5px',
          left: '0',
          'border-top': border,
        },
        className: 'cus-border-bottom',
      },
      {
        style: {
          width: '0',
          height: '100%',
          top: '0',
          right: '-1.5px',
          'border-left': border,
        },
        className: 'cus-border-right',
      },
    ];
    const borders = containers.map(ele => {
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.classList.add(ele.className);
      Object.keys(ele.style).forEach(key => {
        container.style[key] = ele.style[key];
      });
      unit.appendChild(container);
      return container;
    });
    this.borders = borders;
  }

  createZoomPoint(unit) {
    function ZoomPoint(point) {
      // 懒得写class了
      this.point = point;
      this.setStyle = function(style) {
        Object.keys(style).forEach(key => {
          this.point.style[key] = style[key];
        });
        return this;
      };
      this.addClass = function(className) {
        this.point.classList.add(className);
        return this;
      };
      this.onmousedown = function(func) {
        this.point.addEventListener('mousedown', func);
      };
    }
    const pointBasicStyle = {
      position: 'absolute',
      width: '8px',
      height: '8px',
      'border-radius': '20px',
      'box-sizing': 'border-box',
      'box-shadow':
        '1px 1px 0 #ccc, -1px 1px 0 #ccc, 1px -1px 0 #ccc, -1px -1px 0 #ccc',
      background: '#0023cc',
      display: 'none',
    };

    const zoomPoints = [
      {
        type: 'topleft',
        ownstyle: {
          top: '-4px',
          left: '-4px',
          cursor: 'nw-resize',
        },
        resizemode: [-1, -1, 1, 1],
      },
      {
        type: 'topmiddle',
        ownstyle: {
          top: '-4px',
          left: 'calc(50% - 4px)',
          cursor: 'n-resize',
        },
        resizemode: [0, -1, 0, 1],
      },
      {
        type: 'topright',
        ownstyle: {
          top: '-4px',
          right: '-4px',
          cursor: 'ne-resize',
        },
        resizemode: [1, -1, 0, 1],
      },
      {
        type: 'leftmiddle',
        ownstyle: {
          left: '-4px',
          top: 'calc(50% - 4px)',
          cursor: 'w-resize',
        },
        resizemode: [-1, 0, 1, 0],
      },
      {
        type: 'leftbottom',
        ownstyle: {
          left: '-4px',
          bottom: '-4px',
          cursor: 'sw-resize',
        },
        resizemode: [-1, 1, 1, 0],
      },
      {
        type: 'rightmiddle',
        ownstyle: {
          right: '-4px',
          top: 'calc(50% - 4px)',
          cursor: 'e-resize',
        },
        resizemode: [1, 0, 0, 0],
      },
      {
        type: 'rightbottom',
        ownstyle: {
          right: '-4px',
          bottom: '-4px',
          cursor: 'se-resize',
        },
        resizemode: [1, 1, 0, 0],
      },
      {
        type: 'bottommiddle',
        ownstyle: {
          bottom: '-4px',
          left: 'calc(50% - 4px)',
          cursor: 's-resize',
        },
        resizemode: [0, 1, 0, 0],
      },
    ];

    zoomPoints.forEach(point => {
      const zoomPoint = new ZoomPoint(document.createElement('div'))
        .setStyle(pointBasicStyle)
        .setStyle(point.ownstyle)
        .addClass('zoompoint');
      zoomPoint.onmousedown(ev => {
        this.clearEv(ev);
        const downPageX = ev.pageX;
        const downPageY = ev.pageY;
        const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = unit;
        document.onmousemove = ev => {
          this.clearEv(ev);
          const { pageX, pageY } = ev;
          const xChange =
            Math.round((pageX - downPageX) / this.xstep) * this.xstep;
          const yChange =
            Math.round((pageY - downPageY) / this.ystep) * this.ystep;

          const widthChange = xChange * point.resizemode[0];
          const heightChange = yChange * point.resizemode[1];
          const leftChange = xChange * point.resizemode[2];
          const topChange = yChange * point.resizemode[3];
          let width;
          let height;
          let left;
          let top;
          const minWidth = 10;
          const minHeight = 10;

          if (
            widthChange &&
            leftChange &&
            offsetWidth + widthChange >= minWidth
          ) {
            width = offsetWidth + widthChange;
            left = offsetLeft + leftChange;
            if (offsetLeft + leftChange < 0) {
              left = 0;
              width = offsetLeft + offsetWidth;
            }
          }
          if (
            widthChange &&
            !leftChange &&
            offsetWidth + widthChange >= minWidth
          ) {
            width = offsetWidth + widthChange;
            left = offsetLeft + leftChange;
            if (
              offsetWidth + widthChange + offsetLeft >
              this.rela.offsetWidth
            ) {
              width = this.rela.offsetWidth - offsetLeft;
            }
          }
          if (
            heightChange &&
            topChange &&
            offsetHeight + heightChange >= minHeight
          ) {
            height = offsetHeight + heightChange;
            top = offsetTop + topChange;
            if (offsetTop + topChange < 0) {
              top = 0;
              height = offsetTop + offsetHeight;
            }
          }
          if (
            heightChange &&
            !topChange &&
            offsetHeight + heightChange >= minHeight
          ) {
            height = offsetHeight + heightChange;
            top = offsetTop + topChange;
          }

          if (this.bindparas && this.bindparas.length > 0) {
            this.bindparas.forEach(para => {
              if (left !== undefined) para.left = left;
              if (top !== undefined) para.top = top;
              if (width !== undefined) para.width = width;
              if (height !== undefined) para.height = height;
            });

            this.updateHeight();
          }
          unit.customResize({ left, top, width, height });
        };
        document.onmouseup = ev => {
          document.onmousemove = null;
        };
      });

      // pointsContainer.appendChild(zoomPoint.point);
      unit.appendChild(zoomPoint.point);
    });
  }

  clearEv(ev) {
    const oEvent = ev || event;
    if (oEvent.preventDefault) oEvent.preventDefault();
    if (oEvent.stopPropagation) oEvent.stopPropagation();
    oEvent.returnValue = false;
    oEvent.cancelBubble = true;
  }
}
