var charts = [];

var axisX = {
  labelAngle: 160,
  crosshair: {
    enabled: true,
    snapToDataPoint: true,
    valueFormatString: "DD/MM HH:mm"
  }
};

var energyMonthlyChart = {
  animationEnabled: false,
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  axisX: {
    labelAngle: 160,
    interval: 1,
    intervalType: "month",
    crosshair: {
      enabled: true,
      snapToDataPoint: true,
      valueFormatString: "MMM YYYY"
    }
  },
  axisY: {
    title: 'Energy (Monthly)',
    valueFormatString: '#0.#kWh',
    minimum: 0,
  },
  data: dataMonthlyEnergy
}

var energyDailyChart = {
  animationEnabled: false,
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  axisX: {
    labelAngle: 160,
    crosshair: {
      enabled: true,
      snapToDataPoint: true,
      valueFormatString: "DD/MM/YYYY"
    }
  },
  axisY: {
    title: 'Energy (daily)',
    valueFormatString: '#0.#kWh',
    minimum: 0,
  },
  data: dataDailyEnergy
}

var currentChart = {
  animationEnabled: false,
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  axisX: axisX,
  axisY: {
    title: 'Current',
    valueFormatString: '#0.#A',
  },
  data: dataCurrents
}

var powerChart = {
  animationEnabled: false,
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  axisX: axisX,
  axisY: {
    title: 'Power',
    valueFormatString: '#0.#kW',
    minimum: 0,
  },
  data: dataPower
}

var pfChart = {
  animationEnabled: false,
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  axisX: axisX,
  axisY: {
    title: 'Power Factor',
    valueFormatString: '#0.#',
  },
  data: dataPF
}

var voltageChart = {
  animationEnabled: false,
  axisX: axisX,
  axisY: {
    title: 'Voltage',
    valueFormatString: '#0.#V',
  },
  theme: 'dark1',
  toolTip: {
    shared: true,
  },
  data: dataVoltages
}

function syncCharts(charts, syncToolTip, syncCrosshair, syncAxisXRange)
{
  if( !this.onToolTipUpdated )
  {
    this.onToolTipUpdated = function( e ) {
      for (var j = 0; j < charts.length; j++) {
        if (charts[j] != e.chart)
          charts[j].toolTip.showAtX(e.entries[0].xValue);
      }
    }
  }

  if(!this.onToolTipHidden){
    this.onToolTipHidden = function(e) {
      for( var j = 0; j < charts.length; j++){
        if(charts[j] != e.chart)
          charts[j].toolTip.hide();
      }
    }
  }

  if(!this.onCrosshairUpdated){
    this.onCrosshairUpdated = function(e) {
      for(var j = 0; j < charts.length; j++){
        if(charts[j] != e.chart)
          charts[j].axisX[0].crosshair.showAt(e.value);
      }
    }
  }

  if(!this.onCrosshairHidden){
    this.onCrosshairHidden =  function(e) {
      for( var j = 0; j < charts.length; j++){
        if(charts[j] != e.chart)
          charts[j].axisX[0].crosshair.hide();
      }
    }
  }

  if(!this.onRangeChanged){
    this.onRangeChanged = function(e) {
      for (var j = 0; j < charts.length; j++) {
        if (e.trigger === "reset") {
          charts[j].options.axisX.viewportMinimum = charts[j].options.axisX.viewportMaximum = null;
          charts[j].options.axisY.viewportMinimum = charts[j].options.axisY.viewportMaximum = null;
          charts[j].render();
        } else if (charts[j] !== e.chart) {
          charts[j].options.axisX.viewportMinimum = e.axisX[0].viewportMinimum;
          charts[j].options.axisX.viewportMaximum = e.axisX[0].viewportMaximum;
          charts[j].render();
        }
      }
    }
  }

  for(var i = 0; i < charts.length; i++) { 

    //Sync ToolTip
    if(syncToolTip) {
      if(!charts[i].options.toolTip)
        charts[i].options.toolTip = {};

      charts[i].options.toolTip.updated = this.onToolTipUpdated;
      charts[i].options.toolTip.hidden = this.onToolTipHidden;
    }

    //Sync Crosshair
    if(syncCrosshair) {
      if(!charts[i].options.axisX)
        charts[i].options.axisX = { crosshair: { enabled: true }};

      charts[i].options.axisX.crosshair.updated = this.onCrosshairUpdated; 
      charts[i].options.axisX.crosshair.hidden = this.onCrosshairHidden; 
    }

    //Sync Zoom / Pan
    if(syncAxisXRange) {
      charts[i].options.zoomEnabled = true;
      charts[i].options.rangeChanged = this.onRangeChanged;
    }
  }
}
