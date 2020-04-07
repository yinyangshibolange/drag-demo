### 使用方式
Angular使用方法：
createDragScaleUnit(ele_para) {
    const keys = this.keys;
    const configChartUnit = this.unit.createComponent(
      this.resolver.resolveComponentFactory(ChartConfigUnitComponent),
    );
    const elem = configChartUnit.location.nativeElement;
    console.log(elem);
    console.log(elem.parentNode);
    elem.style.width = ele_para.width + 'px';
    elem.style.height = ele_para.height + 'px';
    elem.style.left = ele_para.left + 'px';
    elem.style.top = ele_para.top + 'px';
    elem.style.position = 'absolute';
    const dragscale = new DragScale(elem);
    dragscale.init();
    dragscale.ele_para = ele_para;
    dragscale.bindparams([ele_para, configChartUnit.instance]);
    elem.addEventListener('mousedown', ev => {
      dragscale.unitActive(elem);
      dragscale.bindDownMove(ev, elem, () => {});
    });
    dragscale.unitActive(elem);
    keys.forEach(key => {
      configChartUnit.instance[key] = ele_para[key];
    });
    return { dragscale, configchartunit: configChartUnit };
  }
