<include "/includes/header.tpl" />
      <div class="intro-header px-3 py-3 mx-auto mb-3 pb-md-3">
        <div class="py-4 text-center">
          <p class="lead font-weight-bold">Main Distribution Board</p>

          <div class="row">
            <div class="col-4 gauge-container three blue" id="graph-current-1"><span style="color: rgb(90, 131, 186);">Phase #1</span> Active Current</div>
            <div class="col-4 gauge-container three red" id="graph-current-2"><span style="color: rgb(181, 79, 80);">Phase #2</span> Active Current</div>
            <div class="col-4 gauge-container three green" id="graph-current-3"><span style="color: rgb(159, 185, 95);">Phase #3</span> Active Current</div>
          </div>
          <i class="font-weight-bold">Monthly Energy usage</i>
          <div class="row">
            <div class="col-12" id="graph-monthly-energy" style="height: 300px; width: 100%;"></div>
            <div class="col-12 mt-4"><i class="font-weight-bold">Last 30 days of Energy usage</i></div>
            <div class="col-12" id="graph-daily-energy" style="height: 300px; width: 100%;"></div>
            <div class="col-12 mt-4"><i class="font-weight-bold">Last 7 days of Power usage</i></div>
            <div class="col-12"><i>Click and drag to zoom into graph.</i></div>
            <div class="col-12" id="graph-voltage" style="height: 200px; width: 100%;"></div>
            <div class="col-12" id="graph-current" style="height: 200px; width: 100%;"></div>
            <div class="col-12" id="graph-power" style="height: 200px; width: 100%;"></div>
            <div class="col-12" id="graph-pf" style="height: 200px; width: 100%;"></div>
          </div>
        </div>
      </div>
      <script type="text/javascript">
        var dataVoltages = [ <?php
            foreach( $phases as $id => $phase )
            {
              echo <<< JS
{
            type: 'line',
            name: 'Phase #{$id}',
            legendMarkerType: 'square',
            showInLegend: true,
            yValueFormatString: '#0.#0V',
            xValueType: 'dateTime',
            xValueFormatString: 'DD MMM YY HH:mm',
            dataPoints: [

JS;

              foreach( $phase as $record )
              {
                $date = substr( $record['timestamp'], 0, -3 );
                $v = $record['avg_voltage'] ?? $record['voltage'];

                echo <<< JS
                    { x: new Date( '{$date}' ), y: {$v} },

JS;
              }
              
              echo <<< JS
              ]
            },

JS;
            }
?>
          ];

          var dataCurrents = [ <?php
            foreach( $phases as $id => $phase )
            {
              echo <<< JS
{
            type: 'line',
            name: 'Phase #{$id}',
            legendMarkerType: 'square',
            showInLegend: true,
            yValueFormatString: '#0.#0A',
            xValueType: 'dateTime',
            xValueFormatString: 'DD MMM YY HH:mm',
            dataPoints: [

JS;

              foreach( $phase as $record )
              {
                $date = substr( $record['timestamp'], 0, -3 );
                $c = $record['avg_current'] ?? $record['current'];

                echo <<< JS
              { x: new Date( '{$date}' ), y: {$c} },

JS;
              }
                  
              echo <<< JS
            ] },

JS;
            }
?>
          ];

          var dataPower = [ <?php
            foreach( $phases as $id => $phase )
            {
              echo <<< JS
{
            type: 'line',
            name: 'Phase #{$id}',
            legendMarkerType: 'square',
            showInLegend: true,
            yValueFormatString: '#0.#0kW',
            xValueType: 'dateTime',
            xValueFormatString: 'DD MMM YY HH:mm',
            dataPoints: [

JS;

              foreach( $phase as $record )
              {
                $date = substr( $record['timestamp'], 0, -3 );
                $p = $record['avg_power'] ?? $record['power'];
                echo <<< JS
                { x: new Date( '{$date}' ), y: {$p} },

JS;
              }
                  
              echo <<< JS
            ] },

JS;
            }
?>
          ];

          dataPF = [ <?php
            foreach( $phases as $id => $phase )
            {
              echo <<< JS
{
            type: 'line',
            name: 'Phase #{$id}',
            legendMarkerType: 'square',
            showInLegend: true,
            yValueFormatString: '#0.#0',
            xValueType: 'dateTime',
            xValueFormatString: 'DD MMM YY HH:mm',
            dataPoints: [

JS;

              foreach( $phase as $record )
              {
                $date = substr( $record['timestamp'], 0, -3 );
                $pf = $record['avg_pf'] ?? $record['pf'];
                echo <<< JS
                { x: new Date( '{$date}' ), y: {$pf} },

JS;
              }
                  
              echo <<< JS
            ] },

JS;
            }
?>
          ];

        dataMonthlyEnergy = [ <?php
            foreach( $monthly as $id => $phase )
            {
              echo <<< JS
            {
              type: 'stackedColumn',
              name: 'Phase #{$id}',
              legendMarkerType: 'square',
              showInLegend: true,
              yValueFormatString: "#0.#0kWh",
              xValueType: "string",
              xValueFormatString: "MMM YYYY",
              dataPoints: [

JS;

              foreach( $phase as $record )
              {
                echo <<< JS
                  { x: new Date( '{$record['date']}' ), y: {$record['total_e']} },

JS;
              }
                  
              echo <<< JS
              ]
            },

JS;
            }
?>
            {
              type: "line",
              color: "transparent",
              yValueFormatString: "#0.#0kWh",
              indexLabel: "Total: {y}",
              toolTipContent: null,
              dataPoints: []
            },
          ];

          dataDailyEnergy = [ <?php
              foreach( $daily as $id => $phase )
              {
                echo <<< JS
            {
                type: 'stackedColumn',
                name: 'Phase #{$id}',
                legendMarkerType: 'square',
                showInLegend: true,
                yValueFormatString: "#0.#0kWh",
                xValueType: "dateTime",
                xValueFormatString: "DD MMM YY",
                dataPoints: [

JS;

              foreach( $phase as $record )
              {
                echo <<< JS
                { x: new Date( '{$record['date']} 00:00' ), y: {$record['total_e']} },

JS;
              }
                  
              echo <<< JS
          ] },

JS;
            }
?>
        ];

        window.onload = function () {
          setInterval( function() {
            window.location.reload();
          }, 300000 );

          charts.push( new CanvasJS.Chart( 'graph-monthly-energy',  energyMonthlyChart  ) );
          charts.push( new CanvasJS.Chart( 'graph-daily-energy',  energyDailyChart  ) );
          charts.push( new CanvasJS.Chart( 'graph-voltage', voltageChart ) );
          charts.push( new CanvasJS.Chart( 'graph-current', currentChart ) );
          charts.push( new CanvasJS.Chart( 'graph-power',   powerChart   ) );
          charts.push( new CanvasJS.Chart( 'graph-pf',      pfChart      ) );

<?php
            foreach( $phases as $id => $phase )
            {
              $record = $phase[( count( $phase ) - 1 )];
              $current = $record['avg_current'] ?? $record['current'];
              $unused = 100 - $current;

              echo <<< JS
          var c{$id} = Gauge(
            document.getElementById( "graph-current-{$id}" ),
            {
              max: 100,
              value: {$current},
              label: function( val ) { return val.toFixed( 2 ) + 'A'; }
            }
          );
JS;
            }
?>

          syncCharts( charts, true, true, true );

          var chart = charts[0];
          for( var i = 0; i < chart.options.data[0].dataPoints.length; i++ )
          {
            console.log( chart.options.data[0].dataPoints[i].y + chart.options.data[1].dataPoints[i].y + chart.options.data[2].dataPoints[i].y );
            chart.options.data[3].dataPoints.push( {
              x: chart.options.data[0].dataPoints[i].x, 
              y: chart.options.data[0].dataPoints[i].y + chart.options.data[1].dataPoints[i].y + chart.options.data[2].dataPoints[i].y
            } );
          }

          charts.forEach( ( chart ) => {
            chart.render();
          } );

        };
      </script>
<include "/includes/footer.tpl" />


