(function(window, document) {
  let rela
  const xstep = 5 // 移动和缩放的横向方向上的步长
  const ystep = 5 // 移动和缩放的竖直方向上的步长
  function init(dom) {
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

  function clearEv(ev) {
    var oEvent = ev || event;
    if (oEvent.preventDefault) oEvent.preventDefault();
    if (oEvent.stopPropagation) oEvent.stopPropagation()
    oEvent.returnValue = false;
    oEvent.cancelBubble = true;
  }

  window.drag = {
    init,
    bindDownMove
  }
})(window, document)
