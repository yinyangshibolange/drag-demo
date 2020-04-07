import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DragScale {
  rela;
  dom;
  xstep = 5; // 移动和缩放的横向方向上的步长
  ystep = 5; // 移动和缩放的竖直方向上的步长

  bindparas;

  listshow = false;
  chartInitHeight = 100;
  chartInitWidth = 100;

  constructor(dom) {
    this.rela = dom.parentNode;
    this.dom = dom;
  }

  init() {
    this.draginit();
    this.scaleinit();
  }

  bindparams(bindparas: any[]) {
    // 绑定外部属性，用以修改left, top, width, height 属性，以数组的形式
    this.bindparas = bindparas
  }

  draginit() {
    // 将dom转化为可拖拽的dom， 需要获取父级容器参数，父计容器只有，只向上寻找一级
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

    self.createZoomPoint(dom);
  }

  updateHeight() {
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
      if(this.bindparas && this.bindparas.length > 0) {
        this.bindparas.forEach(para => {
          para.left = relativeOffsetLeft
          para.top = realtiveOffsetTop
        })
      }
        inUnit.style.left = relativeOffsetLeft + 'px';
        inUnit.style.top = realtiveOffsetTop + 'px';

    }

    this.updateHeight();
  }

  unitActive(unit) {
    function zoomPointsDisplay(children, className, val) {
      for (let i = 0; i < children.length; i++) {
        const elem = children[i];
        if (elem.className.indexOf(className) > -1) elem.style.display = val;
      }
    }
    for (let i = 0; i < unit.parentNode.children.length; i++) {
      const ele = unit.parentNode.children[i];
      zoomPointsDisplay(ele.children, 'zoompoint', 'none');
    }
    zoomPointsDisplay(unit.children, 'zoompoint', 'block');
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
            })

            this.updateHeight();
          }
            unit.customResize({ left, top, width, height });

        };
        document.onmouseup = ev => {
          document.onmousemove = null;
        };
      });

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
